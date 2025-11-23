import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Image,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import API from "../utils/api";
import styles from "./UserDashboard.styles";
import * as ImagePicker from 'expo-image-picker';

// Menu items array
const menuItems = [
  { id: "available", label: "Available Books", icon: "bookshelf" },
  { id: "borrowed", label: "Borrowed Books", icon: "book-account" },
  { id: "history", label: "History", icon: "history" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "profile", label: "Profile", icon: "account" },
];

export default function UserDashboard({ navigation, route }) {
  const name = route.params?.name || "User";
  const [activeSection, setActiveSection] = useState("available");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Edit Profile States
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    profile_image: "",
    role: "",
    created_at: ""
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const DRAWER_WIDTH = 280;
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [bookDetailsVisible, setBookDetailsVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAvailableBook, setIsAvailableBook] = useState(false);
  const cardScales = useRef({}).current;

  useEffect(() => {
    loadSectionData();
    if (activeSection === "profile") {
      loadProfileData();
    }
  }, [activeSection]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeSection]);

  const loadProfileData = async () => {
    try {
      const response = await API.get("/auth/me");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  const getCardScale = (id) => {
    if (!cardScales[id]) {
      cardScales[id] = new Animated.Value(1);
    }
    return cardScales[id];
  };

  const animateCard = (id, scale) => {
    Animated.spring(getCardScale(id), {
      toValue: scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const openDrawer = () => {
    Animated.spring(drawerAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    Animated.spring(drawerAnim, {
      toValue: -DRAWER_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const handleMenuPress = (section) => {
    setActiveSection(section);
    closeDrawer();
    
    setTimeout(() => {
      loadSectionData();
    }, 300);
  };

  const loadSectionData = async () => {
    try {
      setLoading(true);
      fadeAnim.setValue(0);
      switch (activeSection) {
        case "available":
          const booksResponse = await API.get("/books/");
          setAvailableBooks(booksResponse.data);
          break;
        case "borrowed":
          const borrowsResponse = await API.get("/books/my-borrows");
          setBorrowedBooks(borrowsResponse.data);
          break;
        case "history":
          const historyResponse = await API.get("/books/borrowing-history");
          setBorrowingHistory(historyResponse.data);
          break;
        case "notifications":
          const notificationsResponse = await API.get("/books/notifications");
          setNotifications(notificationsResponse.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSectionData();
    if (activeSection === "profile") {
      await loadProfileData();
    }
    setRefreshing(false);
  };

  const showBookDetails = (book, isAvailable = false) => {
    setSelectedBook(book);
    setIsAvailableBook(isAvailable);
    setBookDetailsVisible(true);
  };

  const borrowBook = async (bookId) => {
    try {
      console.log("Borrowing book with ID:", bookId);
      
      const response = await API.post("/books/borrow", {
        book_id: bookId,
        borrow_days: 14,
      });
  
      console.log("Borrow response:", response.data);
  
      setReceiptData({
        transactionId: response.data.receipt.transaction_id,
        bookTitle: response.data.receipt.book_title,
        requestDate: new Date(response.data.receipt.request_date).toLocaleDateString(),
        requestTime: new Date(response.data.receipt.request_date).toLocaleTimeString(),
        memberName: name,
        status: "pending",
        note: response.data.receipt.note
      });
      setReceiptVisible(true);
      loadSectionData();
    } catch (error) {
      console.error("Borrow error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to borrow book";
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      }
      
      Alert.alert("Error", errorMessage);
    }
  };
  
  const returnBook = async (borrowId) => {
    try {
      await API.post("/books/return", { borrow_id: borrowId });
      Alert.alert("Success", "Book returned successfully");
      loadSectionData();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to return book");
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await API.put(`/books/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? {...notif, is_read: true} : notif
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await API.delete(`/books/notifications/${notificationId}`);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#FFA500";
      case "borrowed": return "#007AFF";
      case "overdue": return "#FF3B30";
      case "returned": return "#34C759";
      case "rejected": return "#FF3B30";
      default: return "#8E8E93";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Pending Approval";
      case "borrowed": return "Borrowed";
      case "overdue": return "Overdue";
      case "returned": return "Returned";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const openEditProfile = () => {
    setEditProfileVisible(true);
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const updateProfile = async () => {
    try {
      setUpdatingProfile(true);

      const formData = new FormData();
      
      if (profileData.name) formData.append('name', profileData.name);
      if (profileData.dob) formData.append('dob', profileData.dob);
      if (profileData.gender) formData.append('gender', profileData.gender);
      if (profileData.address) formData.append('address', profileData.address);
      if (profileData.phone) formData.append('phone', profileData.phone);

      if (selectedImage) {
        const localUri = selectedImage.uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('profile_image', {
          uri: localUri,
          name: filename,
          type,
        });
      }

      const response = await API.put("/auth/profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert("Success", "Profile updated successfully");
      setEditProfileVisible(false);
      setSelectedImage(null);
      await loadProfileData();
      
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.response?.data?.detail || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const renderEditProfileModal = () => (
    <Modal
      visible={editProfileVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setEditProfileVisible(false)}
    >
      <View style={styles.editProfileModalOverlay}>
        <View style={styles.editProfileContainer}>
          <View style={styles.editProfileHeader}>
            <Text style={styles.editProfileHeaderText}>EDIT PROFILE</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditProfileVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editProfileScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.editProfileBody}>
              <View style={styles.profileImageSection}>
                <TouchableOpacity onPress={handleImagePick} style={styles.profileImageContainer}>
                  {(selectedImage?.uri || profileData.profile_image) ? (
                    <Image 
                      source={{ uri: selectedImage?.uri || profileData.profile_image }} 
                      style={styles.profileImageLarge}
                    />
                  ) : (
                    <View style={styles.profileImagePlaceholderLarge}>
                      <Text style={styles.profileImagePlaceholderTextLarge}>
                        {profileData.name?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.cameraIconOverlay}>
                    <MaterialCommunityIcons name="camera" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.profileImageHint}>Tap to change photo</Text>
              </View>

              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profileData.name}
                    onChangeText={(text) => setProfileData({...profileData, name: text})}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[styles.textInput, styles.disabledInput]}
                    value={profileData.email}
                    editable={false}
                    placeholder="Email (cannot be changed)"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profileData.dob}
                    onChangeText={(text) => setProfileData({...profileData, dob: text})}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderOptions}>
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderOption,
                          profileData.gender === gender && styles.genderOptionSelected
                        ]}
                        onPress={() => setProfileData({...profileData, gender})}
                      >
                        <Text style={[
                          styles.genderOptionText,
                          profileData.gender === gender && styles.genderOptionTextSelected
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profileData.phone}
                    onChangeText={(text) => setProfileData({...profileData, phone: text})}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={profileData.address}
                    onChangeText={(text) => setProfileData({...profileData, address: text})}
                    placeholder="Enter your address"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.editProfileActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={updateProfile}
              disabled={updatingProfile}
              activeOpacity={0.8}
            >
              {updatingProfile ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setEditProfileVisible(false)}
              disabled={updatingProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderBookDetailsModal = () => (
    <Modal
      visible={bookDetailsVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setBookDetailsVisible(false)}
    >
      <View style={styles.bookDetailsModalOverlay}>
        <View style={styles.bookDetailsContainer}>
          <View style={styles.bookDetailsHeader}>
            <Text style={styles.bookDetailsHeaderText}>BOOK DETAILS</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBookDetailsVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bookDetailsScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.bookDetailsBody}>
              <View style={styles.bookImageContainer}>
                {selectedBook?.image_url ? (
                  <Image 
                    source={{ uri: selectedBook.image_url }} 
                    style={styles.bookDetailsImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.bookDetailsImagePlaceholder}>
                    <MaterialCommunityIcons name="book" size={60} color="#007AFF" />
                  </View>
                )}
              </View>

              <View style={styles.bookInfoSection}>
                <Text style={styles.bookDetailsTitle}>{selectedBook?.title}</Text>
                <Text style={styles.bookDetailsAuthor}>by {selectedBook?.author}</Text>
                
                {!isAvailableBook && (
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(selectedBook?.status) }]}>
                      <Text style={styles.statusTextLarge}>{getStatusText(selectedBook?.status)}</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.sectionDivider} />

              {!isAvailableBook && selectedBook?._id && (
                <View style={styles.borrowIdSection}>
                  <Text style={styles.sectionTitle}>Borrow Information</Text>
                  <View style={styles.borrowIdContainer}>
                    <Text style={styles.borrowIdLabel}>BORROW ID:</Text>
                    <Text style={styles.borrowIdValue}>{selectedBook._id}</Text>
                    <Text style={styles.borrowIdNote}>
                      Present this ID to the librarian when borrowing the book
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.sectionDivider} />

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Book Information</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ISBN:</Text>
                  <Text style={styles.detailValue}>{selectedBook?.isbn || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{selectedBook?.category || selectedBook?.genre || "General"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Publisher:</Text>
                  <Text style={styles.detailValue}>{selectedBook?.publisher || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Published Year:</Text>
                  <Text style={styles.detailValue}>{selectedBook?.published_year || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Copies:</Text>
                  <Text style={styles.detailValue}>{selectedBook?.total_copies || 1}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Available Copies:</Text>
                  <Text style={styles.detailValue}>{selectedBook?.available_copies || 0}</Text>
                </View>
              </View>

              <View style={styles.sectionDivider} />

              {selectedBook?.description && (
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.bookDescription}>{selectedBook.description}</Text>
                </View>
              )}

              {!isAvailableBook && (
                <>
                  <View style={styles.sectionDivider} />

                  <View style={styles.borrowingSection}>
                    <Text style={styles.sectionTitle}>Borrowing Timeline</Text>
                    
                    {selectedBook?.request_date && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Request Date:</Text>
                        <Text style={styles.detailValue}>
                          {new Date(selectedBook.request_date).toLocaleDateString()} at {new Date(selectedBook.request_date).toLocaleTimeString()}
                        </Text>
                      </View>
                    )}
                    
                    {selectedBook?.borrow_date && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Borrow Date:</Text>
                        <Text style={styles.detailValue}>
                          {new Date(selectedBook.borrow_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    
                    {selectedBook?.due_date && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due Date:</Text>
                        <Text style={[styles.detailValue, 
                          selectedBook.status === "overdue" && styles.overdueText
                        ]}>
                          {new Date(selectedBook.due_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    
                    {selectedBook?.return_date && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Return Date:</Text>
                        <Text style={styles.detailValue}>
                          {new Date(selectedBook.return_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    
                    {selectedBook?.fine_amount > 0 && (
                      <View style={styles.fineContainer}>
                        <Text style={styles.fineLabel}>Fine Amount:</Text>
                        <Text style={styles.fineAmount}>${selectedBook.fine_amount}</Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.bookDetailsActions}>
            {isAvailableBook ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.borrowButton,
                  selectedBook?.available_copies === 0 && styles.disabledButton
                ]}
                onPress={() => {
                  borrowBook(selectedBook._id);
                  setBookDetailsVisible(false);
                }}
                disabled={selectedBook?.available_copies === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {selectedBook?.available_copies === 0 ? "Not Available" : "Request to Borrow"}
                </Text>
              </TouchableOpacity>
            ) : (
              (selectedBook?.status === "borrowed" || selectedBook?.status === "overdue") && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.returnButton]}
                  onPress={() => {
                    returnBook(selectedBook._id);
                    setBookDetailsVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Return Book</Text>
                </TouchableOpacity>
              )
            )}
            
            <TouchableOpacity
              style={[styles.actionButton, styles.closeDetailsButton]}
              onPress={() => setBookDetailsVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderReceipt = () => (
    <Modal
      visible={receiptVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setReceiptVisible(false)}
    >
      <View style={styles.receiptModalOverlay}>
        <View style={styles.receiptContainer}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptHeaderText}>LIBRARY BORROW REQUEST</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setReceiptVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.receiptScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.receiptBody}>
              <View style={styles.receiptSection}>
                <Text style={styles.receiptLabel}>REQUEST NO.</Text>
                <Text style={styles.receiptValue}>{receiptData?.transactionId}</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptSection}>
                <Text style={styles.receiptLabel}>DATE</Text>
                <Text style={styles.receiptValue}>{receiptData?.requestDate}</Text>
              </View>

              <View style={styles.receiptSection}>
                <Text style={styles.receiptLabel}>TIME</Text>
                <Text style={styles.receiptValue}>{receiptData?.requestTime}</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptSection}>
                <Text style={styles.receiptLabel}>MEMBER NAME</Text>
                <Text style={styles.receiptValue}>{receiptData?.memberName}</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptSection}>
                <Text style={styles.receiptLabel}>BOOK TITLE</Text>
                <Text style={styles.receiptBookTitle}>{receiptData?.bookTitle}</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptSection}>
                <Text style={styles.receiptLabel}>STATUS:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(receiptData?.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(receiptData?.status)}</Text>
                </View>
              </View>

              <View style={styles.receiptDividerThick} />

              <View style={styles.receiptFooterSection}>
                <Text style={styles.receiptFooterText}>
                  {receiptData?.note}
                </Text>
                <Text style={styles.receiptFooterNote}>
                  You will receive a notification once your request is approved.
                </Text>
              </View>

              <View style={styles.receiptBarcode}>
                <View style={styles.barcodeLines}>
                  {[...Array(20)].map((_, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.barcodeLine,
                        { width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1 }
                      ]} 
                    />
                  ))}
                </View>
                <Text style={styles.barcodeText}>{receiptData?.transactionId}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderAvailableBooks = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Available Books</Text>
      </View>
      <View style={styles.booksGrid}>
        {availableBooks.map((book) => (
          <Animated.View 
            key={book._id}
            style={[
              styles.bookCard,
              {
                transform: [{ scale: getCardScale(book._id) }]
              }
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => animateCard(book._id, 0.97)}
              onPressOut={() => animateCard(book._id, 1)}
              onPress={() => showBookDetails(book, true)}
            >
              <View style={styles.bookSpine} />
              <View style={styles.bookContent}>
                <TouchableOpacity
                  onPress={() => showBookDetails(book, true)}
                  activeOpacity={0.8}
                >
                  {book.image_url ? (
                    <Image 
                      source={{ uri: book.image_url }} 
                      style={styles.bookImage}
                      resizeMode="cover"
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                  ) : (
                    <View style={styles.bookImagePlaceholder}>
                      <MaterialCommunityIcons name="book" size={50} color="#007AFF" />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.bookCornerDecoration} />
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor}>by {book.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{book.category || book.genre}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Available</Text>
                    <View style={styles.availabilityBadge}>
                      <Text style={styles.availabilityText}>{book.available_copies}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewDetailsButton]}
                  onPress={() => showBookDetails(book, true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.borrowButton,
                    book.available_copies === 0 && styles.disabledButton
                  ]}
                  onPress={() => borrowBook(book._id)}
                  disabled={book.available_copies === 0}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>
                    {book.available_copies === 0 ? "Not Available" : "Request to Borrow"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderBorrowedBooks = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>My Borrowed Books</Text>
      </View>
      <View style={styles.booksGrid}>
        {borrowedBooks.map((record) => {
          const isOverdue = record.status === "overdue" || (record.due_date && new Date(record.due_date) < new Date());
          const status = record.status || (isOverdue ? "overdue" : "borrowed");
          
          return (
            <Animated.View 
              key={record._id}
              style={[
                styles.bookCard,
                {
                  transform: [{ scale: getCardScale(record._id) }]
                }
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => animateCard(record._id, 0.97)}
                onPressOut={() => animateCard(record._id, 1)}
                onPress={() => showBookDetails({...record, ...record.book}, false)}
              >
                <View style={[styles.bookSpine, { backgroundColor: getStatusColor(status) }]} />
                <View style={styles.bookContent}>
                  <TouchableOpacity
                    onPress={() => showBookDetails({...record, ...record.book}, false)}
                    activeOpacity={0.8}
                  >
                    {record.book?.image_url ? (
                      <Image 
                        source={{ uri: record.book.image_url }} 
                        style={styles.bookImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.bookImagePlaceholder}>
                        <MaterialCommunityIcons name="book" size={50} color="#007AFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  <View style={[styles.bookCornerDecoration, { backgroundColor: getStatusColor(status) }]} />
                  <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                  <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                  <View style={styles.divider} />
                  
                  <View style={styles.borrowIdCard}>
                    <Text style={styles.borrowIdCardLabel}>BORROW ID</Text>
                    <Text style={styles.borrowIdCardValue}>{record._id}</Text>
                    <Text style={styles.borrowIdCardNote}>
                      Show this to the librarian
                    </Text>
                  </View>
                  
                  <View style={styles.bookDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                        <Text style={styles.statusText}>{getStatusText(status)}</Text>
                      </View>
                    </View>
                    
                    {record.request_date && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Requested: </Text>
                        <Text style={styles.detailValue}>
                          {new Date(record.request_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    
                    {record.due_date && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due Date</Text>
                        <Text style={styles.detailValue}>
                          {new Date(record.due_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewDetailsButton]}
                    onPress={() => showBookDetails({...record, ...record.book}, false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>View Details</Text>
                  </TouchableOpacity>
                  
                  {status === "borrowed" || status === "overdue" ? (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.returnButton]}
                      onPress={() => returnBook(record._id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.buttonText}>Return Book</Text>
                    </TouchableOpacity>
                  ) : status === "pending" ? (
                    <View style={[styles.actionButton, styles.pendingButton]}>
                      <Text style={styles.buttonText}>Waiting for Approval</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderBorrowingHistory = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Borrowing History</Text>
      </View>
      <View style={styles.booksGrid}>
        {borrowingHistory.map((record) => (
          <Animated.View 
            key={record._id}
            style={[
              styles.bookCard,
              {
                transform: [{ scale: getCardScale(record._id) }]
              }
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => animateCard(record._id, 0.97)}
              onPressOut={() => animateCard(record._id, 1)}
              onPress={() => showBookDetails({...record, ...record.book}, false)}
            >
              <View style={[styles.bookSpine, { backgroundColor: getStatusColor(record.status) }]} />
              <View style={styles.bookContent}>
                <TouchableOpacity
                  onPress={() => showBookDetails({...record, ...record.book}, false)}
                  activeOpacity={0.8}
                >
                  {record.book?.image_url ? (
                    <Image 
                      source={{ uri: record.book.image_url }} 
                      style={styles.bookImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.bookImagePlaceholder}>
                      <MaterialCommunityIcons name="book" size={50} color="#007AFF" />
                    </View>
                  )}
                </TouchableOpacity>
                
                <View style={[styles.bookCornerDecoration, { backgroundColor: getStatusColor(record.status) }]} />
                <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                <View style={styles.divider} />
                
                <View style={styles.borrowIdCard}>
                  <Text style={styles.borrowIdCardLabel}>BORROW ID</Text>
                  <Text style={styles.borrowIdCardValue}>{record._id}</Text>
                </View>
                
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(record.status)}</Text>
                    </View>
                  </View>
                  
                  {record.request_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Requested: </Text>
                      <Text style={styles.detailValue}>
                        {new Date(record.request_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  
                  {record.borrow_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Borrowed</Text>
                      <Text style={styles.detailValue}>
                        {new Date(record.borrow_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  
                  {record.return_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Returned</Text>
                      <Text style={styles.detailValue}>
                        {new Date(record.return_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  
                  {record.fine_amount > 0 && (
                    <View style={styles.fineContainer}>
                      <Text style={styles.fineText}>Fine: ${record.fine_amount}</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewDetailsButton]}
                  onPress={() => showBookDetails({...record, ...record.book}, false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderNotifications = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Notifications</Text>
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateCircle}>
            <MaterialCommunityIcons name="bell-off" size={60} color="#ccc" />
          </View>
          <Text style={styles.emptyStateText}>No new notifications</Text>
          <Text style={styles.emptyStateSubtext}>
            We'll notify you about due dates and updates
          </Text>
        </View>
      ) : (
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <View 
              key={notification._id} 
              style={[
                styles.notificationCard,
                !notification.is_read && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationHeader}>
                <MaterialCommunityIcons 
                  name={notification.type === "overdue" ? "alert-circle" : "information"} 
                  size={24} 
                  color={notification.type === "overdue" ? "#FF3B30" : "#007AFF"} 
                  style={styles.notificationIcon}
                />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.notificationActions}>
                {!notification.is_read && (
                  <TouchableOpacity 
                    onPress={() => markNotificationAsRead(notification._id)}
                    style={styles.notificationAction}
                  >
                    <MaterialCommunityIcons name="check" size={18} color="#007AFF" />
                    <Text style={styles.notificationActionText}>Mark Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => deleteNotification(notification._id)}
                  style={styles.notificationAction}
                >
                  <MaterialCommunityIcons name="delete" size={18} color="#FF3B30" />
                  <Text style={styles.notificationActionText}>Delete</Text>
                </TouchableOpacity>
              </View>
              {notification.type === "overdue" && (
                <View style={styles.overdueIndicator}>
                  <Text style={styles.overdueIndicatorText}>OVERDUE</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderProfileSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Profile Settings</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircleLarge}>
            {profileData.profile_image ? (
              <Image 
                source={{ uri: profileData.profile_image }} 
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarTextLarge}>
                {profileData.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            )}
            <View style={styles.avatarRingLarge} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name || name}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>
                {profileData.role?.toUpperCase() || 'MEMBER'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="cake" size={20} color="#007AFF" />
            <View style={styles.detailItemText}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <Text style={styles.detailValue}>{profileData.dob || 'Not set'}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="gender-male-female" size={20} color="#007AFF" />
            <View style={styles.detailItemText}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{profileData.gender || 'Not set'}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="phone" size={20} color="#007AFF" />
            <View style={styles.detailItemText}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{profileData.phone || 'Not set'}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
            <View style={styles.detailItemText}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{profileData.address || 'Not set'}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
            <View style={styles.detailItemText}>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>
                {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editProfileButton]}
            onPress={openEditProfile}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => navigation.replace("Login")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#FF3B30" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDot2]} />
            <View style={[styles.loadingDot, styles.loadingDot3]} />
          </View>
          <Text style={styles.loadingText}>Loading your library...</Text>
        </View>
      );
    }

    switch (activeSection) {
      case "available":
        return renderAvailableBooks();
      case "borrowed":
        return renderBorrowedBooks();
      case "history":
        return renderBorrowingHistory();
      case "notifications":
        return renderNotifications();
      case "profile":
        return renderProfileSection();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      )}

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: drawerAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoImageContainer}>
            <Image 
              source={require('../assets/images/TUP.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.libraryName}>IT Thesis Library</Text>
          <View style={styles.logoUnderline} />
        </View>
        
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, activeSection === item.id && styles.activeMenuItem]}
              onPress={() => handleMenuPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={22} 
                  color={activeSection === item.id ? "#007AFF" : "#666"}
                  style={styles.menuIcon}
                />
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuText, activeSection === item.id && styles.activeMenuText]}>
                    {item.label}
                  </Text>
                  {item.id === "notifications" && notifications.filter(n => !n.is_read).length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notifications.filter(n => !n.is_read).length}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {activeSection === item.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={toggleDrawer}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.welcomeTitle}>Welcome back, {profileData.name || name}</Text>
            <Text style={styles.welcomeSubtitle}>Explore your literary journey</Text>
          </View>
        </View>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
        >
          {renderContent()}
        </ScrollView>
      </View>

      {renderBookDetailsModal()}
      {renderReceipt()}
      {renderEditProfileModal()}
    </View>
  );
}
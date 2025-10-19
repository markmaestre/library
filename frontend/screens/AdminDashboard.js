import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Animated,
  Image,
  Platform,
  RefreshControl,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import API from "../utils/api";
import styles from "./AdminDashboard.styles";

// Custom Image Component with Cache Busting
const CacheBustImage = ({ source, style, ...props }) => {
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    if (source?.uri) {
      // Add timestamp to bust cache
      const uriWithTimestamp = `${source.uri}?t=${Date.now()}`;
      setImageUri(uriWithTimestamp);
    }
  }, [source?.uri]);

  return (
    <Image
      source={imageUri ? { uri: imageUri } : source}
      style={style}
      {...props}
    />
  );
};

export default function AdminDashboard({ navigation, route }) {
  const name = route.params?.name || "Admin";
  const [activeSection, setActiveSection] = useState("manage");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allBorrowRecords, setAllBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [banModalVisible, setBanModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-280)).current;
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    published_year: "",
    publisher: "",
    total_copies: "1",
    available_copies: "1",
    image_url: ""
  });

  useEffect(() => {
    loadSectionData();
    animateSectionChange();
  }, [activeSection]);

  const animateSectionChange = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -240 : 0;
    Animated.spring(drawerAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    if (isDrawerOpen) {
      Animated.spring(drawerAnim, {
        toValue: -240,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
      setIsDrawerOpen(false);
    }
  };

  const handleMenuPress = (section) => {
    setActiveSection(section);
    closeDrawer();
  };

  const loadSectionData = async () => {
    try {
      switch (activeSection) {
        case "manage":
          await loadBooks();
          break;
        case "users":
          await loadUsers();
          break;
        case "requests":
          await loadPendingRequests();
          break;
        case "borrows":
          await loadAllBorrowRecords();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSectionData();
    setRefreshing(false);
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await API.get("/books/all");
      
      // Add cache busting to image URLs
      const booksWithCacheBust = response.data.map(book => ({
        ...book,
        image_url: book.image_url ? book.image_url : null,
        _version: Date.now() // Force re-render
      }));
      
      setBooks(booksWithCacheBust);
    } catch (error) {
      console.error("Error loading books:", error);
      Alert.alert("Error", "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await API.get("/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await API.get("/books/pending-requests");
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error loading pending requests:", error);
      Alert.alert("Error", "Failed to load pending requests");
    } finally {
      setRequestsLoading(false);
    }
  };

  const loadAllBorrowRecords = async () => {
    try {
      setRequestsLoading(true);
      const response = await API.get("/books/admin/borrow-records");
      setAllBorrowRecords(response.data);
    } catch (error) {
      console.error("Error loading borrow records:", error);
      Alert.alert("Error", "Failed to load borrow records");
    } finally {
      setRequestsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      description: "",
      published_year: "",
      publisher: "",
      total_copies: "1",
      available_copies: "1",
      image_url: ""
    });
    setSelectedImage(null);
    setEditingBook(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['title', 'author', 'isbn', 'category'];
    for (let field of required) {
      if (!formData[field].trim()) {
        Alert.alert("Error", `${field.replace('_', ' ')} is required`);
        return false;
      }
    }
    
    // Validate copies
    if (parseInt(formData.total_copies) < parseInt(formData.available_copies)) {
      Alert.alert("Error", "Available copies cannot exceed total copies");
      return false;
    }
    
    return true;
  };

  // Request permissions for image picker
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // Clear the URL input when selecting a new image
        handleInputChange('image_url', '');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // Clear the URL input when taking a new photo
        handleInputChange('image_url', '');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Upload image to server
  const uploadImage = async (imageUri) => {
    try {
      setUploading(true);
      
      // Create form data for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `book_${Date.now()}.jpg`,
      });

      // Upload image to the server
      const uploadResponse = await API.post('/books/upload-image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return uploadResponse.data.image_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddBook = async () => {
    if (!validateForm()) return;

    try {
      setUploading(true);
      
      let imageUrl = formData.image_url;

      // If a new image is selected, upload it first
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage);
        } catch (error) {
          Alert.alert("Error", "Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }
      }

      // Create FormData for multipart form submission
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('isbn', formData.isbn);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('total_copies', formData.total_copies);
      formDataToSend.append('available_copies', formData.available_copies);
      
      if (formData.published_year) {
        formDataToSend.append('published_year', formData.published_year);
      }
      if (formData.publisher) {
        formDataToSend.append('publisher', formData.publisher);
      }
      if (imageUrl) {
        formDataToSend.append('image_url', imageUrl);
      }

      // If we have a new image file, append it directly
      if (selectedImage && !imageUrl) {
        formDataToSend.append('image', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: `book_${Date.now()}.jpg`,
        });
      }

      const response = await API.post("/books/", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      Alert.alert("Success", "Book added successfully");
      setModalVisible(false);
      resetForm();
      await loadBooks(); // Wait for reload to complete
    } catch (error) {
      console.error('Add book error:', error.response?.data);
      Alert.alert("Error", error.response?.data?.detail || "Failed to add book");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateBook = async () => {
    if (!validateForm() || !editingBook) return;

    try {
      setUploading(true);
      
      let imageUrl = formData.image_url;

      // If a new image is selected, upload it first
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage);
        } catch (error) {
          Alert.alert("Error", "Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }
      }

      // Create FormData for multipart form submission
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('isbn', formData.isbn);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('total_copies', formData.total_copies);
      formDataToSend.append('available_copies', formData.available_copies);
      
      if (formData.published_year) {
        formDataToSend.append('published_year', formData.published_year);
      }
      if (formData.publisher) {
        formDataToSend.append('publisher', formData.publisher);
      }

      // Always include image_url, even if empty (to clear existing image)
      formDataToSend.append('image_url', imageUrl || '');

      const response = await API.put(`/books/${editingBook._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      Alert.alert("Success", "Book updated successfully");
      setModalVisible(false);
      resetForm();
      
      // Force reload books and update state
      await loadBooks();
      
      // Additional cache busting for the updated book
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book._id === editingBook._id 
            ? { 
                ...book, 
                image_url: imageUrl ? `${imageUrl}?t=${Date.now()}` : imageUrl,
                _version: Date.now() // Force re-render
              } 
            : book
        )
      );
      
    } catch (error) {
      console.error('Update book error:', error.response?.data);
      Alert.alert("Error", error.response?.data?.detail || "Failed to update book");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      Alert.alert(
        "Delete Book",
        "Are you sure you want to delete this book?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: async () => {
              try {
                await API.delete(`/books/${bookId}`);
                Alert.alert("Success", "Book deleted successfully");
                loadBooks();
              } catch (error) {
                Alert.alert("Error", error.response?.data?.detail || "Failed to delete book");
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to delete book");
    }
  };

  const handleBanUser = async (userId) => {
    if (!banReason.trim()) {
      Alert.alert("Error", "Please provide a ban reason");
      return;
    }

    try {
      await API.post(`/auth/users/${userId}/ban`, { reason: banReason });
      Alert.alert("Success", "User banned successfully");
      setBanModalVisible(false);
      setBanReason("");
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await API.post(`/auth/users/${userId}/unban`);
      Alert.alert("Success", "User unbanned successfully");
      loadUsers();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to unban user");
    }
  };

  // BORROW REQUEST MANAGEMENT
  const handleApproveRequest = async (borrowId) => {
    try {
      await API.put(`/books/approve-borrow/${borrowId}`);
      Alert.alert("Success", "Borrow request approved successfully");
      loadPendingRequests();
      loadBooks(); // Refresh books to update available copies
    } catch (error) {
      console.error('Approve request error:', error.response?.data);
      Alert.alert("Error", error.response?.data?.detail || "Failed to approve request");
    }
  };

  const handleRejectRequest = async (borrowId) => {
    try {
      Alert.alert(
        "Reject Request",
        "Are you sure you want to reject this borrow request?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Reject", 
            style: "destructive",
            onPress: async () => {
              try {
                await API.put(`/books/reject-borrow/${borrowId}`);
                Alert.alert("Success", "Borrow request rejected");
                loadPendingRequests();
              } catch (error) {
                Alert.alert("Error", error.response?.data?.detail || "Failed to reject request");
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to reject request");
    }
  };

  // STATUS MANAGEMENT
  const handleUpdateStatus = async (borrowId, newStatus) => {
    try {
      let endpoint = '';
      let payload = {};

      switch (newStatus) {
        case 'approved':
          endpoint = `/books/approve-borrow/${borrowId}`;
          break;
        case 'rejected':
          endpoint = `/books/reject-borrow/${borrowId}`;
          break;
        case 'returned':
          // For marking as returned, we need to call the return endpoint
          endpoint = '/books/return';
          payload = { borrow_id: borrowId };
          break;
        default:
          Alert.alert("Error", "Invalid status");
          return;
      }

      if (newStatus === 'returned') {
        await API.post(endpoint, payload);
      } else {
        await API.put(endpoint);
      }

      Alert.alert("Success", `Status updated to ${newStatus}`);
      setStatusModalVisible(false);
      setSelectedRecord(null);
      
      // Refresh data
      if (activeSection === 'requests') {
        loadPendingRequests();
      } else {
        loadAllBorrowRecords();
      }
      loadBooks();
      
    } catch (error) {
      console.error('Update status error:', error.response?.data);
      Alert.alert("Error", error.response?.data?.detail || "Failed to update status");
    }
  };

  const openStatusModal = (record) => {
    setSelectedRecord(record);
    setStatusModalVisible(true);
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

  const getAvailableStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return [
          { value: 'approved', label: 'Approve', color: '#34C759' },
          { value: 'rejected', label: 'Reject', color: '#FF3B30' }
        ];
      case 'borrowed':
        return [
          { value: 'returned', label: 'Mark as Returned', color: '#34C759' }
        ];
      case 'overdue':
        return [
          { value: 'returned', label: 'Mark as Returned', color: '#34C759' }
        ];
      default:
        return [];
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      category: book.category || "",
      description: book.description || "",
      published_year: book.published_year?.toString() || "",
      publisher: book.publisher || "",
      total_copies: book.total_copies?.toString() || "1",
      available_copies: book.available_copies?.toString() || "1",
      image_url: book.image_url || ""
    });
    setSelectedImage(null); // Reset selected image when editing
    setModalVisible(true);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setBanReason("");
    setBanModalVisible(true);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // Add this function to handle image URL input separately
  const handleImageUrlInput = (url) => {
    handleInputChange('image_url', url);
    setSelectedImage(null); // Clear selected image when URL is entered
  };

  const renderManageBooks = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Manage Books</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add Book</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      ) : books.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No books found</Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={openAddModal}>
            <Text style={styles.emptyStateButtonText}>Add Your First Book</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.booksGrid}>
          {books.map((book) => (
            <View key={book._id + (book._version || '')} style={styles.bookCard}>
              <View style={styles.bookSpine} />
              <View style={styles.bookContent}>
                {book.image_url ? (
                  <CacheBustImage 
                    source={{ uri: book.image_url }} 
                    style={styles.bookImage}
                    resizeMode="cover"
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                  />
                ) : (
                  <View style={styles.bookImagePlaceholder}>
                    <Text style={styles.bookImagePlaceholderText}>📚</Text>
                  </View>
                )}
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor}>by {book.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ISBN</Text>
                    <Text style={styles.detailValue}>{book.isbn}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <View style={styles.genrePill}>
                      <Text style={styles.genreText}>{book.category}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Copies</Text>
                    <Text style={styles.detailValue}>
                      {book.available_copies}/{book.total_copies}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[
                      styles.statusBadge,
                      book.available_copies === 0 && styles.outOfStockBadge
                    ]}>
                      <Text style={styles.statusText}>
                        {book.available_copies === 0 ? "Out of Stock" : "In Stock"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bookActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditModal(book)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteBook(book._id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderManageUsers = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Manage Users</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadUsers}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {usersLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No users found</Text>
        </View>
      ) : (
        <View style={styles.booksGrid}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={[
                styles.bookSpine,
                user.is_banned ? styles.bannedSpine : styles.activeSpine
              ]} />
              <View style={styles.bookContent}>
                <Text style={styles.bookTitle} numberOfLines={1}>{user.name}</Text>
                <Text style={styles.bookAuthor}>{user.email}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Role</Text>
                    <View style={[
                      styles.roleBadge,
                      user.role === "admin" && styles.adminRoleBadge
                    ]}>
                      <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[
                      styles.statusBadge,
                      user.is_banned && styles.bannedBadge
                    ]}>
                      <Text style={styles.statusText}>
                        {user.is_banned ? "BANNED" : "ACTIVE"}
                      </Text>
                    </View>
                  </View>
                  {user.created_at && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Joined</Text>
                      <Text style={styles.detailValue}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  {user.is_banned && user.ban_reason && (
                    <View style={styles.banReasonContainer}>
                      <Text style={styles.banReasonText}>
                        Reason: {user.ban_reason}
                      </Text>
                    </View>
                  )}
                </View>
                {user.role !== "admin" && (
                  <View style={styles.bookActions}>
                    {user.is_banned ? (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.unbanButton]}
                        onPress={() => handleUnbanUser(user.id)}
                      >
                        <Text style={styles.buttonText}>Unban User</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.banButton]}
                        onPress={() => openBanModal(user)}
                      >
                        <Text style={styles.buttonText}>Ban User</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderPendingRequests = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Pending Borrow Requests</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadPendingRequests}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {requestsLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : pendingRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No pending requests</Text>
          <Text style={styles.emptyStateSubtext}>
            All borrow requests have been processed
          </Text>
        </View>
      ) : (
        <View style={styles.booksGrid}>
          {pendingRequests.map((request) => (
            <View key={request._id} style={styles.bookCard}>
              <View style={[styles.bookSpine, { backgroundColor: getStatusColor(request.status) }]} />
              <View style={styles.bookContent}>
                {request.book?.image_url ? (
                  <CacheBustImage 
                    source={{ uri: request.book.image_url }} 
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.bookImagePlaceholder}>
                    <Text style={styles.bookImagePlaceholderText}>📚</Text>
                  </View>
                )}
                <Text style={styles.bookTitle} numberOfLines={2}>{request.book?.title}</Text>
                <Text style={styles.bookAuthor}>by {request.book?.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Requested By</Text>
                    <Text style={styles.detailValue}>{request.user_name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{request.user_email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Request Date</Text>
                    <Text style={styles.detailValue}>
                      {new Date(request.request_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.detailRow}
                    onPress={() => openStatusModal(request)}
                  >
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                    </View>
                  </TouchableOpacity>
                  {request.book && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Available Copies</Text>
                      <Text style={styles.detailValue}>
                        {request.book.available_copies}/{request.book.total_copies}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.bookActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApproveRequest(request._id)}
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectRequest(request._id)}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderAllBorrows = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>All Borrow Records</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadAllBorrowRecords}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {requestsLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading borrow records...</Text>
        </View>
      ) : allBorrowRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No borrow records found</Text>
        </View>
      ) : (
        <View style={styles.booksGrid}>
          {allBorrowRecords.map((record) => (
            <View key={record._id} style={styles.bookCard}>
              <View style={[styles.bookSpine, { backgroundColor: getStatusColor(record.status) }]} />
              <View style={styles.bookContent}>
                {record.book?.image_url ? (
                  <CacheBustImage 
                    source={{ uri: record.book.image_url }} 
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.bookImagePlaceholder}>
                    <Text style={styles.bookImagePlaceholderText}>📚</Text>
                  </View>
                )}
                <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Borrowed By</Text>
                    <Text style={styles.detailValue}>{record.user_name}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.detailRow}
                    onPress={() => openStatusModal(record)}
                  >
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(record.status)}</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {record.request_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Requested</Text>
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
                  
                  {record.due_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Due Date</Text>
                      <Text style={styles.detailValue}>
                        {new Date(record.due_date).toLocaleDateString()}
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
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Fine</Text>
                      <Text style={[styles.detailValue, styles.fineText]}>
                        ${record.fine_amount}
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Show action buttons for active borrows */}
                {(record.status === 'borrowed' || record.status === 'overdue') && (
                  <View style={styles.bookActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.returnButton]}
                      onPress={() => handleUpdateStatus(record._id, 'returned')}
                    >
                      <Text style={styles.buttonText}>Mark Returned</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderStatistics = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccent} />
        <Text style={styles.sectionTitle}>Statistics</Text>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📚</Text>
          </View>
          <Text style={styles.statNumber}>{books.length}</Text>
          <Text style={styles.statLabel}>Total Books</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📖</Text>
          </View>
          <Text style={styles.statNumber}>
            {books.reduce((sum, book) => sum + book.total_copies, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Copies</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>✅</Text>
          </View>
          <Text style={styles.statNumber}>
            {books.reduce((sum, book) => sum + book.available_copies, 0)}
          </Text>
          <Text style={styles.statLabel}>Available Copies</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📕</Text>
          </View>
          <Text style={styles.statNumber}>
            {books.reduce((sum, book) => sum + (book.total_copies - book.available_copies), 0)}
          </Text>
          <Text style={styles.statLabel}>Borrowed Copies</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>👥</Text>
          </View>
          <Text style={styles.statNumber}>
            {users.length}
          </Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>🚫</Text>
          </View>
          <Text style={styles.statNumber}>
            {users.filter(user => user.is_banned).length}
          </Text>
          <Text style={styles.statLabel}>Banned Users</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>⏳</Text>
          </View>
          <Text style={styles.statNumber}>
            {pendingRequests.length}
          </Text>
          <Text style={styles.statLabel}>Pending Requests</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📋</Text>
          </View>
          <Text style={styles.statNumber}>
            {allBorrowRecords.length}
          </Text>
          <Text style={styles.statLabel}>Total Borrows</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "manage":
        return renderManageBooks();
      case "users":
        return renderManageUsers();
      case "requests":
        return renderPendingRequests();
      case "borrows":
        return renderAllBorrows();
      case "stats":
        return renderStatistics();
      case "profile":
        return (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerAccent} />
              <Text style={styles.sectionTitle}>Admin Profile</Text>
            </View>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{name}</Text>
                  <Text style={styles.profileRole}>Administrator</Text>
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>Admin Access</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={() => navigation.replace("Login")}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
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
          <Text style={styles.logoText}>📚</Text>
          <Text style={styles.libraryName}>Admin Panel</Text>
        </View>
        
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "manage" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("manage")}
          >
            <Text style={[styles.menuText, activeSection === "manage" && styles.activeMenuText]}>
              Manage Books
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "users" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("users")}
          >
            <Text style={[styles.menuText, activeSection === "users" && styles.activeMenuText]}>
              Manage Users
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, activeSection === "requests" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("requests")}
          >
            <Text style={[styles.menuText, activeSection === "requests" && styles.activeMenuText]}>
              Pending Requests
              {pendingRequests.length > 0 && (
                <Text style={styles.notificationBadge}>
                  {" "}({pendingRequests.length})
                </Text>
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, activeSection === "borrows" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("borrows")}
          >
            <Text style={[styles.menuText, activeSection === "borrows" && styles.activeMenuText]}>
              All Borrows
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "stats" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("stats")}
          >
            <Text style={[styles.menuText, activeSection === "stats" && styles.activeMenuText]}>
              Statistics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "profile" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("profile")}
          >
            <Text style={[styles.menuText, activeSection === "profile" && styles.activeMenuText]}>
              Admin Profile
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
            <View style={styles.hamburger}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.welcomeTitle}>Welcome, {name}</Text>
            <Text style={styles.welcomeSubtitle}>Administrator Dashboard</Text>
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

      {/* Add/Edit Book Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingBook ? "Edit Book" : "Add New Book"}
            </Text>
            
            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              {/* Image Selection Section */}
              <View style={styles.imageSection}>
                <Text style={styles.sectionLabel}>Book Cover Image</Text>
                
                {selectedImage ? (
                  <View style={styles.selectedImageContainer}>
                    <Image 
                      source={{ uri: selectedImage }} 
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={removeSelectedImage}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : formData.image_url ? (
                  <View style={styles.selectedImageContainer}>
                    <CacheBustImage 
                      source={{ uri: formData.image_url }} 
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => handleImageUrlInput('')}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>No Image Selected</Text>
                  </View>
                )}

                <View style={styles.imageButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.imageButton, styles.galleryButton]}
                    onPress={pickImage}
                    disabled={uploading}
                  >
                    <Text style={styles.imageButtonText}>
                      {uploading ? "Uploading..." : "Choose from Gallery"}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.imageButton, styles.cameraButton]}
                    onPress={takePhoto}
                    disabled={uploading}
                  >
                    <Text style={styles.imageButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.imageOrText}>- OR -</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter Image URL"
                  placeholderTextColor="#8b7355"
                  value={formData.image_url}
                  onChangeText={handleImageUrlInput}
                />
              </View>

              {/* Other form inputs */}
              <TextInput
                style={styles.input}
                placeholder="Title *"
                placeholderTextColor="#8b7355"
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Author *"
                placeholderTextColor="#8b7355"
                value={formData.author}
                onChangeText={(text) => handleInputChange('author', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="ISBN *"
                placeholderTextColor="#8b7355"
                value={formData.isbn}
                onChangeText={(text) => handleInputChange('isbn', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Category *"
                placeholderTextColor="#8b7355"
                value={formData.category}
                onChangeText={(text) => handleInputChange('category', text)}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                placeholderTextColor="#8b7355"
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
                numberOfLines={3}
              />
              <TextInput
                style={styles.input}
                placeholder="Published Year"
                placeholderTextColor="#8b7355"
                value={formData.published_year}
                onChangeText={(text) => handleInputChange('published_year', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Publisher"
                placeholderTextColor="#8b7355"
                value={formData.publisher}
                onChangeText={(text) => handleInputChange('publisher', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Total Copies"
                placeholderTextColor="#8b7355"
                value={formData.total_copies}
                onChangeText={(text) => handleInputChange('total_copies', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Available Copies"
                placeholderTextColor="#8b7355"
                value={formData.available_copies}
                onChangeText={(text) => handleInputChange('available_copies', text)}
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={uploading}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton, uploading && styles.disabledButton]}
                onPress={editingBook ? handleUpdateBook : handleAddBook}
                disabled={uploading}
              >
                <Text style={styles.modalButtonText}>
                  {uploading ? "Uploading..." : (editingBook ? "Update" : "Add") + " Book"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ban User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={banModalVisible}
        onRequestClose={() => setBanModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ban User</Text>
            
            {selectedUser && (
              <>
                <View style={styles.banUserInfoCard}>
                  <Text style={styles.banUserName}>{selectedUser.name}</Text>
                  <Text style={styles.banUserEmail}>{selectedUser.email}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter ban reason *"
                  placeholderTextColor="#8b7355"
                  value={banReason}
                  onChangeText={setBanReason}
                  multiline
                  numberOfLines={3}
                />
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setBanModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.banConfirmButton]}
                    onPress={() => handleBanUser(selectedUser.id)}
                  >
                    <Text style={styles.modalButtonText}>Ban User</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            
            {selectedRecord && (
              <>
                <View style={styles.statusInfoCard}>
                  <Text style={styles.statusBookTitle}>{selectedRecord.book?.title}</Text>
                  <Text style={styles.statusUserName}>by {selectedRecord.user_name}</Text>
                  <View style={styles.currentStatusContainer}>
                    <Text style={styles.currentStatusLabel}>Current Status:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedRecord.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(selectedRecord.status)}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.statusOptionsLabel}>Update to:</Text>
                
                <View style={styles.statusOptionsContainer}>
                  {getAvailableStatusOptions(selectedRecord.status).map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.statusOptionButton, { backgroundColor: option.color }]}
                      onPress={() => handleUpdateStatus(selectedRecord._id, option.value)}
                    >
                      <Text style={styles.statusOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setStatusModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
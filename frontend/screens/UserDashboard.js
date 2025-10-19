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
} from "react-native";
import API from "../utils/api";
import styles from "./UserDashboard.styles";

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
  
  // Fixed: Consistent drawer width value
  const DRAWER_WIDTH = 280;
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const cardScales = useRef({}).current;

  useEffect(() => {
    loadSectionData();
  }, [activeSection]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeSection]);

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

  // Fixed: Improved drawer functions
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
    setRefreshing(false);
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
      // Update local state
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

  const renderReceipt = () => (
    <Modal
      visible={receiptVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setReceiptVisible(false)}
    >
      <View style={styles.receiptModalOverlay}>
        <View style={styles.receiptContainer}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptHeaderText}>LIBRARY BORROW REQUEST</Text>
            <View style={styles.receiptHeaderLine} />
          </View>

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

          <TouchableOpacity
            style={styles.receiptCloseButton}
            onPress={() => setReceiptVisible(false)}
          >
            <Text style={styles.receiptCloseButtonText}>CLOSE</Text>
          </TouchableOpacity>
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
            >
              <View style={styles.bookSpine} />
              <View style={styles.bookContent}>
                {/* Book Image Section */}
                {book.image_url ? (
                  <Image 
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
              >
                <View style={[styles.bookSpine, { backgroundColor: getStatusColor(status) }]} />
                <View style={styles.bookContent}>
                  {/* Book Image Section */}
                  {record.book?.image_url ? (
                    <Image 
                      source={{ uri: record.book.image_url }} 
                      style={styles.bookImage}
                      resizeMode="cover"
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                  ) : (
                    <View style={styles.bookImagePlaceholder}>
                      <Text style={styles.bookImagePlaceholderText}>📚</Text>
                    </View>
                  )}
                  
                  <View style={[styles.bookCornerDecoration, { backgroundColor: getStatusColor(status) }]} />
                  <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                  <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                  <View style={styles.divider} />
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
                  </View>
                  
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
            >
              <View style={[styles.bookSpine, { backgroundColor: getStatusColor(record.status) }]} />
              <View style={styles.bookContent}>
                {/* Book Image Section */}
                {record.book?.image_url ? (
                  <Image 
                    source={{ uri: record.book.image_url }} 
                    style={styles.bookImage}
                    resizeMode="cover"
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                  />
                ) : (
                  <View style={styles.bookImagePlaceholder}>
                    <Text style={styles.bookImagePlaceholderText}>📚</Text>
                  </View>
                )}
                
                <View style={[styles.bookCornerDecoration, { backgroundColor: getStatusColor(record.status) }]} />
                <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                <View style={styles.divider} />
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
            <Text style={styles.emptyStateIcon}>🔔</Text>
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
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <View style={styles.notificationActions}>
                  {!notification.is_read && (
                    <TouchableOpacity 
                      onPress={() => markNotificationAsRead(notification._id)}
                      style={styles.notificationAction}
                    >
                      <Text style={styles.notificationActionText}>Mark Read</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={() => deleteNotification(notification._id)}
                    style={styles.notificationAction}
                  >
                    <Text style={styles.notificationActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>
                {new Date(notification.created_at).toLocaleString()}
              </Text>
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
        return (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerAccent} />
              <Text style={styles.sectionTitle}>Profile Settings</Text>
            </View>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
                  <View style={styles.avatarRing} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{name}</Text>
                  <Text style={styles.profileRole}>Library Member</Text>
                  <View style={styles.profileBadge}>
                    <Text style={styles.profileBadgeText}>ACTIVE</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={() => navigation.replace("Login")}
                activeOpacity={0.8}
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
          <Text style={styles.libraryName}>IT Thesis Library</Text>
          <View style={styles.logoUnderline} />
        </View>
        
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "available" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("available")}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              {activeSection === "available" && <View style={styles.menuIndicator} />}
              <Text style={[styles.menuText, activeSection === "available" && styles.activeMenuText]}>
                Available Books
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "borrowed" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("borrowed")}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              {activeSection === "borrowed" && <View style={styles.menuIndicator} />}
              <Text style={[styles.menuText, activeSection === "borrowed" && styles.activeMenuText]}>
                My Borrowed Books
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "history" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("history")}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              {activeSection === "history" && <View style={styles.menuIndicator} />}
              <Text style={[styles.menuText, activeSection === "history" && styles.activeMenuText]}>
                Borrowing History
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "notifications" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("notifications")}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              {activeSection === "notifications" && <View style={styles.menuIndicator} />}
              <Text style={[styles.menuText, activeSection === "notifications" && styles.activeMenuText]}>
                Notifications
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <Text style={styles.notificationBadge}>
                    {" "}({notifications.filter(n => !n.is_read).length})
                  </Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeSection === "profile" && styles.activeMenuItem]}
            onPress={() => handleMenuPress("profile")}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              {activeSection === "profile" && <View style={styles.menuIndicator} />}
              <Text style={[styles.menuText, activeSection === "profile" && styles.activeMenuText]}>
                Profile Settings
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={toggleDrawer}
            activeOpacity={0.7}
          >
            <View style={styles.hamburger}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.welcomeTitle}>Welcome back, {name}</Text>
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

      {renderReceipt()}
    </View>
  );
}
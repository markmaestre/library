import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import API from "../utils/api";

export default function UserDashboard({ navigation, route }) {
  const name = route.params?.name || "User";
  const [activeSection, setActiveSection] = useState("available");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-280)).current;
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
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
        dueDate: new Date(response.data.receipt.due_date).toLocaleDateString(),
        borrowDate: new Date().toLocaleDateString(),
        borrowTime: new Date().toLocaleTimeString(),
        memberName: name,
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
            <Text style={styles.receiptHeaderText}>LIBRARY TRANSACTION RECEIPT</Text>
            <View style={styles.receiptHeaderLine} />
          </View>

          <View style={styles.receiptBody}>
            <View style={styles.receiptSection}>
              <Text style={styles.receiptLabel}>RECEIPT NO.</Text>
              <Text style={styles.receiptValue}>{receiptData?.transactionId}</Text>
            </View>

            <View style={styles.receiptDivider} />

            <View style={styles.receiptSection}>
              <Text style={styles.receiptLabel}>DATE</Text>
              <Text style={styles.receiptValue}>{receiptData?.borrowDate}</Text>
            </View>

            <View style={styles.receiptSection}>
              <Text style={styles.receiptLabel}>TIME</Text>
              <Text style={styles.receiptValue}>{receiptData?.borrowTime}</Text>
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
              <Text style={styles.receiptLabel}>DUE DATE</Text>
              <Text style={styles.receiptDueDate}>{receiptData?.dueDate}</Text>
            </View>

            <View style={styles.receiptDividerThick} />

            <View style={styles.receiptFooterSection}>
              <Text style={styles.receiptFooterText}>
                Please present this receipt at the{'\n'}
                circulation desk to collect your book.
              </Text>
              <Text style={styles.receiptFooterNote}>
                Keep this receipt for your records.
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
                <View style={styles.bookCornerDecoration} />
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor}>by {book.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Genre</Text>
                    <Text style={styles.detailValue}>{book.genre}</Text>
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
                    {book.available_copies === 0 ? "Not Available" : "Borrow Book"}
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
        {borrowedBooks.map((record) => (
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
              <View style={[styles.bookSpine, styles.borrowedSpine]} />
              <View style={styles.bookContent}>
                <View style={[styles.bookCornerDecoration, styles.borrowedCorner]} />
                <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Borrowed</Text>
                    <Text style={styles.detailValue}>
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date</Text>
                    <Text style={styles.detailValue}>
                      {new Date(record.due_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[
                      styles.statusBadge,
                      record.status === "overdue" && styles.overdueBadge
                    ]}>
                      <Text style={styles.statusText}>{record.status}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, styles.returnButton]}
                  onPress={() => returnBook(record._id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Return Book</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
              <View style={[styles.bookSpine, styles.historySpine]} />
              <View style={styles.bookContent}>
                <View style={[styles.bookCornerDecoration, styles.historyCorner]} />
                <Text style={styles.bookTitle} numberOfLines={2}>{record.book?.title}</Text>
                <Text style={styles.bookAuthor}>by {record.book?.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Borrowed</Text>
                    <Text style={styles.detailValue}>
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Returned</Text>
                    <Text style={styles.detailValue}>
                      {new Date(record.return_date).toLocaleDateString()}
                    </Text>
                  </View>
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
        return (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerAccent} />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>
            <View style={styles.emptyState}>
              <View style={styles.emptyStateCircle}>
                <Text style={styles.emptyStateIcon}>🔔</Text>
              </View>
              <Text style={styles.emptyStateText}>No new notifications</Text>
              <Text style={styles.emptyStateSubtext}>
                We'll notify you about due dates and updates
              </Text>
            </View>
          </Animated.View>
        );
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
          <Text style={styles.libraryName}>Library</Text>
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>

      {renderReceipt()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f3",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    backgroundColor: "#2c1810",
    paddingTop: 30,
    paddingBottom: 20,
    borderRightWidth: 1,
    borderRightColor: "#1a0f08",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  logoContainer: {
    alignItems: "center",
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#3d2418",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    marginBottom: 10,
  },
  libraryName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f5e6d3",
    letterSpacing: 2,
  },
  logoUnderline: {
    width: 60,
    height: 2,
    backgroundColor: "#8b4513",
    marginTop: 10,
  },
  menu: {
    paddingHorizontal: 15,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  activeMenuItem: {
    backgroundColor: "#8b4513",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIndicator: {
    width: 4,
    height: 20,
    backgroundColor: "#f5e6d3",
    marginRight: 10,
    borderRadius: 2,
  },
  menuText: {
    fontSize: 15,
    color: "#b8a896",
    fontWeight: "500",
  },
  activeMenuText: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f6f3",
  },
  header: {
    padding: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e3dc",
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: "#f8f6f3",
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: "space-between",
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: "#2c1810",
    borderRadius: 2,
  },
  headerText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#8b7355",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  headerAccent: {
    width: 4,
    height: 28,
    backgroundColor: "#8b4513",
    marginRight: 15,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c1810",
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  bookCard: {
    width: "48%",
    minWidth: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
  },
  bookSpine: {
    width: 8,
    backgroundColor: "#8b4513",
  },
  borrowedSpine: {
    backgroundColor: "#d4a574",
  },
  historySpine: {
    backgroundColor: "#6d4c3d",
  },
  bookContent: {
    flex: 1,
    padding: 20,
    position: "relative",
  },
  bookCornerDecoration: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 40,
    backgroundColor: "#8b4513",
    opacity: 0.1,
  },
  borrowedCorner: {
    backgroundColor: "#d4a574",
  },
  historyCorner: {
    backgroundColor: "#6d4c3d",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 6,
    lineHeight: 24,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#8b7355",
    marginBottom: 15,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#e8e3dc",
    marginBottom: 15,
  },
  bookDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: "#8b7355",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#2c1810",
    fontWeight: "600",
  },
  availabilityBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4caf50",
  },
  availabilityText: {
    color: "#2e7d32",
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2196f3",
  },
  overdueBadge: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
  },
  statusText: {
    color: "#1976d2",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  fineContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#f44336",
  },
  fineText: {
    fontSize: 13,
    color: "#c62828",
    fontWeight: "700",
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  borrowButton: {
    backgroundColor: "#8b4513",
  },
  returnButton: {
    backgroundColor: "#d4a574",
  },
  logoutButton: {
    backgroundColor: "#c62828",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#9e9e9e",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingSpinner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8b4513",
    marginHorizontal: 5,
  },
  loadingDot2: {
    backgroundColor: "#d4a574",
  },
  loadingDot3: {
    backgroundColor: "#6d4c3d",
  },
  loadingText: {
    fontSize: 16,
    color: "#8b7355",
    fontStyle: "italic",
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyStateCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f8f6f3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateIcon: {
    fontSize: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#2c1810",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#8b7355",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8b4513",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    position: "relative",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  avatarRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "#d4a574",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 15,
    color: "#8b7355",
    marginBottom: 10,
  },
  profileBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4caf50",
    alignSelf: "flex-start",
  },
  profileBadgeText: {
    color: "#2e7d32",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  receiptContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  receiptHeader: {
    backgroundColor: "#2c1810",
    padding: 20,
    alignItems: "center",
  },
  receiptHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
    textAlign: "center",
  },
  receiptHeaderLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#8b4513",
    marginTop: 10,
  },
  receiptBody: {
    padding: 30,
    backgroundColor: "#fff",
  },
  receiptSection: {
    marginBottom: 15,
  },
  receiptLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  receiptValue: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  receiptBookTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
    lineHeight: 22,
  },
  receiptDueDate: {
    fontSize: 18,
    color: "#c62828",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  receiptDividerThick: {
    height: 2,
    backgroundColor: "#000",
    marginVertical: 20,
  },
  receiptFooterSection: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderStyle: "dashed",
    paddingTop: 20,
    marginTop: 10,
    alignItems: "center",
  },
  receiptFooterText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 10,
  },
  receiptFooterNote: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  receiptBarcode: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  barcodeLines: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 50,
    marginBottom: 8,
  },
  barcodeLine: {
    height: "100%",
    backgroundColor: "#000",
    marginHorizontal: 1,
  },
  barcodeText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#666",
    letterSpacing: 2,
  },
  receiptCloseButton: {
    backgroundColor: "#2c1810",
    padding: 16,
    alignItems: "center",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  receiptCloseButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
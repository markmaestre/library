import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import API from "../utils/api";

export default function AdminDashboard({ navigation, route }) {
  const name = route.params?.name || "Admin";
  const [activeSection, setActiveSection] = useState("manage");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [banModalVisible, setBanModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-280)).current;
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    description: "",
    published_year: "",
    publisher: "",
    total_copies: "1",
    available_copies: "1",
    image_url: ""
  });

  useEffect(() => {
    if (activeSection === "manage") {
      loadBooks();
    } else if (activeSection === "users") {
      loadUsers();
    }
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

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await API.get("/books/all");
      setBooks(response.data);
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

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      description: "",
      published_year: "",
      publisher: "",
      total_copies: "1",
      available_copies: "1",
      image_url: ""
    });
    setEditingBook(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['title', 'author', 'isbn', 'genre', 'published_year'];
    for (let field of required) {
      if (!formData[field].trim()) {
        Alert.alert("Error", `${field.replace('_', ' ')} is required`);
        return false;
      }
    }
    return true;
  };

  const handleAddBook = async () => {
    if (!validateForm()) return;

    try {
      const bookData = {
        ...formData,
        published_year: parseInt(formData.published_year),
        total_copies: parseInt(formData.total_copies),
        available_copies: parseInt(formData.available_copies)
      };

      await API.post("/books/", bookData);
      Alert.alert("Success", "Book added successfully");
      setModalVisible(false);
      resetForm();
      loadBooks();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to add book");
    }
  };

  const handleUpdateBook = async () => {
    if (!validateForm() || !editingBook) return;

    try {
      const bookData = {
        ...formData,
        published_year: parseInt(formData.published_year),
        total_copies: parseInt(formData.total_copies),
        available_copies: parseInt(formData.available_copies)
      };

      await handleDeleteBook(editingBook._id, false);
      await API.post("/books/", bookData);
      
      Alert.alert("Success", "Book updated successfully");
      setModalVisible(false);
      resetForm();
      loadBooks();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to update book");
    }
  };

  const handleDeleteBook = async (bookId, showAlert = true) => {
    try {
      Alert.alert(
        "Delete Book",
        "Delete functionality needs to be implemented in the backend.",
        [{ text: "OK" }]
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

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      genre: book.genre || "",
      description: book.description || "",
      published_year: book.published_year?.toString() || "",
      publisher: book.publisher || "",
      total_copies: book.total_copies?.toString() || "1",
      available_copies: book.available_copies?.toString() || "1",
      image_url: book.image_url || ""
    });
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
            <View key={book._id} style={styles.bookCard}>
              <View style={styles.bookSpine} />
              <View style={styles.bookContent}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor}>by {book.author}</Text>
                <View style={styles.divider} />
                <View style={styles.bookDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ISBN</Text>
                    <Text style={styles.detailValue}>{book.isbn}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Genre</Text>
                    <View style={styles.genrePill}>
                      <Text style={styles.genreText}>{book.genre}</Text>
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
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "manage":
        return renderManageBooks();
      case "users":
        return renderManageUsers();
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                placeholder="Genre *"
                placeholderTextColor="#8b7355"
                value={formData.genre}
                onChangeText={(text) => handleInputChange('genre', text)}
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
                placeholder="Published Year *"
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
              <TextInput
                style={styles.input}
                placeholder="Image URL (optional)"
                placeholderTextColor="#8b7355"
                value={formData.image_url}
                onChangeText={(text) => handleInputChange('image_url', text)}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={editingBook ? handleUpdateBook : handleAddBook}
              >
                <Text style={styles.modalButtonText}>
                  {editingBook ? "Update" : "Add"} Book
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
    height: 2,
    backgroundColor: "#2c1810",
    borderRadius: 1,
  },
  headerText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#8b7355",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    position: "relative",
  },
  headerAccent: {
    position: "absolute",
    left: -20,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#8b4513",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2c1810",
    marginLeft: 15,
    flex: 1,
  },
  addButton: {
    backgroundColor: "#8b4513",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#8b4513",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: "#f8f6f3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e8e3dc",
  },
  refreshButtonText: {
    color: "#8b7355",
    fontSize: 13,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#8b7355",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e3dc",
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8b7355",
    marginBottom: 15,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: "#8b4513",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8e3dc",
    overflow: "hidden",
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8e3dc",
    overflow: "hidden",
  },
  bookSpine: {
    width: 6,
    backgroundColor: "#8b4513",
  },
  activeSpine: {
    backgroundColor: "#22c55e",
  },
  bannedSpine: {
    backgroundColor: "#dc2626",
  },
  bookContent: {
    flex: 1,
    padding: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 4,
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#8b7355",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0ebe5",
    marginBottom: 12,
  },
  bookDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: "#8b7355",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: "#2c1810",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  genrePill: {
    backgroundColor: "#f0ebe5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 11,
    color: "#8b7355",
    fontWeight: "500",
  },
  roleBadge: {
    backgroundColor: "#f0ebe5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminRoleBadge: {
    backgroundColor: "#fef3c7",
  },
  roleText: {
    fontSize: 10,
    color: "#8b7355",
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStockBadge: {
    backgroundColor: "#fecaca",
  },
  bannedBadge: {
    backgroundColor: "#fecaca",
  },
  statusText: {
    fontSize: 10,
    color: "#166534",
    fontWeight: "700",
  },
  banReasonContainer: {
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  banReasonText: {
    fontSize: 11,
    color: "#dc2626",
    fontStyle: "italic",
  },
  bookActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#f0ebe5",
  },
  deleteButton: {
    backgroundColor: "#fecaca",
  },
  banButton: {
    backgroundColor: "#fecaca",
  },
  unbanButton: {
    backgroundColor: "#dcfce7",
  },
  logoutButton: {
    backgroundColor: "#f0ebe5",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2c1810",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8e3dc",
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f8f6f3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8b7355",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8e3dc",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8b4513",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "#8b7355",
    marginBottom: 8,
  },
  adminBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  adminBadgeText: {
    fontSize: 10,
    color: "#92400e",
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 20,
    textAlign: "center",
  },
  formScroll: {
    maxHeight: 400,
  },
  input: {
    backgroundColor: "#f8f6f3",
    borderWidth: 1,
    borderColor: "#e8e3dc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#2c1810",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0ebe5",
  },
  submitButton: {
    backgroundColor: "#8b4513",
  },
  banConfirmButton: {
    backgroundColor: "#dc2626",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c1810",
  },
  banUserInfoCard: {
    backgroundColor: "#f8f6f3",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  banUserName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c1810",
    marginBottom: 4,
  },
  banUserEmail: {
    fontSize: 14,
    color: "#8b7355",
  },
});
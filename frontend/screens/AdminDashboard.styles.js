import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  // ========================================
  // LAYOUT STRUCTURE
  // ========================================
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },

  // ========================================
  // SIDEBAR
  // ========================================
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    backgroundColor: "#1e3a5f",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  logoContainer: {
    padding: 30,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },

  logoText: {
    fontSize: 40,
    marginBottom: 10,
  },

  libraryName: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#e8f0fe",
  },

  menu: {
    paddingVertical: 20,
  },

  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },

  activeMenuItem: {
    backgroundColor: "rgba(74, 144, 226, 0.15)",
    borderLeftColor: "#4a90e2",
  },

  menuText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#b8c9e0",
  },

  activeMenuText: {
    color: "#ffffff",
  },

  notificationBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e74c3c",
  },

  // ========================================
  // CONTENT AREA
  // ========================================
  content: {
    flex: 1,
  },

  // ========================================
  // HEADER
  // ========================================
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  menuButton: {
    padding: 8,
    marginRight: 15,
  },

  hamburger: {
    gap: 4,
  },

  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: "#2c3e50",
    borderRadius: 2,
  },

  headerText: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 2,
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "400",
  },

  // ========================================
  // SCROLL VIEW
  // ========================================
  scrollView: {
    flex: 1,
  },

  // ========================================
  // SECTIONS
  // ========================================
  section: {
    padding: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 15,
  },

  headerAccent: {
    width: 4,
    height: 32,
    backgroundColor: "#4a90e2",
    borderRadius: 2,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1e3a5f",
    flex: 1,
  },

  // ========================================
  // BUTTONS
  // ========================================
  addButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },

  refreshButton: {
    backgroundColor: "#ecf0f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  refreshButtonText: {
    color: "#1e3a5f",
    fontWeight: "500",
    fontSize: 15,
  },

  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
  },

  editButton: {
    backgroundColor: "#4a90e2",
  },

  deleteButton: {
    backgroundColor: "#e74c3c",
  },

  approveButton: {
    backgroundColor: "#27ae60",
  },

  rejectButton: {
    backgroundColor: "#e74c3c",
  },

  banButton: {
    backgroundColor: "#e67e22",
  },

  unbanButton: {
    backgroundColor: "#27ae60",
  },

  returnButton: {
    backgroundColor: "#27ae60",
  },

  logoutButton: {
    backgroundColor: "#e74c3c",
    width: "100%",
  },

  // ========================================
  // CARDS & GRIDS
  // ========================================
  booksGrid: {
    gap: 24,
  },

  bookCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  bookSpine: {
    width: 8,
    backgroundColor: "#4a90e2",
  },

  bannedSpine: {
    backgroundColor: "#e74c3c",
  },

  activeSpine: {
    backgroundColor: "#27ae60",
  },

  bookContent: {
    flex: 1,
    padding: 20,
  },

  // ========================================
  // BOOK IMAGES
  // ========================================
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: "#ecf0f1",
  },

  bookImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ecf0f1",
    borderRadius: 6,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  bookImagePlaceholderText: {
    fontSize: 48,
  },

  // ========================================
  // CARD TEXT
  // ========================================
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 6,
    lineHeight: 24,
  },

  bookAuthor: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#ecf0f1",
    marginVertical: 16,
  },

  // ========================================
  // DETAILS SECTION
  // ========================================
  bookDetails: {
    gap: 12,
    marginBottom: 16,
    flex: 1,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailLabel: {
    fontSize: 13,
    color: "#7f8c8d",
    fontWeight: "500",
  },

  detailValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },

  // ========================================
  // BADGES
  // ========================================
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },

  outOfStockBadge: {
    backgroundColor: "#e74c3c",
  },

  bannedBadge: {
    backgroundColor: "#e74c3c",
  },

  genrePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#e8f4f8",
  },

  genreText: {
    fontSize: 13,
    color: "#4a90e2",
    fontWeight: "600",
  },

  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#e8f0fe",
  },

  roleText: {
    fontSize: 12,
    color: "#4a90e2",
    fontWeight: "600",
  },

  adminRoleBadge: {
    backgroundColor: "#fef5e7",
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================
  bookActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: "auto",
  },

  // ========================================
  // STATISTICS
  // ========================================
  statsGrid: {
    gap: 20,
  },

  statCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },

  statIconContainer: {
    marginBottom: 12,
  },

  statIcon: {
    fontSize: 40,
  },

  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e3a5f",
    marginBottom: 8,
  },

  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },

  // ========================================
  // FORMS & INPUTS
  // ========================================
  input: {
    width: "100%",
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 6,
    fontSize: 15,
    color: "#2c3e50",
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  formScroll: {
    maxHeight: 500,
  },

  // ========================================
  // IMAGE SECTION
  // ========================================
  imageSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 12,
  },

  selectedImageContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },

  selectedImage: {
    width: "100%",
    height: 250,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ecf0f1",
  },

  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(231, 76, 60, 0.9)",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  removeImageText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ecf0f1",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#b8c9e0",
    borderStyle: "dashed",
  },

  imagePlaceholderText: {
    color: "#7f8c8d",
    fontSize: 14,
  },

  imageButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  imageButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  imageButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },

  galleryButton: {
    backgroundColor: "#4a90e2",
  },

  cameraButton: {
    backgroundColor: "#27ae60",
  },

  imageOrText: {
    textAlign: "center",
    color: "#95a5a6",
    fontSize: 13,
    marginVertical: 16,
    fontWeight: "500",
  },

  // ========================================
  // MODALS
  // ========================================
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 30,
    maxWidth: 600,
    width: "100%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 24,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },

  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  cancelButton: {
    backgroundColor: "#ecf0f1",
  },

  submitButton: {
    backgroundColor: "#4a90e2",
  },

  banConfirmButton: {
    backgroundColor: "#e74c3c",
  },

  disabledButton: {
    opacity: 0.6,
  },

  // ========================================
  // STATUS MODAL
  // ========================================
  statusInfoCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
  },

  statusBookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 6,
  },

  statusUserName: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 12,
  },

  currentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  currentStatusLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },

  statusOptionsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 12,
  },

  statusOptionsContainer: {
    gap: 12,
    marginBottom: 20,
  },

  statusOptionButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },

  statusOptionText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },

  // ========================================
  // BAN USER MODAL
  // ========================================
  banUserInfoCard: {
    backgroundColor: "#fef5e7",
    padding: 16,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#e67e22",
  },

  banUserName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 4,
  },

  banUserEmail: {
    fontSize: 14,
    color: "#7f8c8d",
  },

  banReasonContainer: {
    backgroundColor: "#fff5f5",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#e74c3c",
  },

  banReasonText: {
    fontSize: 13,
    color: "#e74c3c",
    lineHeight: 20,
  },

  // ========================================
  // PROFILE
  // ========================================
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: 500,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 32,
  },

  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4a90e2",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#ffffff",
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e3a5f",
    marginBottom: 4,
  },

  profileRole: {
    fontSize: 15,
    color: "#7f8c8d",
    marginBottom: 12,
  },

  adminBadge: {
    backgroundColor: "#fef5e7",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  adminBadgeText: {
    fontSize: 13,
    color: "#e67e22",
    fontWeight: "600",
  },

  // ========================================
  // LOADING & EMPTY STATES
  // ========================================
  loadingContainer: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 16,
    color: "#7f8c8d",
  },

  emptyState: {
    padding: 60,
    alignItems: "center",
  },

  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyStateSubtext: {
    fontSize: 15,
    color: "#95a5a6",
    marginBottom: 24,
    textAlign: "center",
  },

  emptyStateButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },

  emptyStateButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },

  // ========================================
  // UTILITY
  // ========================================
  fineText: {
    color: "#e74c3c",
    fontWeight: "600",
  },
});
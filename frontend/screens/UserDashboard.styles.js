import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = 280;

export default StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },

  // Sidebar / Drawer
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  logoContainer: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    alignItems: 'center',
  },

  logoImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  libraryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },

  logoUnderline: {
    width: 40,
    height: 3,
    backgroundColor: '#007AFF',
    marginTop: 8,
    borderRadius: 1.5,
  },

  menu: {
    paddingTop: 20,
    flex: 1,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 10,
    position: 'relative',
  },

  activeMenuItem: {
    backgroundColor: '#E3F2FD',
  },

  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: {
    marginRight: 14,
  },

  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },

  activeMenuText: {
    color: '#007AFF',
    fontWeight: '600',
  },

  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
    width: 4,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },

  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Header
  content: {
    flex: 1,
    marginLeft: 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  menuButton: {
    padding: 10,
    marginRight: 16,
  },

  hamburger: {
    width: 28,
    height: 20,
    justifyContent: 'space-between',
  },

  hamburgerLine: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#333',
    borderRadius: 1.25,
  },

  headerText: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  welcomeSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },

  // Main Content
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  headerAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  // Books Grid
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  bookCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  bookSpine: {
    width: 4,
    height: '100%',
    backgroundColor: '#007AFF',
    position: 'absolute',
    left: 0,
  },

  bookContent: {
    padding: 12,
  },

  bookImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },

  bookImagePlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  bookImagePlaceholderText: {
    fontSize: 50,
  },

  bookCornerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: '#007AFF',
    opacity: 0.1,
    borderBottomLeftRadius: 30,
  },

  bookTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 17,
  },

  bookAuthor: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 8,
  },

  bookDetails: {
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  detailLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  availabilityBadge: {
    minWidth: 28,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },

  availabilityText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // Borrow ID Card
  borrowIdCard: {
    backgroundColor: '#F0F4FF',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },

  borrowIdCardLabel: {
    fontSize: 9,
    color: '#007AFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  borrowIdCardValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '700',
    marginTop: 2,
  },

  borrowIdCardNote: {
    fontSize: 9,
    color: '#888',
    marginTop: 4,
  },

  // Action Buttons
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    flexDirection: 'row',
  },

  viewDetailsButton: {
    backgroundColor: '#E3F2FD',
  },

  borrowButton: {
    backgroundColor: '#007AFF',
  },

  returnButton: {
    backgroundColor: '#34C759',
  },

  pendingButton: {
    backgroundColor: '#FFA500',
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 6,
  },

  viewDetailsButtonText: {
    color: '#007AFF',
  },

  // Modal Styles
  editProfileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  editProfileContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '92%',
    overflow: 'hidden',
  },

  editProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  editProfileHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  closeButton: {
    padding: 8,
  },

  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },

  editProfileScrollView: {
    flex: 1,
  },

  editProfileBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  profileImageLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },

  profileImagePlaceholderLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },

  profileImagePlaceholderTextLarge: {
    fontSize: 48,
    fontWeight: '700',
    color: '#007AFF',
  },

  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImageHint: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },

  formSection: {
    marginTop: 12,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },

  disabledInput: {
    backgroundColor: '#E8E8E8',
    color: '#888',
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  genderOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
  },

  genderOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },

  genderOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },

  genderOptionTextSelected: {
    color: '#007AFF',
  },

  editProfileActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
  },

  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },

  cancelButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '700',
  },

  // Book Details Modal
  bookDetailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  bookDetailsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '92%',
  },

  bookDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  bookDetailsHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  bookDetailsScrollView: {
    flex: 1,
  },

  bookDetailsBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  bookImageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },

  bookDetailsImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#E8E8E8',
  },

  bookDetailsImagePlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookDetailsImagePlaceholderText: {
    fontSize: 60,
  },

  bookInfoSection: {
    marginBottom: 16,
  },

  bookDetailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },

  bookDetailsAuthor: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },

  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusTextLarge: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  sectionDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 16,
  },

  borrowIdSection: {
    marginBottom: 8,
  },

  borrowIdContainer: {
    backgroundColor: '#F0F4FF',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },

  borrowIdLabel: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  borrowIdValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
    marginTop: 6,
  },

  borrowIdNote: {
    fontSize: 10,
    color: '#888',
    marginTop: 6,
    fontStyle: 'italic',
  },

  detailsSection: {
    marginBottom: 8,
  },

  descriptionSection: {
    marginBottom: 8,
  },

  bookDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },

  borrowingSection: {
    marginBottom: 8,
  },

  fineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFE3E3',
    borderRadius: 8,
    marginTop: 8,
  },

  fineLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },

  fineAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3B30',
  },

  fineText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '700',
  },

  bookDetailsActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
  },

  closeDetailsButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },

  // Receipt Modal
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },

  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },

  receiptHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  receiptScrollView: {
    flex: 1,
  },

  receiptBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  receiptSection: {
    marginBottom: 12,
  },

  receiptLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  receiptValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },

  receiptBookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },

  receiptDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },

  receiptDividerThick: {
    height: 2,
    backgroundColor: '#333',
    marginVertical: 16,
  },

  receiptFooterSection: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  receiptFooterText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },

  receiptFooterNote: {
    fontSize: 11,
    color: '#007AFF',
    marginTop: 6,
    fontStyle: 'italic',
  },

  receiptBarcode: {
    alignItems: 'center',
    marginTop: 16,
  },

  barcodeLines: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 8,
  },

  barcodeLine: {
    height: 30,
    backgroundColor: '#333',
    marginHorizontal: 1,
  },

  barcodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },

  // Profile Section
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarCircleLarge: {
    position: 'relative',
    marginRight: 16,
  },

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  avatarTextLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  avatarRingLarge: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: '#007AFF',
    top: -3,
    left: -3,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  profileEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  profileBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },

  profileBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007AFF',
  },

  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 12,
    marginBottom: 16,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },

  detailItemText: {
    flex: 1,
    marginLeft: 12,
  },

  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },

  editProfileButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },

  logoutButton: {
    flex: 1,
    backgroundColor: '#FFE3E3',
  },

  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },

  // Notifications
  notificationsList: {
    gap: 12,
  },

  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  unreadNotification: {
    backgroundColor: '#F8F9FA',
    borderLeftColor: '#007AFF',
  },

  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },

  notificationMessage: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
  },

  notificationTime: {
    fontSize: 10,
    color: '#999',
  },

  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  notificationAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E8E8E8',
  },

  notificationActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },

  overdueIndicator: {
    backgroundColor: '#FFE3E3',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },

  overdueIndicatorText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FF3B30',
    letterSpacing: 0.5,
  },

  overdueText: {
    color: '#FF3B30',
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyStateCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyStateIcon: {
    fontSize: 48,
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  emptyStateSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },

  loadingSpinner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
  },

  loadingDot2: {
    opacity: 0.5,
  },

  loadingDot3: {
    opacity: 0.25,
  },

  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
});
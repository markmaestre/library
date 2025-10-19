import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Fixed: Improved overlay style
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  
  // Fixed: Consistent sidebar width
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#2C3E50',
    paddingTop: 50,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  
  logoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  logoText: {
    fontSize: 40,
    marginBottom: 5,
  },
  
  libraryName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  logoUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#3498DB',
    marginTop: 8,
    borderRadius: 2,
  },
  
  menu: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  
  menuItem: {
    marginBottom: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  activeMenuItem: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
  },
  
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  
  menuIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#3498DB',
    borderRadius: 2,
    marginRight: 12,
  },
  
  menuText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  notificationBadge: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  
  // Header Styles
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  header: {
    backgroundColor: '#34495E',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  menuButton: {
    padding: 8,
    marginRight: 15,
  },
  
  hamburger: {
    width: 24,
    justifyContent: 'space-between',
  },
  
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginBottom: 5,
  },
  
  headerText: {
    flex: 1,
  },
  
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  welcomeSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  
  scrollView: {
    flex: 1,
  },
  
  // Section Styles
  section: {
    flex: 1,
    padding: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  headerAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#3498DB',
    borderRadius: 2,
    marginRight: 12,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  bookCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  
  bookSpine: {
    height: 6,
    backgroundColor: '#3498DB',
  },
  
  bookContent: {
    padding: 15,
  },
  
  bookImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  
  bookImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  bookImagePlaceholderText: {
    fontSize: 64,
  },
  
  bookCornerDecoration: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 24,
    borderLeftColor: 'transparent',
    borderTopWidth: 24,
    borderTopColor: '#3498DB',
  },
  
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 6,
    lineHeight: 22,
  },
  
  bookAuthor: {
    fontSize: 13,
    color: '#657786',
    marginBottom: 12,
  },
  
  divider: {
    height: 1,
    backgroundColor: '#E1E8ED',
    marginVertical: 12,
  },
  
  bookDetails: {
    marginBottom: 15,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  detailLabel: {
    fontSize: 9,
    color: '#8899A6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  detailValue: {
    fontSize: 13,
    color: '#14171A',
    fontWeight: '600',
  },
  
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  availabilityBadge: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  actionButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
 
  
  returnButton: {
    backgroundColor: '#27AE60',
  },
  
 
  
  disabledButton: {
    backgroundColor: '#BDC3C7',
  },
  
  buttonText: {
    color: '#63a8cfff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  fineContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E74C3C',
  },
  
  fineText: {
    color: '#E74C3C',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    backgroundColor: '#FFFFFF',
  },
  
  loadingSpinner: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  
  loadingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3498DB',
  },
  
  loadingDot2: {
    opacity: 0.6,
  },
  
  loadingDot3: {
    opacity: 0.3,
  },
  
  loadingText: {
    fontSize: 16,
    color: '#657786',
    fontWeight: '500',
  },
  
  // Notifications Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  
  emptyStateCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  
  emptyStateIcon: {
    fontSize: 56,
  },
  
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14171A',
    marginBottom: 10,
  },
  
  emptyStateSubtext: {
    fontSize: 15,
    color: '#657786',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  
  notificationsList: {
    gap: 15,
  },
  
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
    backgroundColor: '#F8FCFF',
  },
  
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
    flex: 1,
    lineHeight: 22,
  },
  
  notificationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  notificationAction: {
    padding: 4,
  },
  
  notificationActionText: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: '600',
  },
  
  notificationMessage: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 10,
    lineHeight: 20,
  },
  
  notificationTime: {
    fontSize: 12,
    color: '#8899A6',
  },
  
  overdueIndicator: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  
  overdueIndicatorText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Profile Styles
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    position: 'relative',
  },
  
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  avatarRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#5DADE2',
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 6,
  },
  
  profileRole: {
    fontSize: 15,
    color: '#657786',
    marginBottom: 12,
  },
  
  profileBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  profileBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  logoutButton: {
    backgroundColor: '#E74C3C',
  },
  
  // Receipt Modal Styles
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '95%',
    maxWidth: 420,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  
  receiptHeader: {
    backgroundColor: '#34495E',
    padding: 24,
    alignItems: 'center',
  },
  
  receiptHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  
  receiptHeaderLine: {
    width: 100,
    height: 3,
    backgroundColor: '#3498DB',
    marginTop: 10,
    borderRadius: 2,
  },
  
  receiptBody: {
    padding: 24,
  },
  
  receiptSection: {
    marginBottom: 16,
  },
  
  receiptLabel: {
    fontSize: 11,
    color: '#8899A6',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  
  receiptValue: {
    fontSize: 17,
    color: '#14171A',
    fontWeight: '600',
  },
  
  receiptBookTitle: {
    fontSize: 19,
    color: '#14171A',
    fontWeight: 'bold',
    lineHeight: 26,
  },
  
  receiptDivider: {
    height: 1,
    backgroundColor: '#E1E8ED',
    marginVertical: 14,
  },
  
  receiptDividerThick: {
    height: 2,
    backgroundColor: '#CBD5E0',
    marginVertical: 18,
  },
  
  receiptFooterSection: {
    marginTop: 12,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  
  receiptFooterText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  
  receiptFooterNote: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  receiptBarcode: {
    marginTop: 24,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  
  barcodeLines: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'flex-end',
    gap: 3,
    marginBottom: 10,
  },
  
  barcodeLine: {
    height: '100%',
    backgroundColor: '#14171A',
  },
  
  barcodeText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
    letterSpacing: 2,
  },
  
  receiptCloseButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 18,
    alignItems: 'center',
  },
  
  receiptCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");

  const featuredBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", color: "#8B4513" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", color: "#654321" },
    { id: 3, title: "1984", author: "George Orwell", color: "#A0522D" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", color: "#6B4423" },
  ];

  const categories = [
    { name: "Fiction", count: "2,450", icon: "📖" },
    { name: "Non-Fiction", count: "1,890", icon: "📚" },
    { name: "Science", count: "980", icon: "🔬" },
    { name: "History", count: "1,230", icon: "📜" },
    { name: "Biography", count: "670", icon: "👤" },
    { name: "Children", count: "1,450", icon: "🧸" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Navigation */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBooks}>
            <View style={[styles.logoBook, { backgroundColor: "#8B4513" }]} />
            <View style={[styles.logoBook, { backgroundColor: "#654321" }]} />
            <View style={[styles.logoBook, { backgroundColor: "#A0522D" }]} />
          </View>
          <Text style={styles.logoText}>City Library</Text>
        </View>

        <View style={styles.navLinks}>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => setActiveTab("home")}
          >
            <Text style={[styles.navLinkText, activeTab === "home" && styles.navLinkActive]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.navLinkText, activeTab === "about" && styles.navLinkActive]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => setActiveTab("contact")}
          >
            <Text style={[styles.navLinkText, activeTab === "contact" && styles.navLinkActive]}>
              Contact
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "home" && (
        <>
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <View style={styles.heroContent}>
              <View style={styles.heroBookshelf}>
                {[65, 80, 70, 75, 68, 85, 72].map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.heroBook,
                      {
                        height,
                        backgroundColor: index % 2 === 0 ? "#8B4513" : "#654321",
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.heroTitle}>Discover Your Next Great Read</Text>
              <Text style={styles.heroSubtitle}>
                Explore our collection of over 10,000 books spanning every genre imaginable
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.heroBtnPrimary}
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroBtnPrimaryText}>Browse Catalog</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.heroBtnSecondary}
                  onPress={() => navigation.navigate("Register")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroBtnSecondaryText}>Get Library Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

      

         
       
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Start Reading?</Text>
            <Text style={styles.ctaText}>
              Join our community of readers and get instant access to thousands of books
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaButtonText}>Sign Up for Free</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.ctaLinkText}>Already a member? Login here</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {activeTab === "about" && (
        <View style={styles.section}>
          <Text style={styles.pageTitle}>About Our Library</Text>
          
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Our Mission</Text>
            <Text style={styles.contentText}>
              We strive to be a cornerstone of our community, providing free and equal access to information, literature, and educational resources for all. Our mission is to inspire lifelong learning, foster creativity, and promote literacy across all ages.
            </Text>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>History & Legacy</Text>
            <Text style={styles.contentText}>
              Established in 1892, our library has served the community for over 130 years. From a small reading room with 200 books to a modern facility housing over 10,000 volumes, we've grown alongside our community while maintaining our commitment to public service.
            </Text>
          </View>

         

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>What We Offer</Text>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Extensive collection of print and digital books</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Free computer and internet access</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Reading programs for children and adults</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Study rooms and quiet reading spaces</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Community events and author talks</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === "contact" && (
        <View style={styles.section}>
          <Text style={styles.pageTitle}>Contact Us</Text>
          
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Visit Us</Text>
            <Text style={styles.contentText}>City Library Main Branch</Text>
            <Text style={styles.contentText}>123 Knowledge Avenue</Text>
            <Text style={styles.contentText}>Reading District, RC 12345</Text>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Get In Touch</Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactText}>info@citylibrary.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>(555) 123-4567</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📠</Text>
              <Text style={styles.contactText}>(555) 123-4568</Text>
            </View>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Library Hours</Text>
            <View style={styles.hoursTable}>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Monday - Thursday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 9:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Friday - Saturday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Sunday</Text>
                <Text style={styles.hoursTime}>1:00 PM - 5:00 PM</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Departments</Text>
            <View style={styles.departmentCard}>
              <Text style={styles.departmentName}>Reference Desk</Text>
              <Text style={styles.departmentExt}>Ext. 101</Text>
            </View>
            <View style={styles.departmentCard}>
              <Text style={styles.departmentName}>Children's Section</Text>
              <Text style={styles.departmentExt}>Ext. 102</Text>
            </View>
            <View style={styles.departmentCard}>
              <Text style={styles.departmentName}>Circulation</Text>
              <Text style={styles.departmentExt}>Ext. 103</Text>
            </View>
            <View style={styles.departmentCard}>
              <Text style={styles.departmentName}>Technical Services</Text>
              <Text style={styles.departmentExt}>Ext. 104</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
            <Text style={styles.messageButtonText}>Send Us a Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Quick Links</Text>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Catalog</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>FAQs</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Services</Text>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Borrow Books</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Digital Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Membership</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerCopyright}>© 2025 City Library. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1E8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0D5C7",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  logoBooks: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    marginRight: 10,
  },
  logoBook: {
    width: 8,
    height: 22,
    borderRadius: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C1810",
  },
  navLinks: {
    flexDirection: "row",
    gap: 25,
  },
  navLink: {
    paddingVertical: 5,
  },
  navLinkText: {
    fontSize: 16,
    color: "#6B5A4A",
    fontWeight: "500",
  },
  navLinkActive: {
    color: "#2C1810",
    fontWeight: "700",
    borderBottomWidth: 2,
    borderBottomColor: "#6B5A4A",
  },
  heroBanner: {
    backgroundColor: "#3D3027",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: "center",
  },
  heroBookshelf: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginBottom: 25,
  },
  heroBook: {
    width: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#5C4033",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#D0C4B4",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  heroButtons: {
    width: "100%",
    gap: 12,
  },
  heroBtnPrimary: {
    backgroundColor: "#8B6F47",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  heroBtnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  heroBtnSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  heroBtnSecondaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 15,
  },
  sectionLink: {
    fontSize: 15,
    color: "#6B5A4A",
    fontWeight: "600",
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAccessCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 4,
    textAlign: "center",
  },
  quickAccessDesc: {
    fontSize: 13,
    color: "#9D8B7A",
    textAlign: "center",
  },
  bookScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  bookCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCover: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    position: "relative",
    borderWidth: 1,
    borderColor: "#5C4033",
  },
  bookSpine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  bookPage: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 4,
    height: 36,
  },
  bookAuthor: {
    fontSize: 12,
    color: "#6B5A4A",
    marginBottom: 8,
  },
  bookStatus: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  bookStatusText: {
    fontSize: 11,
    color: "#2E7D32",
    fontWeight: "600",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 4,
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 11,
    color: "#9D8B7A",
  },
  servicesContainer: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 14,
    color: "#6B5A4A",
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: "#6B5A4A",
    padding: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 15,
    color: "#E0D5C7",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 12,
  },
  ctaButtonText: {
    color: "#6B5A4A",
    fontSize: 17,
    fontWeight: "700",
  },
  ctaLink: {
    paddingVertical: 8,
  },
  ctaLinkText: {
    color: "#FFFFFF",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 20,
  },
  contentBlock: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: "#6B5A4A",
    lineHeight: 24,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#6B5A4A",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: "#9D8B7A",
    fontWeight: "600",
  },
  offerItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  offerBullet: {
    fontSize: 16,
    color: "#6B5A4A",
    marginRight: 10,
    marginTop: 2,
  },
  offerText: {
    flex: 1,
    fontSize: 15,
    color: "#6B5A4A",
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  contactText: {
    fontSize: 15,
    color: "#6B5A4A",
  },
  hoursTable: {
    marginTop: 10,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0D5C7",
  },
  hoursDay: {
    fontSize: 15,
    color: "#3D3027",
    fontWeight: "600",
  },
  hoursTime: {
    fontSize: 15,
    color: "#6B5A4A",
  },
  departmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F1E8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  departmentName: {
    fontSize: 15,
    color: "#2C1810",
    fontWeight: "600",
  },
  departmentExt: {
    fontSize: 15,
    color: "#6B5A4A",
  },
  messageButton: {
    backgroundColor: "#6B5A4A",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    backgroundColor: "#3D3027",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerSection: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  footerLink: {
    marginBottom: 8,
  },
  footerLinkText: {
    fontSize: 14,
    color: "#D0C4B4",
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#5C4033",
    paddingTop: 20,
    alignItems: "center",
  },
  footerCopyright: {
    fontSize: 13,
    color: "#9D8B7A",
  },
});
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Navigation */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBooks}>
            <View style={[styles.logoBook, { backgroundColor: "#2563EB" }]} />
            <View style={[styles.logoBook, { backgroundColor: "#7C3AED" }]} />
            <View style={[styles.logoBook, { backgroundColor: "#059669" }]} />
          </View>
          <Text style={styles.logoText}>IT Library</Text>
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
                        backgroundColor: index % 2 === 0 ? "#2563EB" : "#7C3AED",
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.heroTitle}>IT Library Management System</Text>
              <Text style={styles.heroSubtitle}>
                Digital platform for efficient management of IT thesis papers, research projects, and academic resources
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.heroBtnPrimary}
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroBtnPrimaryText}>Browse Thesis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.heroBtnSecondary}
                  onPress={() => navigation.navigate("Register")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroBtnSecondaryText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quick Access Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity style={styles.quickAccessCard}>
                <Text style={styles.quickAccessTitle}>Thesis Search</Text>
                <Text style={styles.quickAccessDesc}>Find specific IT thesis papers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAccessCard}>
                <Text style={styles.quickAccessTitle}>My Account</Text>
                <Text style={styles.quickAccessDesc}>View borrowed items</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAccessCard}>
                <Text style={styles.quickAccessTitle}>Categories</Text>
                <Text style={styles.quickAccessDesc}>Browse by topic</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAccessCard}>
                <Text style={styles.quickAccessTitle}>New Arrivals</Text>
                <Text style={styles.quickAccessDesc}>Latest thesis papers</Text>
              </TouchableOpacity>
            </View>
          </View>

         
          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Library Services</Text>
            <View style={styles.servicesContainer}>
              <View style={styles.serviceCard}>
                <Text style={styles.serviceTitle}>Digital Access</Text>
                <Text style={styles.serviceDesc}>
                  Access thesis papers and research materials online from anywhere
                </Text>
              </View>
              <View style={styles.serviceCard}>
                <Text style={styles.serviceTitle}>Online Reservation</Text>
                <Text style={styles.serviceDesc}>
                  Reserve thesis papers in advance for your research needs
                </Text>
              </View>
              <View style={styles.serviceCard}>
                <Text style={styles.serviceTitle}>Research Support</Text>
                <Text style={styles.serviceDesc}>
                  Get assistance with your academic research and references
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Start Your Research Journey</Text>
            <Text style={styles.ctaText}>
              Join our digital library platform and access thousands of IT thesis papers and research materials
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaButtonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.ctaLinkText}>Existing member? Login here</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {activeTab === "about" && (
        <View style={styles.section}>
          <Text style={styles.pageTitle}>About IT Library System</Text>
          
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Our Mission</Text>
            <Text style={styles.contentText}>
              We strive to provide a modern digital platform that revolutionizes how IT thesis papers and research materials are managed, accessed, and utilized. Our mission is to support academic excellence through efficient technology solutions.
            </Text>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>System Overview</Text>
            <Text style={styles.contentText}>
              The IT Library System addresses the challenges of manual library management by providing a comprehensive digital solution. Our platform enables seamless management of thesis papers, research projects, and academic resources while ensuring data accuracy and easy accessibility.
            </Text>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Key Features</Text>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Digital thesis catalog and search system</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Online borrowing and reservation system</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Automated tracking of borrowed materials</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Real-time availability status</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerBullet}>•</Text>
              <Text style={styles.offerText}>Digital access to research materials</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === "contact" && (
        <View style={styles.section}>
          <Text style={styles.pageTitle}>Contact IT Library</Text>
          
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Location</Text>
            <Text style={styles.contentText}>IT Department Library</Text>
            <Text style={styles.contentText}>IT  Building</Text>
            <Text style={styles.contentText}>TUP-Taguig Campus</Text>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Contact Information</Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>Email: Tup-IT-Library@gmail.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>Phone: (555) 123-4567</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>Support: itsupport@gmail.com</Text>
            </View>
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitle}>Operating Hours</Text>
            <View style={styles.hoursTable}>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>8:00 AM - 5:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Saturday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 1:00 PM</Text>
              </View>
             
            </View>
          </View>

          <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
            <Text style={styles.messageButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Quick Links</Text>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Thesis Catalog</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Research Guides</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Help Center</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Services</Text>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Borrow Thesis</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Digital Resources</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Research Support</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerCopyright}>© 2025 IT Library System. All rights reserved.</Text>
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
    backgroundColor: "#2563EB",
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
    backgroundColor: "#2563EB",
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
    color: "#2563EB",
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
    marginBottom: 12,
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
  messageButton: {
    backgroundColor: "#2563EB",
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
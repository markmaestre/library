import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal } from "react-native";
import API from "../utils/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Dropdown states
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  const validateName = (text) => {
    setName(text);
    if (text && text.length < 2) {
      setNameError("Name must be at least 2 characters");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text && !emailRegex.test(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const validateDob = (text) => {
    setDob(text);
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (text && !dobRegex.test(text)) {
      setDobError("Format must be YYYY-MM-DD");
    } else {
      setDobError("");
    }
  };

  const handleDobConfirm = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const formattedDob = `${selectedYear}-${selectedMonth}-${selectedDay}`;
      setDob(formattedDob);
      setDobError("");
      setShowDobPicker(false);
    } else {
      setDobError("Please select complete date");
    }
  };

  const handleGenderSelect = (value) => {
    setGender(value);
    setGenderError("");
    setShowGenderPicker(false);
  };

  const validateGender = (text) => {
    setGender(text);
    if (text && text.length < 1) {
      setGenderError("Gender is required");
    } else {
      setGenderError("");
    }
  };

  const validatePhone = (text) => {
    setPhone(text);
    const phoneRegex = /^\d{10,15}$/;
    if (text && !phoneRegex.test(text)) {
      setPhoneError("Phone must be 10-15 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleRegister = async () => {
    // Final validation
    if (!name) {
      setNameError("Full name is required");
      return;
    }
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!dob) {
      setDobError("Date of birth is required");
      return;
    }
    if (!gender) {
      setGenderError("Gender is required");
      return;
    }

    if (nameError || emailError || passwordError || dobError || genderError || phoneError) {
      Alert.alert("Error", "Please fix all validation errors");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        dob,
        gender,
        address,
        phone,
      });

      if (res.status === 200) {
        setMsg("✅ Registration successful!");
        setLoading(false);

        Alert.alert(
          "🎉 Congratulations!",
          "You may now login to your account.",
          [{ text: "OK", onPress: () => navigation.replace("Login") }]
        );
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("❌ Registration failed");
      setLoading(false);
      Alert.alert("Registration Failed", err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.bookshelf}>
          <View style={[styles.book, { backgroundColor: "#8B4513", height: 45 }]} />
          <View style={[styles.book, { backgroundColor: "#654321", height: 55 }]} />
          <View style={[styles.book, { backgroundColor: "#A0522D", height: 50 }]} />
          <View style={[styles.book, { backgroundColor: "#6B4423", height: 48 }]} />
        </View>
        <Text style={styles.title}>Join Our Library</Text>
        <Text style={styles.subtitle}>Create your reading account</Text>
      </View>

      <View style={styles.formCard}>
        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            value={name}
            onChangeText={validateName}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            style={[
              styles.input,
              focusedField === "name" && styles.inputFocused,
              nameError && styles.inputError
            ]}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            value={email}
            onChangeText={validateEmail}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={[
              styles.input,
              focusedField === "email" && styles.inputFocused,
              emailError && styles.inputError
            ]}
            placeholder="your.email@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            value={password}
            onChangeText={validatePassword}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            secureTextEntry
            style={[
              styles.input,
              focusedField === "password" && styles.inputFocused,
              passwordError && styles.inputError
            ]}
            placeholder="Minimum 6 characters"
            placeholderTextColor="#999"
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth *</Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dropdownInput,
              focusedField === "dob" && styles.inputFocused,
              dobError && styles.inputError
            ]}
            onPress={() => setShowDobPicker(true)}
          >
            <Text style={dob ? styles.dropdownText : styles.dropdownPlaceholder}>
              {dob || "Select your date of birth"}
            </Text>
          </TouchableOpacity>
          {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender *</Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dropdownInput,
              focusedField === "gender" && styles.inputFocused,
              genderError && styles.inputError
            ]}
            onPress={() => setShowGenderPicker(true)}
          >
            <Text style={gender ? styles.dropdownText : styles.dropdownPlaceholder}>
              {gender || "Select your gender"}
            </Text>
          </TouchableOpacity>
          {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            onFocus={() => setFocusedField("address")}
            onBlur={() => setFocusedField(null)}
            style={[
              styles.input,
              styles.textArea,
              focusedField === "address" && styles.inputFocused
            ]}
            placeholder="Your home address (optional)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={validatePhone}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField(null)}
            style={[
              styles.input,
              focusedField === "phone" && styles.inputFocused,
              phoneError && styles.inputError
            ]}
            placeholder="10-15 digits (optional)"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

        <View style={styles.requiredNote}>
          <Text style={styles.requiredNoteText}>* Required fields</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6B5A4A" />
            <Text style={styles.loadingText}>Creating your account...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <Text style={styles.loginButtonText}>Already Have an Account? Login</Text>
        </TouchableOpacity>

        {msg ? (
          <View style={styles.messageContainer}>
            <Text style={[
              styles.msg,
              msg.includes("✅") ? styles.successMsg : styles.failMsg
            ]}>
              {msg}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>Join thousands of readers worldwide</Text>
      </View>

      {/* Date of Birth Picker Modal */}
      <Modal
        visible={showDobPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDobPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowDobPicker(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Date of Birth</Text>
            
            <View style={styles.datePickerContainer}>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerOption,
                      selectedYear === year && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedYear === year && styles.pickerOptionTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerOption,
                      selectedMonth === month.value && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedMonth(month.value)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedMonth === month.value && styles.pickerOptionTextSelected
                    ]}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerOption,
                      selectedDay === day && styles.pickerOptionSelected
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedDay === day && styles.pickerOptionTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowDobPicker(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleDobConfirm}
              >
                <Text style={styles.modalButtonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowGenderPicker(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            
            <View style={styles.genderOptionsContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    gender === option && styles.genderOptionSelected
                  ]}
                  onPress={() => handleGenderSelect(option)}
                >
                  <Text style={[
                    styles.genderOptionText,
                    gender === option && styles.genderOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F1E8",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    alignItems: "center",
  },
  bookshelf: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginBottom: 20,
  },
  book: {
    width: 18,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#5C4033",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B5A4A",
    fontWeight: "400",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3D3027",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E0D5C7",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#2C1810",
    backgroundColor: "#FAFAF8",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputFocused: {
    borderColor: "#8B6F47",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#C44536",
  },
  errorText: {
    color: "#C44536",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  requiredNote: {
    marginBottom: 16,
    paddingTop: 8,
  },
  requiredNoteText: {
    fontSize: 13,
    color: "#9D8B7A",
    fontStyle: "italic",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B5A4A",
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#6B5A4A",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0D5C7",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9D8B7A",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderWidth: 2,
    borderColor: "#6B5A4A",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#6B5A4A",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  messageContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F5F1E8",
  },
  msg: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  successMsg: {
    color: "#2D7A3E",
  },
  failMsg: {
    color: "#C44536",
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerDivider: {
    width: 60,
    height: 2,
    backgroundColor: "#D0C4B4",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: "#9D8B7A",
    textAlign: "center",
  },
  dropdownInput: {
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#2C1810",
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 20,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    maxHeight: 200,
    marginHorizontal: 4,
  },
  pickerOption: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: "#F5F1E8",
  },
  pickerOptionSelected: {
    backgroundColor: "#6B5A4A",
  },
  pickerOptionText: {
    fontSize: 15,
    color: "#3D3027",
    textAlign: "center",
    fontWeight: "500",
  },
  pickerOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#6B5A4A",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  modalButtonCancelText: {
    color: "#6B5A4A",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: "#6B5A4A",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  modalButtonConfirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  genderOptionsContainer: {
    marginBottom: 20,
  },
  genderOption: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: "#F5F1E8",
    borderWidth: 2,
    borderColor: "transparent",
  },
  genderOptionSelected: {
    backgroundColor: "#6B5A4A",
    borderColor: "#6B5A4A",
  },
  genderOptionText: {
    fontSize: 16,
    color: "#3D3027",
    textAlign: "center",
    fontWeight: "600",
  },
  genderOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
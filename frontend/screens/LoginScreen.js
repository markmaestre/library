import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install this package
import API from "../utils/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (emailError || passwordError) {
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
  
      global.authToken = res.data.access_token;
      global.userName = res.data.name; // ✅ store name globally
  
      setMsg("Login success!");
  
      if (res.data.role === "admin") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("UserDashboard", { name: res.data.name }); // ✅ pass name to dashboard
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("Login failed");
      Alert.alert("Login Failed", err.response?.data?.detail || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        {/* TUP Logo */}
        <Image 
          source={require('../assets/images/TUP.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Library Portal</Text>
        <Text style={styles.subtitle}>Access your reading journey</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
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
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={validatePassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              style={[
                styles.passwordInput,
                focusedField === "password" && styles.inputFocused,
                passwordError && styles.inputError
              ]}
              placeholder="Enter your password"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#007AFF" 
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.7}
        >
          <Text style={styles.registerButtonText}>Create New Account</Text>
        </TouchableOpacity>

        {msg ? (
          <View style={styles.messageContainer}>
            <Text style={[
              styles.msg,
              msg.includes("success") ? styles.successMsg : styles.failMsg
            ]}>
              {msg}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>Secure authentication for library members</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF", // Sky blue background
    justifyContent: "space-between",
  },
  headerSection: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007AFF", // Sky blue color
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#007AFF", // Sky blue color
    fontWeight: "400",
    opacity: 0.8,
  },
  formCard: {
    backgroundColor: "#FFFFFF", // White background
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF", // Sky blue color
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E0F0FF", // Light sky blue border
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#F8FBFF", // Very light sky blue background
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E0F0FF", // Light sky blue border
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#F8FBFF", // Very light sky blue background
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    padding: 4,
  },
  inputFocused: {
    borderColor: "#007AFF", // Sky blue border when focused
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#FF3B30", // Red for errors
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#007AFF", // Sky blue background
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: "#66B2FF", // Lighter sky blue when disabled
    opacity: 0.7,
  },
  loginButtonText: {
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
    backgroundColor: "#E0F0FF", // Light sky blue
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#007AFF", // Sky blue color
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: "#007AFF", // Sky blue border
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  registerButtonText: {
    color: "#007AFF", // Sky blue color
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  messageContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F0F8FF", // Sky blue background
  },
  msg: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  successMsg: {
    color: "#34C759", // Green for success
  },
  failMsg: {
    color: "#FF3B30", // Red for failure
  },
  footer: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerDivider: {
    width: 60,
    height: 2,
    backgroundColor: "#007AFF", // Sky blue color
    marginBottom: 12,
    opacity: 0.5,
  },
  footerText: {
    fontSize: 13,
    color: "#007AFF", // Sky blue color
    textAlign: "center",
    opacity: 0.7,
  },
});
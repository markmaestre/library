import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Animated } from "react-native";
import API from "../utils/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
        <View style={styles.bookshelf}>
          <View style={[styles.book, { backgroundColor: "#8B4513", height: 45 }]} />
          <View style={[styles.book, { backgroundColor: "#654321", height: 55 }]} />
          <View style={[styles.book, { backgroundColor: "#A0522D", height: 50 }]} />
          <View style={[styles.book, { backgroundColor: "#6B4423", height: 48 }]} />
        </View>
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
            placeholder="Enter your password"
            placeholderTextColor="#999"
          />
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
    backgroundColor: "#F5F1E8",
    justifyContent: "space-between",
  },
  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
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
    transition: "all 0.3s ease",
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
  loginButton: {
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
  loginButtonDisabled: {
    backgroundColor: "#9D8B7A",
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
    backgroundColor: "#E0D5C7",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9D8B7A",
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    borderWidth: 2,
    borderColor: "#6B5A4A",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  registerButtonText: {
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
    paddingBottom: 30,
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
});
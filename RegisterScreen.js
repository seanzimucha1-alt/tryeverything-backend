import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabaseClient';

const RegisterScreen = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = ['Customer', 'Seller', 'Wholesaler', 'Deliverer'];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms of Service';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.fullName,
              role: formData.role.toLowerCase(),
            }
          }
        });

        if (error) {
          setErrors({ general: error.message });
        } else {
          // User created successfully, profile will be created automatically by trigger
          onRegisterSuccess(formData.role);
        }
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StatusBar style="dark" />

        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logo}>Pamusika</Text>
            <Ionicons name="cart" size={24} color="#556B2F" />
          </View>
          <Text style={styles.tagline}>Discover, Connect, Trade</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={styles.subtitle}>Join the marketplace today</Text>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={formData.fullName}
                onChangeText={(text) => updateField('fullName', text)}
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="hello@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>I am a:</Text>
              <View style={styles.roleContainer}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleButton, formData.role === role && styles.roleButtonActive]}
                    onPress={() => updateField('role', role)}
                  >
                    <Text style={[styles.roleText, formData.role === role && styles.roleTextActive]}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Min 6 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Re-enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) => updateField('confirmPassword', text)}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Terms of Service */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => updateField('termsAccepted', !formData.termsAccepted)}
            >
              <Ionicons name={formData.termsAccepted ? "checkbox" : "square-outline"} size={24} color={formData.termsAccepted ? "#556B2F" : "#9CA3AF"} />
              <Text style={styles.checkboxText}>I agree to the <Text style={styles.linkText}>Terms of Service</Text></Text>
            </TouchableOpacity>
            {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
            </TouchableOpacity>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#556B2F', letterSpacing: 0.5 },
  tagline: { color: '#6B7280', fontSize: 12, marginTop: 2, fontWeight: '500' },
  subtitle: { color: '#111827', fontSize: 20, fontWeight: 'bold', marginBottom: 24, marginTop: 20 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 15 },
  label: { color: '#111827', fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#F5F5F5', color: '#111827', paddingHorizontal: 15, paddingVertical: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 5 },
  roleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roleButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F5F5F5', marginBottom: 5 },
  roleButtonActive: { backgroundColor: '#556B2F', borderColor: '#556B2F' },
  roleText: { color: '#6B7280', fontSize: 14 },
  roleTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  button: { backgroundColor: '#556B2F', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 20, shadowColor: '#556B2F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginLinkText: { color: '#6B7280', fontSize: 14 },
  loginLink: { color: '#556B2F', fontSize: 14, fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxText: { marginLeft: 8, color: '#6B7280', fontSize: 14 },
  linkText: { color: '#556B2F', fontWeight: 'bold' },
});

export default RegisterScreen;
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabaseClient';

const LoginScreen = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Email Validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Add 15-second timeout for slow networks
        const loginPromise = supabase.auth.signInWithPassword({
          email,
          password,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Login taking too long. Check your connection and try again.')), 15000)
        );

        const { data, error } = await Promise.race([loginPromise, timeoutPromise]);

        if (error) {
          setErrors({ general: error.message });
        } else {
          // Get user profile to determine role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError || !profile) {
            setErrors({ general: 'Profile not found. Please contact support.' });
            return;
          }

          const userRole = profile.role || 'customer';
          
          // Map database role to UI role format (capitalized)
          const roleMap = {
            'admin': 'Admin',
            'staff': 'Staff',
            'deliverer': 'Deliverer',
            'customer': 'Customer'
          };
          
          const mappedRole = roleMap[userRole] || 'Customer';
          onLoginSuccess(mappedRole);
        }
      } catch (error) {
        setErrors({ general: error.message || 'An unexpected error occurred' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) return;
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        setErrors({ reset: error.message });
      } else {
        setForgotPasswordVisible(false);
        setResetEmail('');
        // Show success message
      }
    } catch (error) {
      setErrors({ reset: error.message });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.loginContainer}
      >
        <StatusBar style="dark" />

        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logo}>Pamusika</Text>
            <Ionicons name="cart" size={24} color="#556B2F" />
          </View>
          <Text style={styles.tagline}>Discover, Connect, Trade</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.loginSubtitle}>Welcome back to the marketplace</Text>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="name@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {errors.general && <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10 }]}>{errors.general}</Text>}

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={() => setForgotPasswordVisible(true)}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToRegister} disabled={isLoading}>
              <Text style={styles.signupLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isForgotPasswordVisible}
          onRequestClose={() => setForgotPasswordVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalSubtitle}>Enter your email to receive a reset link.</Text>

              <TextInput
                style={[styles.input, { marginBottom: 20 }]}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isResetting}
              />

              <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword} disabled={isResetting}>
                {isResetting ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Send Link</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setForgotPasswordVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#556B2F', letterSpacing: 0.5 },
  tagline: { color: '#6B7280', fontSize: 12, marginTop: 2, fontWeight: '500' },
  loginSubtitle: { color: '#111827', fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { color: '#111827', fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#F5F5F5', color: '#111827', paddingHorizontal: 15, paddingVertical: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 5 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotPasswordText: { color: '#556B2F', fontSize: 14, fontWeight: '500' },
  loginButton: { backgroundColor: '#556B2F', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20, shadowColor: '#556B2F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { color: '#6B7280', fontSize: 14 },
  signupLink: { color: '#556B2F', fontSize: 14, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  cancelButton: { alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '500' },
});

export default LoginScreen;
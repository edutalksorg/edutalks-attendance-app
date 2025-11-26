import { AuthContext } from '@app/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Define types for our form data
type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  employeeId: string;
};

type FormField = keyof FormData;

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    employeeId: '',
  });
  const handleInputChange = (field: FormField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const { login } = useContext(AuthContext) as any;
  const { loginLocal } = useContext(AuthContext) as any;
  const router = useRouter();

  const handleLogin = () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Use local/dummy login for demo; fall back to remote login if desired
    loginLocal(email, password)
      .then(() => {
        // navigate to Attendance tab after successful dummy login
        router.replace('/attendance');
      })
      .catch((err: any) => {
        // If local login fails, try real login
        login(email, password).then(() => router.replace('/attendance')).catch((e: any) => {
          console.warn(e);
          Alert.alert('Login failed', e?.response?.data?.message || String(e));
        });
      });
  };

  const handleRegister = () => {
    const { email, password, confirmPassword, fullName, employeeId } = formData;
    
    if (!email || !password || !confirmPassword || !fullName || !employeeId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Simulate registration process
    Alert.alert('Success', 'Registration successful!');
    console.log('Registration data:', formData);
    
    // Here you would typically make API call to your backend
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      employeeId: '',
    });
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset link will be sent to your email');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>HR Portal</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Employee ID"
                placeholderTextColor="#999"
                value={formData.employeeId}
                onChangeText={(text) => handleInputChange('employeeId', text)}
                keyboardType="numeric"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
            autoComplete="password"
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry
              autoComplete="password"
            />
          )}

          {/* Login/Register Button */}
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={isLogin ? handleLogin : handleRegister}
          >
            <Text style={styles.primaryButtonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>

          {/* Switch Mode */}
          <TouchableOpacity style={styles.switchButton} onPress={switchMode}>
            <Text style={styles.switchButtonText}>
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"
              }
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          {isLogin && (
            <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 HR Portal System</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#2c3e50',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotButtonText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 30,
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 12,
  },
});

export default App;
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/authcontext';

const { width: windowWidth } = Dimensions.get('window');

interface LoginCredentials {
  email: string;
  password: string;
}

const TEST_USERS = {
  ADMIN: { email: 'emiliano@example.com', password: '2205' },
  PATIENT: { email: 'celina@example.com', password: '2205' },
  DOCTOR: { email: 'doc@example.com', password: '2205' },
} as const;

const LoginScreen: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  // Theme colors
  const theme = {
    background: useThemeColor({}, 'background'),
    text: useThemeColor({}, 'text'),
    tint: useThemeColor({}, 'tint'),
    error: '#ff4444',
    inputBackground: useThemeColor({}, 'background'),
  };

  const handleCredentialChange = (field: keyof LoginCredentials) => (value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const validateCredentials = (): boolean => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return false;
    }
    if (!credentials.email.includes('@')) {
      Alert.alert('Error', 'Por favor ingrese un email válido');
      return false;
    }
    return true;
  };

  const saveUserData = async (userData: any) => {
    const { token, id, name, surname, email, role } = userData;
    const items = {
      token,
      userId: id.toString(),
      name,
      surname,
      email,
      role,
    };

    await Promise.all(
      Object.entries(items).map(([key, value]) => 
        SecureStore.setItemAsync(key, value)
      )
    );
  };

  const handleNavigation = (role: string) => {
    switch (role) {
      case 'PATIENT':
        router.replace('/(tabs)/home');
        break;
      case 'ADMIN':
      case 'DOCTOR':
        router.replace('/(tabs)/dashboard');
        break;
      default:
        throw new Error(`Rol no reconocido: ${role}`);
    }
  };

  const handleLogin = async (testCredentials?: LoginCredentials) => {
    const loginData = testCredentials || credentials;
    
    if (!testCredentials && !validateCredentials()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.18.166:8080/login',
        loginData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200 && response.data) {
        await saveUserData(response.data);
        await login(response.data);
        handleNavigation(response.data.role);
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Error inesperado al intentar iniciar sesión';
      
      Alert.alert('Error', errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTestLoginButtons = () => (
    <View style={styles.testButtonsContainer}>
      {(Object.entries(TEST_USERS) as [keyof typeof TEST_USERS, LoginCredentials][]).map(
        ([userType, credentials]) => (
          <Pressable
            key={userType}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? 'darkblue' : theme.tint },
            ]}
            onPress={() => handleLogin(credentials)}
          >
            <Text style={styles.buttonText}>
              Iniciar como {userType.toLowerCase()}
            </Text>
          </Pressable>
        )
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color={theme.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              placeholder="Correo Electrónico"
              placeholderTextColor={theme.text}
              value={credentials.email}
              onChangeText={handleCredentialChange('email')}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color={theme.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              placeholder="Contraseña"
              placeholderTextColor={theme.text}
              secureTextEntry={!showPassword}
              value={credentials.password}
              onChangeText={handleCredentialChange('password')}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <EyeOff size={20} color={theme.text} />
              ) : (
                <Eye size={20} color={theme.text} />
              )}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? 'darkblue' : theme.tint },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={() => handleLogin()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </Pressable>

          {renderTestLoginButtons()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: windowWidth * 0.1,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  testButtonsContainer: {
    marginTop: 24,
    gap: 12,
  },
});

export default LoginScreen;
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Image,
  ScrollView,
  Alert,
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
import useStyles from '@/styles/index.styles';


interface LoginCredentials {
  email: string;
  password: string;
}

const styles = useStyles();

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

  const clearAllData = async () => {
    try {
      const keys = [
        'userToken',
        'doctor_id',
        'userData',
        'userId',
        'name',
        'surname',
        'email',
        'role',
        'specialty_id',
        'license_number',
        'patient_id',
        'medical_history_id'
      ];
      
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error('Error al limpiar datos:', error);
    }
  };

  const saveUserData = async (userData: any) => {
    try {
      
      const { token, id, name, surname, email, role } = userData;
      
      const baseItems = {
        token,
        userId: id.toString(),
        name,
        surname,
        email,
        role,
      };

      await Promise.all(
        Object.entries(baseItems).map(async ([key, value]) => {
          await SecureStore.setItemAsync(key, value?.toString() ?? '');
        })
      );

      if (role === 'DOCTOR') {
        await SecureStore.setItemAsync('doctor_id', id.toString());
        
        if (userData.specialtyId) {
          await SecureStore.setItemAsync('specialty_id', userData.specialtyId.toString());
        }
        
        if (userData.licenseNumber) {
          await SecureStore.setItemAsync('license_number', userData.licenseNumber.toString());
        }
      } else if (role === 'PATIENT') {
        await SecureStore.setItemAsync('patient_id', id.toString());
        
        if (userData.medicalHistory) {
          await SecureStore.setItemAsync('medical_history_id', userData.medicalHistory.toString());
        }
      }

      await SecureStore.setItemAsync('userData', JSON.stringify(userData));

      const verificationPromises = [
        SecureStore.getItemAsync('token'),
        SecureStore.getItemAsync(role === 'DOCTOR' ? 'doctor_id' : 'patient_id'),
        SecureStore.getItemAsync('userData'),
      ];

      const [verifiedToken, verifiedId, verifiedUserData] = await Promise.all(verificationPromises);
      
     
    } catch (error) {
      console.error('Error al guardar datos de usuario:', error);
      throw error;
    }
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
      await clearAllData();

      const response = await axios.post(
        'http://192.168.18.166:8080/login',
        loginData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );


      if (response.status === 200 && response.data) {
        if (!response.data.id || !response.data.role) {
          throw new Error('Datos de usuario incompletos en la respuesta');
        }


        await saveUserData(response.data);
        
        if (response.data.role === 'DOCTOR') {
          const storedDoctorId = await SecureStore.getItemAsync('doctor_id');
          if (!storedDoctorId) {
            throw new Error('Error al guardar ID del doctor');
          }
        }

        await login(response.data);
        handleNavigation(response.data.role);
      }
    } catch (error) {
      console.error('Error detallado:', error);
      
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Error inesperado al intentar iniciar sesión';
      
      Alert.alert('Error', errorMessage);
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


export default LoginScreen;
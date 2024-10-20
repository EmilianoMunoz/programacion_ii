import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, Image, ScrollView, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/authcontext';

const windowWidth = Dimensions.get('window').width;

const Index: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tint');
  const buttonColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'text');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingrese email y contraseña');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.18.166:8080/login', 
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      if (response.status === 200 && response.data) {
        console.log('Login exitoso');
      
        const { token, id, name, surname, email, role } = response.data;
      
        await SecureStore.setItemAsync('token', token);
        await SecureStore.setItemAsync('userId', id.toString());
        await SecureStore.setItemAsync('name', name);
        await SecureStore.setItemAsync('surname', surname);
        await SecureStore.setItemAsync('email', email);
        await SecureStore.setItemAsync('role', role);
      
        await login({ id, name, email, role });
      
        if (role === 'PATIENT') {
          router.replace('/(tabs)/home');
        } else if (role === 'ADMIN' || role === 'DOCTOR') {
          router.replace('/(tabs)/dashboard');
        } else {
          console.error('Rol de usuario no reconocido:', role);
          Alert.alert('Error', 'Rol de usuario no reconocido');
        }
      } else {
        Alert.alert('Error', 'Respuesta inesperada del servidor');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error de Axios:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config
        });
  
        Alert.alert(
          'Error', 
          `Error al iniciar sesión: ${error.response?.data?.message || error.message || 'Error desconocido'}`
        );
      } else {
        console.log('Error no-Axios:', error);
        Alert.alert('Error', 'Error inesperado al intentar iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función para manejar el inicio de sesión como admin
  const handleLoginAsAdmin = async () => {
    setEmail('emiliano@example.com'); // Establece el email del admin
    setPassword('2205'); // Establece la contraseña del admin
    await handleLogin(); // Llama a la función de login
  };
  // Nueva función para manejar el inicio de sesión como admin
  const handleLoginAsPatient = async () => {
    setEmail('celina@example.com'); // Establece el email del admin
    setPassword('2205'); // Establece la contraseña del admin
    await handleLogin(); // Llama a la función de login
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      </View>
      <TextInput
        style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor, color: textColor }]} 
        placeholder="Correo Electrónico"
        placeholderTextColor={textColor}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <View style={[styles.passwordInputContainer, { borderColor }]}>
          <TextInput
            style={[styles.passwordInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="Contraseña"
            placeholderTextColor={textColor}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <Pressable 
            onPress={() => setShowPassword(prev => !prev)} 
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={iconColor} />
            ) : (
              <Eye size={20} color={iconColor} />
            )}
          </Pressable>
        </View>
      </View>
      <Pressable 
        style={({ pressed }) => [
          styles.buttonSession, 
          { backgroundColor: pressed ? 'darkblue' : buttonColor }
        ]} 
        onPress={handleLogin} // Maneja el inicio de sesión con credenciales ingresadas
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
        </Text>
      </Pressable>
      
      {/* Botón para iniciar sesión como admin para pruebas */}
      <Pressable
        style={({ pressed }) => [
          styles.buttonSession,
          { backgroundColor: pressed ? 'darkblue' : buttonColor },
        ]}
        onPress={handleLoginAsAdmin} // Llama a la nueva función
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Iniciar sesión como admin
        </Text>
      </Pressable>
      {/* Botón para iniciar sesión como admin para pruebas */}
      <Pressable
        style={({ pressed }) => [
          styles.buttonSession,
          { backgroundColor: pressed ? 'darkblue' : buttonColor },
        ]}
        onPress={handleLoginAsPatient} // Llama a la nueva función
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Iniciar sesión como paciente
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  passwordContainer: {
    width: '100%',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
  },
  eyeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSession: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;

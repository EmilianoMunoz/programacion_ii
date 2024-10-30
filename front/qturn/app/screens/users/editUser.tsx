import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/hooks/useThemeColor';
import styles from '@/styles/screens/users/editUser.styles';

interface UserData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  coverage: string;
}

const INITIAL_USER_STATE: UserData = {
  name: '',
  surname: '',
  email: '',
  phone: '',
  coverage: '',
};

const API_BASE_URL = 'http://192.168.18.166:8080';

const EditUserScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Editar Usuario',
    });
  }, [navigation]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found');

      const userId = Number(id);
      if (isNaN(userId)) {
        throw new Error('ID no válido');
      }

      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUpdateUser = async () => {
    try {
      setIsSaving(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found');

      await axios.put(
        `${API_BASE_URL}/users/${id}`,
        userData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      Alert.alert(
        'Éxito',
        'Usuario actualizado correctamente',
        [{ text: 'OK', onPress: () => router.push('/(tabs)/dashboard') }]
      );
    } catch (err) {
      console.error('Error updating user:', err);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserData) => (value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchUserData}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderInput = (label: string, field: keyof UserData) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: textColor }]}>{label}:</Text>
      <TextInput
        style={[
          styles.input,
          { color: textColor, backgroundColor: backgroundColor }
        ]}
        value={userData[field]}
        onChangeText={handleInputChange(field)}
        placeholderTextColor="#9CA3AF"
        editable={!isSaving}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {renderInput('Nombre', 'name')}
          {renderInput('Apellido', 'surname')}
          {renderInput('Email', 'email')}
          {renderInput('Teléfono', 'phone')}
          {renderInput('Cobertura', 'coverage')}          
          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving && styles.saveButtonDisabled
            ]}
            onPress={handleUpdateUser}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default EditUserScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import apiClient from '@/services/apiClient';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/hooks/useThemeColor';
import styles from '@/styles/screens/users/createUser.styles';
import axios from 'axios';

const CreateUserScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverage, setCoverage] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleCreateUser = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post(
        '/register', 
        {
          name,
          surname,
          email,
          phone,
          coverage,
          dob,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        router.push('./');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Error al crear el usuario');
      } else if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="indigo" />;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>Nombre:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={name}
        onChangeText={setName}
      />
      <Text style={[styles.label, { color: textColor }]}>Apellido:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={surname}
        onChangeText={setSurname}
      />
      <Text style={[styles.label, { color: textColor }]}>Email:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={[styles.label, { color: textColor }]}>Contraseña:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />
      <Text style={[styles.label, { color: textColor }]}>Teléfono:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={phone}
        onChangeText={setPhone}
      />
      <Text style={[styles.label, { color: textColor }]}>Cobertura:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={coverage}
        onChangeText={setCoverage}
      />
      <Text style={[styles.label, { color: textColor }]}>Fecha de Nacimiento:</Text>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
        value={dob}
        onChangeText={setDob}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button title="Crear Usuario" onPress={handleCreateUser} />
    </View>
  );
};

export default CreateUserScreen;

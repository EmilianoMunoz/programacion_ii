import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/hooks/useThemeColor';

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

    // Log the data being sent to the server
    console.log({
      name,
      surname,
      email,
      phone,
      coverage,
      dob,
      password, // Added for completeness
    });

    try {
      const response = await axios.post(
        'http://192.168.18.166:8080/register',
        {
          name,
          surname,
          email,
          phone,
          coverage,
          dob,
          password, // Asegúrate de que la contraseña se envíe si es necesario
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        router.push('/screens/patientlist');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al crear el usuario');
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
        secureTextEntry // Añadido para ocultar la contraseña
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default CreateUserScreen;

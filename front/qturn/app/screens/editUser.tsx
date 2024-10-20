import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/hooks/useThemeColor';

const EditUserScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Estado para los campos editables
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverage, setCoverage] = useState('');
  const [dob, setDob] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Editar Usuario',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('No token found');

        let userId: number;
        if (id && !isNaN(Number(id))) {
          userId = Number(id);
        } else {
          console.error('ID no válido:', id);
          return;
        }

        const response = await axios.get(`http://192.168.18.166:8080/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUserData(response.data);
          // Inicializar los campos editables con los datos del usuario
          setName(response.data.name);
          setSurname(response.data.surname);
          setEmail(response.data.email);
          setPhone(response.data.phone);
          setCoverage(response.data.coverage || '');
          setDob(response.data.dob);
        } else {
          throw new Error('Error fetching user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleUpdateUser = async () => {
    // Implementa la lógica para actualizar el usuario aquí
    // Por ejemplo, enviar una solicitud PUT a tu API con los datos actualizados
    const token = await SecureStore.getItemAsync('token');
    if (!token) throw new Error('No token found');

    try {
      const response = await axios.put(`http://192.168.18.166:8080/users/${id}`, {
        name,
        surname,
        email,
        phone,
        coverage,
        dob,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Puedes navegar a otra pantalla o mostrar un mensaje de éxito
        navigation.goBack(); // Regresar a la pantalla anterior
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error al actualizar los datos del usuario');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="indigo" />;
  }

  if (error) {
    return <Text style={[styles.errorText, { color: textColor }]}>{error}</Text>;
  }

  if (!userData) {
    return <Text>No se encontraron datos del usuario.</Text>;
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
      <Button title="Guardar Cambios" onPress={handleUpdateUser} />
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

export default EditUserScreen;

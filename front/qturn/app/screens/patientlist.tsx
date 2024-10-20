import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { useAuth } from '@/authcontext'; 
import * as SecureStore from 'expo-secure-store';
import UserList from '@/components/userlist';
import { useNavigation } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

const PatientList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigation = useNavigation();

  const itemColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Lista de Usuarios',
      headerStyle: { backgroundColor },
      headerTintColor: textColor,
    });
  }, [navigation, backgroundColor, textColor]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://192.168.18.166:8080/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data);
      } else {
        throw new Error('Error fetching users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Error al cargar los pacientes');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <UserList users={users} />
      <TouchableOpacity style={[styles.item, { marginTop: 16 }]}>
        <Text style={[styles.itemText, { color: 'white' }]}>Nuevo Usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    flexDirection: 'column', // Asegurarse de que los elementos se alineen en columna
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 5,
    alignItems: 'center',
    backgroundColor: 'indigo',
  },
  itemText: {
    fontSize: 16,
  },
});

export default PatientList;

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const UserList: React.FC<{ users: any[] }> = ({ users }) => {
  const router = useRouter();

  const handleEditUser = (userId: number) => {
    console.log(`Modificar usuario con ID: ${userId}`);
    router.push(`/screens/editUser?id=${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    const token = await SecureStore.getItemAsync('token');
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.18.166:8080/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Usuario eliminado', 'El usuario ha sido eliminado correctamente.');
            } catch (error) {
              console.error('Error al eliminar el usuario:', error);
              Alert.alert('Error', 'No se pudo eliminar el usuario.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.itemText}>{item.name} {item.surname}</Text>
        <Text style={styles.itemRole}>{item.role}</Text>
      </View>
      <TouchableOpacity onPress={() => handleEditUser(item.id)} style={styles.editButton}>
        <Ionicons name="pencil" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 2,
    width: 300,
    alignSelf: 'center',
    backgroundColor: 'indigo',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center', 
  },
  userInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemRole: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'left',
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default UserList;

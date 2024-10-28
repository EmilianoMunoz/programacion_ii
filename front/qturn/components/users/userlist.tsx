import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import styles from '@/styles/components/users/userlist.styles';

const UserList: React.FC<{ users: any[] }> = ({ users }) => {
  const router = useRouter();

  const handleEditUser = (userId: number) => {
    router.push(`/screens/users/editUser?id=${userId}`);
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
              router.push('/(tabs)/home')
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


export default UserList;

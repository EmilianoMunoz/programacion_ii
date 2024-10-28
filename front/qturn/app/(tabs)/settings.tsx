import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/authcontext';
import useStyles from '@/styles/(tabs)/settings.styles';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const styles = useStyles();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('token');
              await SecureStore.deleteItemAsync('userId');
              await SecureStore.deleteItemAsync('name');
              await SecureStore.deleteItemAsync('surname');
              await SecureStore.deleteItemAsync('email');
              await SecureStore.deleteItemAsync('role');

              await logout();

              Alert.alert(
                'Sesión cerrada',
                'Has cerrado sesión exitosamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      router.replace('/');
                    }
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión. Por favor, intenta de nuevo.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Link href="/profile" asChild style={styles.item}>
          <TouchableOpacity>
            <Text style={styles.itemText}>Perfil</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Privacidad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Ayuda</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

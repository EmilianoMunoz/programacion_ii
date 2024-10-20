import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import UserInfo from '../../components/carduser';
import { useThemeColor } from '@/hooks/useThemeColor';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router'; // Importa useRouter

interface UserInfoProps {
  name: string;
  surname: string;
  coverage: string;
  email: string;
  phone: string;
  dob: string;
}

const Profile: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonColor = useThemeColor({}, 'tint');
  const router = useRouter(); // Inicializa el router

  const [userData, setUserData] = useState<UserInfoProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        const response = await axios.get(`http://192.168.18.166:8080/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        Alert.alert('Error', 'No se pudieron obtener los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={buttonColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {userData ? (
        <UserInfo 
          name={userData.name} 
          surname={userData.surname} 
          coverage={userData.coverage || "No Aplica"}
          email={userData.email}
          phone={userData.phone} 
          dob={userData.dob}
        />
      ) : (
        <Text>No se encontraron datos de usuario.</Text>
      )}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={async () => {
          const userId = await SecureStore.getItemAsync('userId');
          // Navega a EditUserScreen pasando el ID del usuario
          router.push(`/screens/editUser?id=${userId}`); 
        }}
      >
        <Text style={styles.buttonText}>Modificar datos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: StatusBar.currentHeight || 40,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;

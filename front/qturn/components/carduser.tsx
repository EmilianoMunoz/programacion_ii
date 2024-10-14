import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';

interface UserInfoProps {
  name: string;
  surname: string;
  coverage: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
}

const UserInfo: React.FC = () => {
  const colorScheme = useColorScheme();
  const [userData, setUserData] = useState<UserInfoProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUserIdFromStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(parseInt(storedUserId, 10));
      } else {
        console.error('No se encontró el userId en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al obtener el userId desde AsyncStorage:', error);
    }
  };

  const fetchUserData = async (id: number) => {
    try {
      const response = await axios.get(`http://192.168.18.166:8080/users/${id}`, {
        timeout: 5000,
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserIdFromStorage();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserData(userId);
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="indigo" />;
  }

  if (!userData) {
    return <Text>No se encontraron datos del usuario.</Text>;
  }

  const textColor = colorScheme === 'dark' ? 'white' : 'black';

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={100} color={textColor} />
      <Text style={[styles.text, { color: textColor }]}>{`${userData.name} ${userData.surname}`}</Text>
      <Text style={[styles.text, { color: textColor }]}>{userData.email}</Text>
      <Text style={[styles.text, { color: textColor }]}>{userData.phone}</Text>
      <Text style={[styles.text, { color: textColor }]}>{userData.coverage}</Text>
      <Text style={[styles.text, { color: textColor }]}>{userData.dob}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default UserInfo;

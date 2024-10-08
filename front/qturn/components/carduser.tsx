// components/carduser.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';


interface UserInfoProps {
  name: string;
  surname: string;
  healthInsurance: string;
  email: string;
  password: string;
  phone: string;
  onEdit?: (field: string) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  surname,
  healthInsurance,
  email,
  password,
  phone,
  onEdit,
}) => {
  const colorScheme = useColorScheme();
  const maskedPassword = '*'.repeat(password.length);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? '#333' : 'white',
      borderRadius: 10,
      shadowColor: colorScheme === 'dark' ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 20,
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    detailsContainer: {
      marginTop: 10,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      color: colorScheme === 'dark' ? '#aaa' : '#555',
    },
    detail: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#fff' : '#333',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="person-circle" size={100} color={colorScheme === 'dark' ? '#fff' : 'indigo'} />
        <Text style={styles.name}>{name} {surname}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.detail}>{email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.detail}>{phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Obra Social:</Text>
          <Text style={styles.detail}>{healthInsurance}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Contraseña:</Text>
          <Text style={styles.detail}>{maskedPassword}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;

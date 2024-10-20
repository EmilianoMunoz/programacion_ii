import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserInfoProps {
  name: string;
  surname: string;
  coverage: string;
  email: string;
  phone: string;
  dob: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, surname, coverage, email, phone, dob }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={100} color="black" />
      <Text style={styles.title}>Información del Usuario</Text>
      <Text style={styles.label}>Nombre:</Text>
      <Text style={styles.text}>{`${name} ${surname}`}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{email}</Text>
      <Text style={styles.label}>Teléfono:</Text>
      <Text style={styles.text}>{phone}</Text>
      <Text style={styles.label}>Cobertura:</Text>
      <Text style={styles.text}>{coverage}</Text>
      <Text style={styles.label}>Fecha de Nacimiento:</Text>
      <Text style={styles.text}>{formatDate(dob)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: '600',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default UserInfo;

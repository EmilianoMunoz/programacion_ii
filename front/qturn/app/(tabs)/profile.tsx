import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import UserInfo from '../../components/carduser';
import { useThemeColor } from '@/hooks/useThemeColor';

const Profile: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <UserInfo 
        name="Emiliano" 
        surname="Muñoz" 
        healthInsurance="No posee"
        email="emi@test.com"
        password="123456789"
        phone="2995739270" 
      />
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={() => console.log('Modificar datos presionado')}
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
});

export default Profile;

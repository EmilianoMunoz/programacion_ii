import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router'; // Asegúrate de importar useRouter

const Dashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const buttonColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const router = useRouter(); // Inicializa el router

  // Botones relacionados con acciones de un dashboard
  const buttons = [
    { title: 'Próximos Turnos', onPress: () => router.push('/screens/dailyAppointment') },
    { title: 'Administrar Usuarios', onPress: () => router.push('/screens/patientlist') },
    { title: 'Ver Estadísticas', onPress: () => console.log('Ver estadísticas presionado') },
    { title: 'Configuración', onPress: () => console.log('Configuración presionada') },
  ];

  const buttonSize = Math.min((width - 60) / 2, 150);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.buttonGrid}>
        {buttons.map((button, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: buttonColor, width: buttonSize, height: buttonSize },
              pressed && styles.buttonPressed
            ]}
            onPress={button.onPress}
          >
            {({ pressed }) => (
              <Text style={[
                styles.buttonText,
                { color: 'white' },
                pressed && styles.buttonTextPressed
              ]}>
                {button.title}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 100,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    maxWidth: 320,
    gap: 15, // Espacio entre botones
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 120,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 5,
    fontWeight: 'bold',
  },
  buttonTextPressed: {
    fontSize: 15,
  },
});

export default Dashboard;

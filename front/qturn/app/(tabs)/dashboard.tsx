import React from 'react';
import { View, Text, Pressable, useWindowDimensions, Image } from 'react-native';
import { useRouter } from 'expo-router'; 
import useStyles from '@/styles/(tabs)/dashboard.styles';

const Dashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const styles = useStyles();

  const buttons = [
    { title: 'Próximos Turnos', onPress: () => router.push('/screens/doctors/dailyAppointment') },
    { title: 'Administrar Usuarios', onPress: () => router.push('/screens/users/listUser') },
    { title: 'Modificar horarios', onPress: () => router.push('/screens/doctors/doctorSchedule') },
    { title: 'Configuración', onPress: () => console.log('Configuración presionada') },
  ];

  const buttonSize = Math.min((width - 60) / 2, 150);

  return (
    <View style={styles.container}>
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
              { width: buttonSize, height: buttonSize },
              pressed && styles.buttonPressed
            ]}
            onPress={button.onPress}
          >
            {({ pressed }) => (
              <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                {button.title}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Dashboard;

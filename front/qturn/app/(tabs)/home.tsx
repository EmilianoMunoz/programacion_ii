import React from 'react';
import { View, Text, Pressable, useWindowDimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import createStyles from '@/styles/(tabs)/dashboard.styles';
import { useThemeColor } from '@/hooks/useThemeColor';

const HomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const titleColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const inputBackgroundColor = useThemeColor({}, 'text');

  const styles = createStyles({
    backgroundColor,
    buttonBackground: tintColor,
    buttonTextColor,
    titleColor,
    inputBackground: inputBackgroundColor,
  });

  const DashboardTitle: React.FC = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.titleMain}>Sistema de</Text> 
      <Text style={styles.titleHighlight}>Turnos</Text>
      <View style={styles.titleAccent} />
    </View>
  );


  const buttons = [
    { title: 'Solicitar Turno', onPress: () => router.push('/screens/appointments/newAppointment') },
    { title: 'Modificar Turno', onPress: () => router.push('/screens/appointments/editAppointment') },
    { title: 'Ver Próximo Turno', onPress: () => router.push('/screens/appointments/viewAppointment') },
    { title: 'Cancelar Turno', onPress: () => router.push('/screens/appointments/deleteAppointment') },
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
      <DashboardTitle />
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
            accessibilityLabel={button.title}
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

export default HomeScreen;

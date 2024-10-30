import React from 'react';
import { View, Text, Pressable, useWindowDimensions, Image } from 'react-native';
import { useRouter } from 'expo-router'; 
import createStyles from '@/styles/(tabs)/dashboard.styles';
import { useThemeColor } from '@/hooks/useThemeColor';


const Dashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const titleColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
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

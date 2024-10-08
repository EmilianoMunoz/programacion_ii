import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const HomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const buttonColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const buttons = [
    { title: 'Solicitar Turno', onPress: () => console.log('Solicitar turno presionado') },
    { title: 'Modificar Turno', onPress: () => console.log('Modificar turno presionado') },
    { title: 'Ver Próximo Turno', onPress: () => console.log('Ver próximo turno presionado') },
    { title: 'Cancelar Turno', onPress: () => console.log('Cancelar turno presionado') },
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
      <Text style={[styles.title, { color: textColor }]}>Sistema de Turnos</Text>
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
    gap: 15,
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

export default HomeScreen;
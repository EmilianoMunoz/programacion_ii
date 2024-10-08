import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

interface IndexProps {
  onLogin: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tint');
  const buttonColor = useThemeColor({}, 'tint');
  const buttonText = useThemeColor({}, 'text');

  const handleLogin = () => {
    router.push("/(tabs)");
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      </View>
      <TextInput
        style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor }]}
        placeholder="Usuario"
        placeholderTextColor={textColor}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor }]}
        placeholder="Contraseña"
        placeholderTextColor={textColor}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={[styles.buttonSession, { backgroundColor: buttonColor }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: 'white' }]}>Ingresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonSession: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;

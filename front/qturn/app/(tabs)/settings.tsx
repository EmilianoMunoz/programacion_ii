import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';


const Settings: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const itemColor = useThemeColor({}, 'text');
  const logoutButtonColor = useThemeColor({}, 'tint');
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.menuContainer}>
        <Link href="/profile" asChild style={[styles.item, { borderColor: itemColor }]}>
          <TouchableOpacity>
            <Text style={[styles.itemText, { color: itemColor }]}>Perfil</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={[styles.item, { borderColor: itemColor }]}>
          <Text style={[styles.itemText, { color: itemColor }]}>Notificaciones</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.item, { borderColor: itemColor }]}>
          <Text style={[styles.itemText, { color: itemColor }]}>Privacidad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, { borderColor: itemColor }]}>
          <Text style={[styles.itemText, { color: itemColor }]}>Ayuda</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.item, { borderColor: itemColor, backgroundColor: logoutButtonColor }]} 
        onPress={handleLogout}
      >
        <Text style={[styles.itemText, styles.logoutButtonText]}>Cerrar sesión</Text>
      </TouchableOpacity>
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
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  item: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 5,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  logoutButtonText: {
    color: '#fff',
  },
});

export default Settings;

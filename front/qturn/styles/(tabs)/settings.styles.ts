import { StyleSheet } from "react-native";
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const itemBorderColor = useThemeColor({}, 'text');
  const itemTextColor = useThemeColor({}, 'text');
  const logoutButtonColor = useThemeColor({}, 'buttonBackground'); // Color para el botón de cerrar sesión
  const logoutButtonTextColor = useThemeColor({}, 'buttonText');

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: backgroundColor,
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
      borderColor: itemBorderColor,
    },
    itemText: {
      fontSize: 16,
      color: itemTextColor,
    },
    logoutButton: {
      borderColor: itemBorderColor, // Añadido para mantener el mismo estilo de borde
      borderWidth: 1,
      borderRadius: 20,
      padding: 15,
      width: '100%',
      alignItems: 'center',
      backgroundColor: logoutButtonColor, // Color de fondo para el botón de cerrar sesión
    },
    logoutButtonText: {
      color: logoutButtonTextColor,
      fontWeight: '500',
    },
  });
};

export default useStyles;

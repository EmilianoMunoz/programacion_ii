// home.styles.ts

import { StyleSheet } from "react-native";
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonColor = useThemeColor({}, 'buttonBackground');
  const textColor = useThemeColor({}, 'text');

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor,
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
      color: textColor,
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
      backgroundColor: buttonColor,
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
};

export default useStyles;

import { StyleSheet } from "react-native";
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const titleColor = useThemeColor({}, 'titleColor');

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
      color: titleColor,
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
      backgroundColor: buttonBackground,
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonText: {
      color: buttonTextColor,
      fontSize: 16,
      textAlign: 'center',
      padding: 5,
      fontWeight: 'bold',
    },
    buttonTextPressed: {
      fontSize: 15,
      color: buttonTextColor,
    },
  });
};

export default useStyles;
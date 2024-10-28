import { Dimensions, StyleSheet } from "react-native";
import { useThemeColor } from '@/hooks/useThemeColor';

const { width: windowWidth } = Dimensions.get('window');

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({}, 'inputWrapper');

  return StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: windowWidth * 0.1,
      paddingVertical: 40,
      backgroundColor,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: windowWidth * 0.4,
      height: windowWidth * 0.4,
      resizeMode: 'contain',
    },
    formContainer: {
      width: '100%',
      gap: 16,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: inputBackground || 'rgba(255, 255, 255, 0.1)',
      height: 56,
      paddingHorizontal: 16,
    },
    inputIcon: {
      marginRight: 12,
      color: textColor,
    },
    input: {
      flex: 1,
      height: '100%',
      fontSize: 16,
      color: textColor,
    },
    eyeButton: {
      padding: 8,
      marginLeft: 8,
    },
    button: {
      width: '100%',
      height: 56,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      backgroundColor: buttonBackground, 
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: buttonTextColor,
    },
    testButtonsContainer: {
      marginTop: 24,
      gap: 12,
    },
  });
};

export default useStyles;

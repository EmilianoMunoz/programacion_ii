import { StyleSheet } from "react-native";

const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  titleColor: string;
  inputBackground: string;
}) => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.backgroundColor,
    },
    logoContainer: {
      marginBottom: 40,
      alignItems: 'center',
      marginTop: 10,
    },
    logo: {
      width: 150,
      height: 150,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 100,
      color: theme.titleColor,
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
      backgroundColor: theme.buttonBackground,
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonText: {
      color: theme.buttonTextColor,
      fontSize: 16,
      textAlign: 'center',
      padding: 5,
      fontWeight: 'bold',
    },
    buttonTextPressed: {
      fontSize: 15,
      color: theme.buttonTextColor,
    },
    titleContainer: {
      alignItems: 'center',
      marginVertical: 20,
      position: 'relative',
      marginTop: 0,
      padding: 20,
    },
    titleMain: {
      fontSize: 28,
      color: '#374151',
      fontWeight: '500',
      letterSpacing: 1,
    },
    titleHighlight: {
      fontSize: 42,
      fontStyle: 'italic',
      color: 'indigo',
      fontWeight: 'bold',
      letterSpacing: 1.5,
      marginTop: -5,
    },
    titleAccent: {
      position: 'absolute',
      bottom: -8,
      backgroundColor: 'indigo',
      height: 4,
      width: 60,
      borderRadius: 2,
      opacity: 0.6,
    }
  });

export default createStyles;
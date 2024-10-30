import { StyleSheet } from "react-native";


const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  inputBackground: string;
  textColor: string;
  buttonColor: string;
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
    },
    logo: {
      width: 150,
      height: 150,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 100,
      color: theme.textColor,
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
      backgroundColor: theme.buttonColor,
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

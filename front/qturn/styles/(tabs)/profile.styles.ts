import { StatusBar, StyleSheet } from "react-native";

const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  titleColor: string;
  inputBackground: string;
  buttonColor: string;
}) => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingTop: StatusBar.currentHeight || 40,
      backgroundColor: theme.backgroundColor,
    },
    button: {
      marginTop: 20,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.buttonBackground,
    },
    buttonText: {
      color: theme.buttonTextColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default createStyles;

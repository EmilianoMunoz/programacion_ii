import { StyleSheet } from "react-native";

const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  titleColor: string;
  inputBackground: string;
  itemBorderColor: string;
  itemTextColor: string;
  logoutButtonColor: string;
  logoutButtonTextColor: string;
}) => StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.backgroundColor,
    },
    logoContainer: {
      marginBottom: 30, 
      alignItems: 'center',
    },
    logo: {
      width: 150,
      height: 150,
    },
    menuContainer: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      marginTop: 20,
    },
    item: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 5,
      alignItems: 'center',
      borderColor: theme.itemBorderColor,
    },
    itemText: {
      fontSize: 16,
      color: theme.itemTextColor,
    },
    logoutButton: {
      borderColor: theme.itemBorderColor,
      borderWidth: 1,
      borderRadius: 20,
      padding: 15,
      width: '100%',
      alignItems: 'center',
      backgroundColor: theme.logoutButtonColor, 
      marginTop: 30,
    },
    logoutButtonText: {
      color: theme.logoutButtonTextColor,
      fontWeight: '500',
    },
  });

export default createStyles;

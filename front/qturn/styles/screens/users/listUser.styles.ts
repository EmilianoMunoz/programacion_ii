import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'flex-start',
      flexDirection: 'column',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 5,
      alignItems: 'center',
      backgroundColor: 'indigo',
    },
    itemText: {
      fontSize: 16,
    },
  });

  export default styles;
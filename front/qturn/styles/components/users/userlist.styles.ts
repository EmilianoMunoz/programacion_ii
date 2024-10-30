import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      padding: 10,
      marginBottom: 2,
      width: 350,
      alignSelf: 'center',
      backgroundColor: 'indigo',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      alignItems: 'center', 
    },
    userInfo: {
      flex: 1,
    },
    itemText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
    itemRole: {
      fontSize: 12,
      color: '#fff',
      textAlign: 'left',
    },
    editButton: {
      padding: 8,
    },
    deleteButton: {
      padding: 8,
      marginLeft: 8,
    },
    listContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  });

  export default styles;
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 20,
    },
    label: {
      fontSize: 16,
      marginVertical: 5,
      fontWeight: '600',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
    },
  });

export default styles;
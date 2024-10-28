import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      padding: 20,
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      fontWeight: '600',
    },
    input: {
      height: 45,
      borderColor: '#E5E7EB',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
    },
    saveButton: {
      backgroundColor: 'indigo', // Indigo-600
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 20,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: '#6B7280', // Gray-500
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      color: '#EF4444', // Red-500
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: '#4F46E5',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    retryButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  export default styles;
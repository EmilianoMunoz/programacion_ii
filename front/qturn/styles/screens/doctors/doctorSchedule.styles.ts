import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
    },
    container: {
      flex: 1,
      backgroundColor: '#F3F4F6',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: '#4F46E5',
    },
    dayContainer: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      overflow: 'hidden',
    },
    dayHeader: {
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    dayToggle: {
      padding: 16,
      backgroundColor: '#F9FAFB',
    },
    dayToggleEnabled: {
      backgroundColor: '#4F46E5',
    },
    dayToggleText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#4B5563',
    },
    dayToggleTextEnabled: {
      color: 'white',
    },
    daySchedule: {
      padding: 16,
    },
    timeContainer: {
      marginBottom: 16,
    },
    timeSelection: {
      marginBottom: 12,
    },
    timeLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4B5563',
      marginBottom: 8,
    },
    timeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      marginRight: 8,
      backgroundColor: 'white',
    },
    timeButtonSelected: {
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
    },
    timeButtonText: {
      fontSize: 14,
      color: '#4B5563',
    },
    timeButtonTextSelected: {
      color: 'white',
    },
    durationContainer: {
      marginTop: 16,
    },
    durationButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    durationButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: 'white',
    },
    durationButtonSelected: {
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
    },
    durationButtonText: {
      textAlign: 'center',
      color: '#4B5563',
      fontSize: 14,
      fontWeight: '500',
    },
    durationButtonTextSelected: {
      color: 'white',
    },
    saveButton: {
      backgroundColor: '#4F46E5',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    saveButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default styles;
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  return StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: useThemeColor({}, 'titleColor'),
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: useThemeColor({}, 'text'),
    },
    dateSection: {
      marginBottom: 20,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 6,
      backgroundColor: useThemeColor({}, 'background'),
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      gap: 12,
    },
    selectedButton: {
      borderWidth: 2,
      borderColor: useThemeColor({}, 'tint'),
      backgroundColor: useThemeColor({}, 'buttonBackground'),
    },
    dateText: {
      fontSize: 16,
      fontWeight: '500',
      color: useThemeColor({}, 'text'),
    },
    timesContainer: {
      flex: 1,
    },
    timeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      margin: 6,
      backgroundColor: useThemeColor({}, 'icon'),
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      gap: 8,
    },
    availableTime: {
      backgroundColor: useThemeColor({}, 'tint'),
    },
    availableTimeButton: {
      backgroundColor: 'indigo',
      borderRadius: 5,
      padding: 10,
      margin: 5,
    },
    unavailableTimeButton: {
      backgroundColor: 'gray',
      borderRadius: 5,
      padding: 10,
      margin: 5,
    },
    availableTimeText: {
      color: 'white', 
      fontWeight: 'bold',
    },
    unavailableTimeText: {
      color: 'darkgray', 
      fontWeight: 'bold',
    },  
    pastTime: {
      opacity: 0.5,
    },
    timeText: {
      fontSize: 16,
      fontWeight: '600',
      color: useThemeColor({}, 'text'),
    },
    timeButtonsRow: {
      justifyContent: 'space-between',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 12,
    },
    weekButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: useThemeColor({}, 'buttonBackground'),
      padding: 16,
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: useThemeColor({}, 'tabIconDefault'),
    },
    weekButtonText: {
      color: useThemeColor({}, 'buttonText'),
      fontSize: 16,
      fontWeight: '600',
    },
    currentAppointmentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: useThemeColor({}, 'buttonBackground'),
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      gap: 12,
    },
    currentAppointmentText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: useThemeColor({}, 'text'),
    },
    currentTimeSlot: {
      borderWidth: 2,
      borderColor: useThemeColor({}, 'tint'),
      backgroundColor: useThemeColor({}, 'buttonBackground'),
    }
  });
};

export default useStyles;

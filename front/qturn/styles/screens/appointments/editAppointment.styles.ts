import { StyleSheet } from 'react-native';
const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  titleColor: string;
  inputBackground: string;
  borderColor: string;
  textColor: string;
}) => StyleSheet.create({

    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: theme.titleColor,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: theme.titleColor
    },
    dateSection: {
      marginBottom: 20,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 6,
      backgroundColor: theme.backgroundColor,
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
      borderColor: theme.borderColor,
      backgroundColor: theme.backgroundColor
    },
    dateText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textColor,
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
      backgroundColor: theme.backgroundColor,
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      gap: 8,
    },
    availableTime: {
      backgroundColor: theme.backgroundColor,
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
      color: theme.textColor,
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
      backgroundColor: theme.backgroundColor,
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
      backgroundColor: theme.backgroundColor,
    },
    weekButtonText: {
      color: theme.buttonTextColor,
      fontSize: 16,
      fontWeight: '600',
    },
    currentAppointmentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      gap: 12,
    },
    currentAppointmentText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: theme.textColor,
    },
    currentTimeSlot: {
      borderWidth: 2,
      borderColor: theme.borderColor,
      backgroundColor: theme.backgroundColor,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 20,
      color: 'textColor',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'indigo',
      padding: 10,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      marginLeft: 8,
      fontSize: 16,
    },
  });

export default createStyles;

import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = 'indigo'; // Cambia esto si necesitas un color de tema

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: primaryColor,
    },
    appointmentCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      marginVertical: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    appointmentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    headerText: {
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
      color: textColor,
    },
    divider: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: 12,
    },
    appointmentInfo: {
      gap: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dateTimeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    dateTimeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    label: {
      fontSize: 16,
      marginLeft: 4,
      color: textColor,
    },
    value: {
      fontWeight: '600',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEE2E2',
      padding: 16,
      borderRadius: 12,
      marginVertical: 20,
    },
    errorText: {
      color: '#DC2626',
      marginLeft: 8,
      fontSize: 16,
    },
    noAppointmentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 40,
      gap: 16,
    },
    noAppointments: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '500',
      color: textColor,
    },
    buttonContainer: {
      marginTop: 'auto',
      marginBottom: 20,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    backButton: {
      backgroundColor: 'indigo',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor,
    },
  });
};

export default useStyles;
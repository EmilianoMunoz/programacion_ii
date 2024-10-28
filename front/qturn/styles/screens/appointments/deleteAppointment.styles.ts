import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const dangerColor = '#EF4444';
  const primaryColor = 'indigo';
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
    },
    divider: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: 12,
    },
    appointmentInfo: {
      gap: 12,
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
      color: dangerColor,
      marginLeft: 8,
      fontSize: 16,
    },
    noAppointments: {
      textAlign: 'center',
      fontSize: 16,
      marginVertical: 20,
    },
    buttonContainer: {
      gap: 12,
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
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cancelButton: {
      backgroundColor: '#EF4444',
    },
    backButton: {
      backgroundColor: primaryColor,
    },
    buttonText: {
      color: 'white',
      marginLeft: 8,
      fontWeight: '600',
      fontSize: 16,
    },
  });
};

export default useStyles;

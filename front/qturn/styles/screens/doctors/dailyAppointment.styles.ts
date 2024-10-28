import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
    },
    dateSection: {
      marginBottom: 20,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 6,
      backgroundColor: 'white',
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
      borderColor: 'indigo',
      backgroundColor: '#EEF2FF',
    },
    dateText: {
      fontSize: 16,
      fontWeight: '500',
    },
    appointmentsContainer: {
      flex: 1,
    },
    appointmentCard: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 16,
      marginVertical: 6,
      borderRadius: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    timeContainer: {
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRightWidth: 1,
      borderRightColor: '#E5E7EB',
      marginRight: 16,
    },
    timeText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'indigo',
    },
    patientContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 12,
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    patientSurname: {
      fontSize: 14,
      color: '#374151',
      marginBottom: 4,
    },
    coverageText: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
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
      backgroundColor: 'indigo',
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
      backgroundColor: '#9CA3AF',
    },
    weekButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 32,
    },
    emptyStateText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });

export default styles;
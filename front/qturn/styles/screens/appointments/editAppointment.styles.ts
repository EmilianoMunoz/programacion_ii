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
    backgroundColor: theme.backgroundColor,
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
    color: theme.titleColor,
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
  selectedDateButton: {
    borderWidth: 2,
    borderColor: theme.borderColor,
    backgroundColor: theme.backgroundColor,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textColor,
  },
  timeSlotsContainer: {
    flex: 1,
    marginTop: 16,
  },
  timeSlotButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    gap: 8,
  },
  availableSlot: {
    backgroundColor: theme.buttonBackground,
  },
  unavailableSlot: {
    backgroundColor: '#D3D3D3',
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '600',
  },
  availableText: {
    color: 'white',
  },
  unavailableText: {
    color: 'darkgray',
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
    backgroundColor: theme.buttonBackground,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 8,
  },
  weekButtonText: {
    color: theme.buttonTextColor,
    fontSize: 16,
    fontWeight: '600',
  },
  currentAppointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
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
    color: theme.textColor,
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navigationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.buttonTextColor,
  },
  navigationButton: {
    padding: 10,
    backgroundColor: 'indigo', 
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default createStyles;

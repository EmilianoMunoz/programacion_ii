import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const useStyles = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint'); // Usando tint en lugar de primary

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: textColor,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: textColor,
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
      borderColor: tintColor, // Usando tint en lugar de primary
      backgroundColor,
    },
    dateText: {
      fontSize: 16,
      fontWeight: '500',
      color: textColor, // Usando textColor
    },
  timesContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor,
  },
  dateSelectionContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor,
    elevation: 2,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 6,
    backgroundColor,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    gap: 8,
  },
  availableTime: {
    backgroundColor
  },
  pastTime: {
    opacity: 0.5,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: textColor
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
    backgroundColor,
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor,
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    gap: 12,
  },
  warningText: {
    flex: 1,
    color: useThemeColor({}, 'warningText'), // Color de texto de advertencia según el tema
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
};

export default useStyles;

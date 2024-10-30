import { StyleSheet } from "react-native";

const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  titleColor: string;
  inputBackground: string;
  buttonColor: string;
  primaryColor: string;
  textColor: string;
}) => StyleSheet.create({
  dateSection: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.titleColor,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.primaryColor,
    borderRadius: 2,
    marginTop: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: theme.inputBackground,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedButton: {
    backgroundColor: theme.buttonBackground,
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
    transform: [{ scale: 1 }],
    shadowOpacity: 0,
    elevation: 0,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
  },
  dateInfo: {
    marginLeft: 16,
    flex: 1,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.buttonTextColor,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: theme.buttonTextColor,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  weekButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.buttonBackground,
    padding: 14,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  weekButtonText: {
    color: theme.buttonTextColor,
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 8,
  },
});

export default createStyles;
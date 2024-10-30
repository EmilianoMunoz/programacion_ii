import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const buttonWidth = (screenWidth - 64) / 2;

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
  timesContainer: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    width: '100%',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: theme.backgroundColor,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.titleColor,
    textAlign: 'center',
  },
  subtitleBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.primaryColor,
    borderRadius: 2,
    marginTop: 8,
  },
  timeButtonsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  timeButton: {
    width: buttonWidth,
    height: 64,
    marginHorizontal: 4,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: theme.inputBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  availableTime: {
    backgroundColor: theme.primaryColor,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedTime: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  pastTime: {
    backgroundColor: '#E5E7EB',
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: theme.textColor,
  },
  timeTextAvailable: {
    color: 'white',
  },
  timeButtonsRow: {
    justifyContent: 'space-between',
    width: '100%',
  },
  noTimesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noTimesIcon: {
    marginBottom: 16,
  },
  noTimesText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textColor,
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: theme.textColor,
    marginTop: 16,
    opacity: 0.8,
  },
});

export default createStyles;
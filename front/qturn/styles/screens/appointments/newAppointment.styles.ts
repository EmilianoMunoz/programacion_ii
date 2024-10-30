import { StyleSheet } from 'react-native';

const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  titleColor: string;
  inputBackground: string;
  textColor: string;
  borderColor: string;
  warningText: string;
  primaryColor: string;
}) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  dateSelectionContainer: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: theme.titleColor,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginVertical: 20,
    gap: 12,
  },
  warningText: {
    flex: 1,
    color: theme.warningText,
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.textColor,
  },
});

export default createStyles;
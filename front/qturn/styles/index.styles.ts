import { Dimensions, StyleSheet } from "react-native";

const { width: windowWidth } = Dimensions.get('window');

const createStyles = (theme: {
  backgroundColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  textColor: string;
  inputBackground: string;
}) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: windowWidth * 0.1,
    paddingVertical: 40,
    backgroundColor: theme.backgroundColor,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'indigo',  
    backgroundColor: theme.inputBackground || 'rgba(255, 255, 255, 0.1)',
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
    color: theme.textColor,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: theme.textColor,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: theme.buttonBackground,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.buttonTextColor,
  },
  testButtonsContainer: {
    marginTop: 24,
    gap: 12,
  },
});

export default createStyles;
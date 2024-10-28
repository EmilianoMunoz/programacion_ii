import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
      width: width - 32,
      backgroundColor: 'white',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      overflow: 'hidden',
    },
    header: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'indigo',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    coverageBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#e3f2fd',
      borderRadius: 12,
    },
    coverageText: {
      color: 'indigo',
      fontWeight: '600',
      fontSize: 14,
    },
    infoContainer: {
      padding: 20,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'indigo',
    },
    itemIcon: {
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    label: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    text: {
      fontSize: 16,
      color: '#1a1a1a',
      fontWeight: '500',
    },
  });

  export default styles;
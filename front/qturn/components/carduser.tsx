import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface UserInfoProps {
  name: string;
  surname: string;
  coverage: string;
  email: string;
  phone: string;
  dob: string;
}

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={24} color="#666" style={styles.itemIcon} />
    <View style={styles.itemContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  </View>
);

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  surname,
  coverage,
  email,
  phone,
  dob,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color="white" />
        </View>
        <Text style={styles.name}>{`${name} ${surname}`}</Text>
        <View style={styles.coverageBadge}>
          <Text style={styles.coverageText}>{coverage || 'No Aplica'}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <InfoItem
          icon="mail-outline"
          label="Email"
          value={email}
        />
        <InfoItem
          icon="call-outline"
          label="Teléfono"
          value={phone}
        />
        <InfoItem
          icon="calendar-outline"
          label="Fecha de Nacimiento"
          value={formatDate(dob)}
        />
      </View>
    </View>
  );
};

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

export default UserInfo;
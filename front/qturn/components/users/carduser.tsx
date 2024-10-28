import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/components/users/carduser.styles'

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


export default UserInfo;
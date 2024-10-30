import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import apiClient from '@/services/apiClient';
import * as SecureStore from 'expo-secure-store';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import createStyles from '@/styles/screens/appointments/viewAppointmetn.styles';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Appointment {
  id: string;
  time: string;
}

const ViewAppointmentScreen: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primaryColor');
  const textColor = useThemeColor({}, 'itemTextColor');

  const styles = createStyles({
    backgroundColor,
    primaryColor,
    textColor,
  });

  useEffect(() => {
    fetchViewAppointment();
  }, []);

  const fetchViewAppointment = async () => {
    setLoading(true);
    try {
      const [token, userId] = await Promise.all([
        SecureStore.getItemAsync('token'),
        SecureStore.getItemAsync('userId'),
      ]);

      if (!token || !userId) {
        throw new Error('No token or user ID found');
      }

      try {
        const response = await apiClient.get(`/appointments/appointment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setAppointment(response.data);
          setError(null);
        }
      } catch (axiosError: any) {
        if (axiosError.response?.status === 404) {
          setAppointment(null);
          setError('No tenés ningún turno programado.');
        } else {
          console.error('Error fetching next appointment:', axiosError);
          setError('Error al obtener el próximo turno');
        }
      }
    } catch (err) {
      console.error('Error in authentication:', err);
      setError('Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Mi Próximo Turno",
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={styles.backButton.backgroundColor} />
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={24} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : appointment ? (
              <View style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <MaterialIcons name="event" size={24} color={styles.backButton.backgroundColor} />
                  <Text style={styles.headerText}>Detalles del Turno</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.appointmentInfo}>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="confirmation-number" size={20} color={styles.backButton.backgroundColor} />
                    <Text style={styles.label}>
                      ID Turno: <Text style={styles.value}>{appointment.id}</Text>
                    </Text>
                  </View>

                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeItem}>
                      <MaterialIcons name="calendar-today" size={20} color={styles.backButton.backgroundColor} />
                      <Text style={styles.label}>
                        Fecha: <Text style={styles.value}>{appointment.time.split('T')[0]}</Text>
                      </Text>
                    </View>

                    <View style={styles.dateTimeItem}>
                      <MaterialIcons name="access-time" size={20} color={styles.backButton.backgroundColor} />
                      <Text style={styles.label}>
                        Hora: <Text style={styles.value}>{appointment.time.split('T')[1].substring(0, 5)}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.noAppointmentContainer}>
                <MaterialIcons name="event-busy" size={48} color={styles.backButton.backgroundColor} />
                <Text style={styles.noAppointments}>
                  No hay turnos disponibles
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default ViewAppointmentScreen;

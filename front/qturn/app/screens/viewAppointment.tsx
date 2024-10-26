import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface Appointment {
  id: string;
  time: string;
  // Add other appointment properties as needed
}

const ViewAppointmentScreen: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = 'indigo'; // Indigo-600

  useEffect(() => {
    fetchViewAppointment();
  }, []);

  const fetchViewAppointment = async () => {
    setLoading(true);
    try {
      const [token, userId] = await Promise.all([
        SecureStore.getItemAsync('token'),
        SecureStore.getItemAsync('userId')
      ]);
  
      if (!token || !userId) {
        throw new Error('No token or user ID found');
      }
  
      try {
        const response = await axios.get(
          `http://192.168.18.166:8080/appointments/appointment/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
  
        if (response.data) {
          setAppointment(response.data);
          setError(null); // Limpiar cualquier error previo
        }
      } catch (axiosError: any) {
        // Si el error es 404, significa que no hay turnos (caso esperado)
        if (axiosError.response?.status === 404) {
          setAppointment(null);
          setError('No tenés ningún turno programado.');
        } else {
          // Para otros errores, mantener el mensaje de error genérico
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

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryColor }]}>Próximo Turno</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : appointment ? (
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <MaterialIcons name="event" size={24} color={primaryColor} />
            <Text style={[styles.headerText, { color: textColor }]}>
              Detalles del Turno
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.appointmentInfo}>
            <View style={styles.infoRow}>
              <MaterialIcons name="confirmation-number" size={20} color={primaryColor} />
              <Text style={[styles.label, { color: textColor }]}>
                ID Turno: <Text style={styles.value}>{appointment.id}</Text>
              </Text>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <MaterialIcons name="calendar-today" size={20} color={primaryColor} />
                <Text style={[styles.label, { color: textColor }]}>
                  Fecha: <Text style={styles.value}>{appointment.time.split('T')[0]}</Text>
                </Text>
              </View>

              <View style={styles.dateTimeItem}>
                <MaterialIcons name="access-time" size={20} color={primaryColor} />
                <Text style={[styles.label, { color: textColor }]}>
                  Hora: <Text style={styles.value}>{appointment.time.split('T')[1].substring(0, 5)}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.noAppointmentContainer}>
          <MaterialIcons name="event-busy" size={48} color={primaryColor} />
          <Text style={[styles.noAppointments, { color: textColor }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  appointmentInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 16,
    marginLeft: 4,
  },
  value: {
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 8,
    fontSize: 16,
  },
  noAppointmentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    gap: 16,
  },
  noAppointments: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    backgroundColor: 'indigo',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ViewAppointmentScreen;
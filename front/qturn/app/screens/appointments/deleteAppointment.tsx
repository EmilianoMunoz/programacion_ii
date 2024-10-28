import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useStyles from '@/styles/screens/appointments/deleteAppointment.styles';

interface Appointment {
  id: string;
  time: string;
}

const CancelAppointmentScreen: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const styles = useStyles();

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

      const response = await axios.get(
        `http://192.168.18.166:8080/appointments/appointment/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointment(response.data);
      setError(null);
    } catch (axiosError: any) {
      if (axiosError.response?.status === 404) {
        setAppointment(null);
        setError('No tenés ningún turno programado.');
      } else {
        console.error('Error fetching next appointment:', axiosError);
        setError('Error al obtener el próximo turno');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment?.id) {
      Alert.alert("Información", "No hay ningún turno para cancelar");
      return;
    }

    Alert.alert(
      "Confirmar Cancelación",
      "¿Está seguro que desea cancelar este turno?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('token');
              if (!token) {
                throw new Error('No se encontró el token de autenticación');
              }

              await axios.delete(
                `http://192.168.18.166:8080/appointments/${appointment.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert("Éxito", "Turno cancelado con éxito");
              router.back();
            } catch (axiosError: any) {
              if (axiosError.response?.status === 404) {
                Alert.alert("Información", "El turno ya no existe o fue cancelado");
                router.back();
              } else {
                Alert.alert("Error", "No se pudo cancelar el turno");
              }
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="indigo" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximo Turno</Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : appointment ? (
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <MaterialIcons name="event" size={24} color="indigo" />
            <Text style={styles.headerText}>Detalles del Turno</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.appointmentInfo}>
            <Text style={styles.label}>
              ID Turno: <Text style={styles.value}>{appointment.id}</Text>
            </Text>
            
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <MaterialIcons name="calendar-today" size={20} color="indigo" />
                <Text style={styles.label}>
                  Fecha: <Text style={styles.value}>{appointment.time.split('T')[0]}</Text>
                </Text>
              </View>
              
              <View style={styles.dateTimeItem}>
                <MaterialIcons name="access-time" size={20} color="indigo" />
                <Text style={styles.label}>
                  Hora: <Text style={styles.value}>{appointment.time.split('T')[1].substring(0, 5)}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noAppointments}>No hay turnos disponibles.</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancelAppointment}
        >
          <MaterialIcons name="cancel" size={24} color="white" />
          <Text style={styles.buttonText}>Eliminar turno</Text>
        </TouchableOpacity>

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

export default CancelAppointmentScreen;

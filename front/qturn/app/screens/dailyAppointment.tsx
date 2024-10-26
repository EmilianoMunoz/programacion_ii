import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format, addDays, startOfWeek, isSameDay, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Appointment {
  id: number;
  time: string;
  patientName: string;
  patientCoverage: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

const DoctorAppointmentsScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = 'indigo';

  const API_URL = 'http://192.168.18.166:8080/';

  const generateCurrentWeek = (baseDate: Date) => {
    const start = startOfWeek(baseDate, { weekStartsOn: 1 });
    return Array.from({ length: 5 }, (_, i) => addDays(start, i));
  };

  useEffect(() => {
    const today = new Date();
    setCurrentWeek(generateCurrentWeek(today));
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      const id = await SecureStore.getItemAsync('userId');
      if (!id) throw new Error('No se pudo obtener el ID del doctor');
      setDoctorId(parseInt(id));
    } catch (error) {
      console.error('Error durante la inicialización:', error);
      Alert.alert(
        "Error",
        "Hubo un problema al inicializar la pantalla. Por favor, intentá más tarde."
      );
    }
  };

  const fetchAppointments = async (date: Date) => {
    if (!doctorId) {
      console.warn('No hay doctorId disponible');
      return;
    }
    
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        Alert.alert('Error', 'Por favor, inicie sesión nuevamente');
        return;
      }

      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Consultando citas para:', {
        doctorId,
        date: formattedDate,
        url: `${API_URL}appointments/doctor/${doctorId}/appointments`
      });
      
      const response = await axios.get(
        `${API_URL}appointments/doctor/${doctorId}/appointments`, 
        {
          params: { date: formattedDate },
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Respuesta del servidor:', {
        status: response.status,
        data: response.data
      });

      if (Array.isArray(response.data)) {
        setAppointments(response.data);
        if (response.data.length === 0) {
          console.log('No se encontraron citas para este día');
        }
      } else {
        console.error('La respuesta no es un array:', response.data);
        setAppointments([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            params: error.config?.params
          }
        });

        if (error.response?.status === 404) {
          Alert.alert('Info', 'No hay turnos programados para este día');
        } else if (error.response?.status === 401) {
          Alert.alert('Error', 'Sesión expirada. Por favor, inicie sesión nuevamente');
        } else if (error.response?.status === 403) {
          Alert.alert('Error', 'No tiene permisos para ver estos turnos');
        } else {
          Alert.alert('Error', 'Error al conectar con el servidor');
        }
      } else {
        console.error('Error no relacionado con Axios:', error);
        Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchAppointments(date);
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      PENDING: '#4F46E5',    // Indigo
      COMPLETED: '#10B981',  // Verde
      CANCELLED: '#EF4444'   // Rojo
    };
    return colors[status];
  };

  const getStatusText = (status: Appointment['status']) => {
    const texts = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado'
    };
    return texts[status];
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    Alert.alert(
      'Detalles del Turno',
      `Paciente: ${appointment.patientName}\nCobertura: ${appointment.patientCoverage}\nHorario: ${format(new Date(appointment.time), 'HH:mm')}\nEstado: ${getStatusText(appointment.status)}`,
      [
        { text: 'Cerrar' },
        {
          text: 'Marcar Completado',
          onPress: () => updateAppointmentStatus(appointment.id, 'COMPLETED'),
          style: 'default',
        },
        {
          text: 'Cancelar Turno',
          onPress: () => updateAppointmentStatus(appointment.id, 'CANCELLED'),
          style: 'destructive',
        },
      ]
    );
  };

  const updateAppointmentStatus = async (appointmentId: number, newStatus: Appointment['status']) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.patch(
        `${API_URL}/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (selectedDate) {
        fetchAppointments(selectedDate);
      }
      
      Alert.alert('Éxito', 'Estado del turno actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del turno');
    }
  };

  const changeWeek = (increment: number) => {
    const newWeek = currentWeek.map(date => addDays(date, increment));
    if (increment < 0 && isPast(newWeek[0])) return;
    setCurrentWeek(newWeek);
    setSelectedDate(null);
    setAppointments([]);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Agenda de Turnos
      </Text>

      <View style={styles.dateSection}>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Seleccione una fecha:
        </Text>
        
        <FlatList
          data={currentWeek}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateButton,
                selectedDate && isSameDay(selectedDate, item) && styles.selectedButton
              ]}
              onPress={() => handleDateSelect(item)}
            >
              <MaterialIcons 
                name="event" 
                size={24} 
                color={selectedDate && isSameDay(selectedDate, item) ? primaryColor : textColor} 
              />
              <Text style={[
                styles.dateText,
                { color: selectedDate && isSameDay(selectedDate, item) ? primaryColor : textColor }
              ]}>
                {format(item, 'eeee, dd MMMM', { locale: es })}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.toISOString()}
        />
      </View>

      {selectedDate && (
        <View style={styles.appointmentsContainer}>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Turnos del día:
          </Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={primaryColor} />
          ) : appointments.length > 0 ? (
            <FlatList
              data={appointments}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.appointmentCard}
                  onPress={() => handleAppointmentPress(item)}
                >
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {format(new Date(item.time), 'HH:mm')}
                    </Text>
                  </View>

                  <View style={styles.patientContainer}>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>{item.patientName}</Text>
                      <Text style={styles.coverageText}>{item.patientCoverage}</Text>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: textColor }]}>
                No hay turnos programados para este día
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.weekButton, isPast(addDays(currentWeek[0], -7)) && styles.disabledButton]}
          onPress={() => changeWeek(-7)}
          disabled={isPast(addDays(currentWeek[0], -7))}
        >
          <MaterialIcons name="chevron-left" size={24} color="white" />
          <Text style={styles.weekButtonText}>Semana Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.weekButton}
          onPress={() => changeWeek(7)}
        >
          <Text style={styles.weekButtonText}>Semana Siguiente</Text>
          <MaterialIcons name="chevron-right" size={24} color="white" />
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 12,
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appointmentsContainer: {
    flex: 1,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    marginRight: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  patientContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  coverageText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  weekButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'indigo',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  weekButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DoctorAppointmentsScreen;
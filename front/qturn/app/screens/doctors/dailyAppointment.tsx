import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { format, addDays, startOfWeek, isSameDay, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import styles from '@/styles/screens/doctors/dailyAppointment.styles';
import apiClient from '@/services/apiClient';

interface Appointment {
  id: number;
  time: string;
  patientName: string;
  patientSurname: string;
  patientCoverage: string;
}

const API_URL = 'http://192.168.18.166:8080';
const PRIMARY_COLOR = 'indigo';

const getAuthToken = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    Alert.alert('Error', error.message);
  } else {
    console.error('Error no relacionado con Axios:', error);
    Alert.alert('Error', 'Ocurrió un error inesperado');
  }
};

const DateButton: React.FC<{
  date: Date;
  isSelected: boolean;
  onPress: () => void;
  textColor: string;
}> = React.memo(({ date, isSelected, onPress, textColor }) => (
  <TouchableOpacity
    style={[styles.dateButton, isSelected && styles.selectedButton]}
    onPress={onPress}
  >
    <MaterialIcons 
      name="event" 
      size={24} 
      color={isSelected ? PRIMARY_COLOR : textColor} 
    />
    <Text style={[styles.dateText, { color: isSelected ? PRIMARY_COLOR : textColor }]}>
      {format(date, 'eeee, dd MMMM', { locale: es })}
    </Text>
  </TouchableOpacity>
));

const AppointmentCard: React.FC<{
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}> = React.memo(({ appointment, onPress }) => (
  <TouchableOpacity
    style={styles.appointmentCard}
    onPress={() => onPress(appointment)}
  >
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>
        {format(new Date(appointment.time), 'HH:mm')}
      </Text>
    </View>

    <View style={styles.patientContainer}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>
          {appointment.patientName} {appointment.patientSurname}
        </Text>
        <Text style={styles.coverageText}>{appointment.patientCoverage}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

const useAuth = () => {
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
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

    initializeAuth();
  }, []);

  return { doctorId };
};

const useAppointments = (doctorId: number | null) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = useCallback(async (date: Date) => {
    if (!doctorId) return;
    
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await apiClient.get(
        `${API_URL}/appointments/doctor/${doctorId}/appointments`, 
        {
          params: { date: formattedDate },
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId]);

  return {
    appointments,
    isLoading,
    fetchAppointments,
  };
};

const DoctorAppointmentsScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const { doctorId } = useAuth();
  const {
    appointments,
    isLoading,
    fetchAppointments,
  } = useAppointments(doctorId);

  useEffect(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    setCurrentWeek(Array.from({ length: 5 }, (_, i) => addDays(start, i)));
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    fetchAppointments(date);
  }, [fetchAppointments]);

  const handleAppointmentPress = useCallback((appointment: Appointment) => {
    if (!selectedDate) return;

    Alert.alert(
      'Detalles del Turno',
      `Paciente: ${appointment.patientName} ${appointment.patientSurname}\n` +
      `Cobertura: ${appointment.patientCoverage}\n` +
      `Horario: ${format(new Date(appointment.time), 'HH:mm')}`,
      [{ text: 'Cerrar' }]
    );
  }, [selectedDate]);

  const changeWeek = useCallback((increment: number) => {
    setCurrentWeek(prev => {
      const newWeek = prev.map(date => addDays(date, increment));
      if (increment < 0 && isPast(newWeek[0])) return prev;
      return newWeek;
    });
    setSelectedDate(null);
  }, []);

  const renderDateItem = useCallback(({ item }: { item: Date }) => (
    <DateButton
      date={item}
      isSelected={selectedDate ? isSameDay(selectedDate, item) : false}
      onPress={() => handleDateSelect(item)}
      textColor={textColor}
    />
  ), [selectedDate, handleDateSelect, textColor]);

  const renderAppointmentItem = useCallback(({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      onPress={handleAppointmentPress}
    />
  ), [handleAppointmentPress]);

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
          renderItem={renderDateItem}
          keyExtractor={(item) => item.toISOString()}
        />
      </View>

      {selectedDate && (
        <View style={styles.appointmentsContainer}>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Turnos del día:
          </Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          ) : appointments.length > 0 ? (
            <FlatList
              data={appointments}
              renderItem={renderAppointmentItem}
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

export default DoctorAppointmentsScreen;


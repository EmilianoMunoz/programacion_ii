import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format, addDays, startOfWeek, isSameDay, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import * as SecureStore from 'expo-secure-store';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import createStyles from '@/styles/screens/appointments/editAppointment.styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import apiClient from '@/services/apiClient';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  time: string;
  doctorId: string;
  patientId: string;
}

interface ApiError {
  message: string;
  status: number;
}

const EditAppointmentScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const DOCTOR_ID = 24;

  const backgroundColor = useThemeColor({}, 'background');
  const titleColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'itemBorderColor');
  const textColor = useThemeColor({}, 'itemTextColor');

  const styles = createStyles({
    backgroundColor,
    buttonBackground,
    buttonTextColor,
    titleColor,
    inputBackground: inputBackgroundColor,
    borderColor,
    textColor,
  });

  const generateCurrentWeek = (baseDate: Date): Date[] => {
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
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUserId = await SecureStore.getItemAsync('userId');
      const storedRole = await SecureStore.getItemAsync('role');

      if (!storedToken || !storedUserId || !storedRole) {
        setError('No se encontraron las credenciales necesarias');
        return;
      }

      setToken(storedToken);
      setUserId(storedUserId);
      setRole(storedRole);

      try {
        const response = await apiClient.get<Appointment>(
          `/appointments/appointment/${storedUserId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` }
          }
        );

        if (response.data) {
          setCurrentAppointment(response.data);
          const appointmentDate = parseISO(response.data.time);
          setSelectedDate(appointmentDate);
          setCurrentWeek(generateCurrentWeek(appointmentDate));
          await fetchTimeSlots(appointmentDate);
        }
      } catch (error: unknown) {
        if (error instanceof Error && 'response' in error) {
          const apiError = error as unknown as ApiError;
          if (apiError.status === 404) {
            Alert.alert(
              'Información',
              'No tenés ningún turno programado',
              [{ text: 'OK', onPress: () => router.back() }]
            );
            return;
          }
          console.error('Error al obtener el turno:', apiError.message);
          setError('No se pudo cargar la información del turno');
        } else {
          console.error('Error inesperado:', error);
          setError('Ocurrió un error inesperado');
        }
      }
    } catch (error) {
      console.error('Error en la inicialización:', error);
      setError('Ocurrió un error inesperado');
    } finally {
      setInitializing(false);
    }
  };

  const fetchTimeSlots = async (date: Date) => {
    if (!token || !currentAppointment) return;

    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await apiClient.get<string[]>(`/appointments/available-times`, {
        params: {
          date: formattedDate,
          excludeAppointmentId: currentAppointment.id,
          doctorId: currentAppointment.doctorId
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      const allTimeSlots = generateTimeSlots();
      const availableTimes = new Set(response.data);

      if (currentAppointment && isSameDay(date, parseISO(currentAppointment.time))) {
        const currentTime = format(parseISO(currentAppointment.time), 'HH:mm');
        availableTimes.add(currentTime);
      }

      const slots = allTimeSlots.map(time => ({
        time,
        isAvailable: availableTimes.has(time)
      }));

      setTimeSlots(slots);
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      Alert.alert('Error', 'No se pudieron obtener los horarios disponibles');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchTimeSlots(date);
  };

  const handleTimeSelect = async (timeSlot: TimeSlot) => {
    if (!selectedDate || !currentAppointment || !timeSlot.isAvailable || !userId || !token || !role) {
      Alert.alert('Error', 'Faltan datos necesarios para actualizar el turno');
      return;
    }

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = timeSlot.time.split(':');
      appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const requestBody = {
        time: appointmentDateTime.toISOString(),
        doctorId: DOCTOR_ID,
      };

      await apiClient.put(
        `/appointments/${currentAppointment.id}`,
        requestBody,
        {
          params: {
            userId: userId,
            role: role 
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert(
        'Éxito',
        'Turno actualizado exitosamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al actualizar el turno:', error);
      Alert.alert('Error', 'No se pudo actualizar el turno. Por favor, intentá más tarde.');
    }
  };

  const changeWeek = (increment: number) => {
    const newWeek = currentWeek.map(date => addDays(date, increment));
    if (increment < 0 && isPast(newWeek[0])) return;
    setCurrentWeek(newWeek);
    setSelectedDate(null);
    setTimeSlots([]); 
  };

  if (initializing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="indigo" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Modificar Turno",
          headerStyle: { backgroundColor: backgroundColor },
          headerTintColor: textColor,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <View style={styles.container}>
        {currentAppointment && (
          <View style={styles.currentAppointmentInfo}>
            <MaterialIcons name="info" size={24} color="indigo" />
            <Text style={styles.currentAppointmentText}>
              Turno actual: {format(parseISO(currentAppointment.time), 'EEEE dd MMMM, HH:mm', { locale: es })}
            </Text>
          </View>
        )}

        <View style={styles.dateSection}>
          <Text style={styles.subtitle}>Seleccione una nueva fecha:</Text>
          <FlatList
            data={currentWeek.filter(item => item !== null)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dateButton, isSameDay(item, selectedDate!) && styles.selectedDateButton]}
                onPress={() => handleDateSelect(item)}
              >
                <Text style={styles.dateText}>{format(item, 'EEEE dd', { locale: es })}</Text>
              </TouchableOpacity>
            )}
            horizontal
            keyExtractor={(_, index) => index.toString()}
          />
          
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={() => changeWeek(-1)} style={styles.navigationButton}>
              <Text style={styles.navigationButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeWeek(1)} style={styles.navigationButton}>
              <Text style={styles.navigationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timeSlotsContainer}>
          <Text style={styles.subtitle}>Horarios disponibles:</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="indigo" />
          ) : (
            <FlatList
              data={timeSlots}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.timeSlotButton, item.isAvailable ? styles.availableSlot : styles.unavailableSlot]}
                  onPress={() => handleTimeSelect(item)}
                  disabled={!item.isAvailable}
                >
                  <Text style={styles.timeSlotText}>{item.time}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.time}
            />
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </>
  );
};

export default EditAppointmentScreen;

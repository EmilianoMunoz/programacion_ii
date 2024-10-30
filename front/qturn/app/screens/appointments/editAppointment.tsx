import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format, addDays, startOfWeek, isSameDay, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import createStyles from '@/styles/screens/appointments/editAppointment.styles';
import { useThemeColor } from '@/hooks/useThemeColor';

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

  const API_URL = 'http://192.168.18.166:8080';

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
  
      if (!storedToken || !storedUserId) {
        setError('No se encontraron las credenciales necesarias');
        return;
      }
  
      setToken(storedToken);
      setUserId(storedUserId);
  
      try {
        const response = await axios.get<Appointment>(
          `${API_URL}/appointments/appointment/${storedUserId}`,
          {
            headers: { 
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.data) {
          setCurrentAppointment(response.data);
          const appointmentDate = parseISO(response.data.time);
          setSelectedDate(appointmentDate);
          setCurrentWeek(generateCurrentWeek(appointmentDate));
          await fetchTimeSlots(appointmentDate);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        
        if (axiosError.response?.status === 404) {
          Alert.alert(
            'Información',
            'No tenés ningún turno programado',
            [
              { 
                text: 'OK', 
                onPress: () => router.back() 
              }
            ]
          );
          return;
        }
        
        console.error('Error al obtener el turno:', axiosError.response?.data || axiosError.message);
        setError('No se pudo cargar la información del turno');
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
      const response = await axios.get<string[]>(`${API_URL}/appointments/available-times`, {
        params: { 
          date: formattedDate,
          excludeAppointmentId: currentAppointment.id,
          doctorId: currentAppointment.doctorId
        },
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
      const axiosError = error as AxiosError<ApiError>;
      console.error('Error al obtener horarios:', axiosError.response?.data || axiosError.message);
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
    if (!selectedDate || !currentAppointment || !timeSlot.isAvailable || !userId || !token) {
      Alert.alert('Error', 'Faltan datos necesarios para actualizar el turno');
      return;
    }

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = timeSlot.time.split(':');
      appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const requestBody = {
        time: appointmentDateTime.toISOString()
      };

      await axios.put(
        `${API_URL}/appointments/${currentAppointment.id}`,
        requestBody,
        {
          params: {
            userId: userId,
            role: 'PATIENT'
          },
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      Alert.alert(
        'Éxito', 
        'Turno actualizado exitosamente',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error completo:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status
      });
      
      const errorMessage = typeof axiosError.response?.data === 'string' 
        ? axiosError.response.data 
        : 'No se pudo actualizar el turno. Por favor, intentá más tarde.';
      
      Alert.alert('Error', errorMessage);
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
        {currentAppointment && (
          <View style={styles.currentAppointmentInfo}>
            <MaterialIcons name="info" size={24} color="indigo" />
            <Text style={styles.currentAppointmentText}>
              Turno actual: {format(parseISO(currentAppointment.time), 'EEEE dd MMMM, HH:mm', { locale: es })}
            </Text>
          </View>
        )}

        <View style={styles.dateSection}>
          <Text style={styles.subtitle}>
            Seleccione una nueva fecha:
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
                  color={selectedDate && isSameDay(selectedDate, item) ? 'indigo' : '#000'} 
                />
                <Text style={[
                  styles.dateText,
                  selectedDate && isSameDay(selectedDate, item) ? { color: 'indigo' } : null
                ]}>
                  {format(item, 'eeee, dd MMMM', { locale: es })}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toISOString()}
          />
        </View>

        {selectedDate && (
          <View style={styles.timesContainer}>
            <Text style={styles.subtitle}>
              Horarios disponibles:
            </Text>
            
            {isLoading ? (
              <ActivityIndicator size="large" color="indigo" />
            ) : (
              <FlatList
                data={timeSlots}
                renderItem={({ item: timeSlot }) => {
                  const isPastTime = selectedDate && 
                    isPast(new Date(selectedDate?.toISOString().split('T')[0] + 'T' + timeSlot.time));

                  const isCurrentTime = currentAppointment && 
                    format(parseISO(currentAppointment.time), 'HH:mm') === timeSlot.time;

                  const isAvailableAndCurrent = timeSlot.isAvailable || isCurrentTime;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.timeButton,
                        isAvailableAndCurrent && !isPastTime ? styles.availableTimeButton : styles.unavailableTimeButton
                      ]}
                      disabled={!isAvailableAndCurrent || isPastTime}
                      onPress={() => handleTimeSelect(timeSlot)}
                    >
                      <Text style={[
                        styles.timeText,
                        isAvailableAndCurrent ? styles.availableTimeText : styles.unavailableTimeText
                      ]}>
                        {timeSlot.time}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.time}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default EditAppointmentScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { format, addDays, addMinutes, startOfWeek, parse, isPast } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/hooks/useThemeColor';
import createStyles from '@/styles/screens/appointments/newAppointment.styles';
import { DateSelector } from '@/components/appointments/dateSelector';
import { TimeSelector } from '@/components/appointments/timeSelector';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface WorkSchedule {
  scheduleId: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

const NewAppointmentScreen = () => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingAppointment, setHasExistingAppointment] = useState(false);
  const [checkingAppointment, setCheckingAppointment] = useState(true);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>([]);
  const [doctorId] = useState(24);

  const backgroundColor = useThemeColor({}, 'background');
  const titleColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const textColor = useThemeColor({}, 'itemTextColor');
  const borderColor = useThemeColor({}, 'itemBorderColor');
  const warningText = useThemeColor({}, 'warningText');
  const primaryColor = useThemeColor({}, 'primaryColor');

  const styles = createStyles({
    backgroundColor,
    buttonBackground,
    buttonTextColor,
    titleColor,
    inputBackground: inputBackgroundColor,
    textColor,
    borderColor,
    warningText,
    primaryColor,
  });

  const API_URL = 'http://192.168.18.166:8080';

  const generateCurrentWeek = (baseDate: Date) => {
    const start = startOfWeek(baseDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  useEffect(() => {
    const today = new Date();
    setCurrentWeek(generateCurrentWeek(today));
    initializeScreen();
  }, []);

  const fetchDoctorSchedule = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get(
        `${API_URL}/work-schedules/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setWorkSchedule(response.data);
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      Alert.alert('Error', 'No se pudo obtener el horario del doctor');
    }
  };

  const initializeScreen = async () => {
    setCheckingAppointment(true);
    try {
      const id = await SecureStore.getItemAsync('userId');
      if (!id) throw new Error('No se pudo obtener el ID del paciente');
      
      const patId = parseInt(id);
      setPatientId(patId);
      
      await fetchDoctorSchedule();
      
      await checkExistingAppointment(patId);
      
    } catch (error) {
      console.error('Error durante la inicialización:', error);
      Alert.alert(
        "Error",
        "Hubo un problema al inicializar la pantalla. Por favor, intentá más tarde."
      );
    } finally {
      setCheckingAppointment(false);
    }
  };

  const checkExistingAppointment = async (patId: number) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No se encontró el token');

      const response = await axios.get(
        `${API_URL}/appointments/appointment/${patId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setHasExistingAppointment(!!response.data);
      if (response.data) {
        Alert.alert(
          "Turno Existente",
          "Ya tienes un turno programado. Solo puedes tener un turno activo a la vez."
        );
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasExistingAppointment(false);
      } else {
        console.error('Error al verificar turnos existentes:', error);
        Alert.alert(
          "Error",
          "Hubo un problema al verificar tus turnos existentes. Por favor, intentá más tarde."
        );
      }
    }
  };

  const isDateAvailable = (date: Date): boolean => {
    if (!workSchedule || workSchedule.length === 0) {
      return false;
    }

    const dayOfWeek = date.getDay() || 7;
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const isAvailable = workSchedule.some(schedule => 
      schedule.dayOfWeek === dayOfWeek && schedule.isActive === true
    );

    return isAvailable;
  };

  const generateTimeSlotsForDate = (date: Date): string[] => {
    const dayOfWeek = date.getDay() || 7;
    const schedule = workSchedule.find(s => s.dayOfWeek === dayOfWeek && s.isActive === true);
    
    if (!schedule) return [];

    const slots: string[] = [];
    const startTimeStr = schedule.startTime.slice(0, 5);
    const endTimeStr = schedule.endTime.slice(0, 5);
    
    const startTime = parse(startTimeStr, 'HH:mm', date);
    const endTime = parse(endTimeStr, 'HH:mm', date);
    let currentTime = startTime;

    while (currentTime < endTime) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, schedule.slotDuration);
    }

    return slots;
  };

  const fetchTimeSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      if (!isDateAvailable(date)) {
        setTimeSlots([]);
        return;
      }

      const response = await axios.get(`${API_URL}/appointments/available-times`, {
        params: { date: formattedDate, doctorId }
      });
      
      const availableTimes = new Set(response.data);
      const possibleSlots = generateTimeSlotsForDate(date);
      
      const slots = possibleSlots.map(time => ({
        time,
        isAvailable: availableTimes.has(time)
      }));
      
      setTimeSlots(slots);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener los horarios disponibles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (hasExistingAppointment) {
      Alert.alert(
        "Acción no permitida",
        "Ya tienes un turno activo. Cancelá tu turno actual para poder solicitar uno nuevo."
      );
      return;
    }

    if (!isDateAvailable(date)) {
      Alert.alert(
        "Fecha no disponible",
        "El doctor no atiende en esta fecha."
      );
      return;
    }

    setSelectedDate(date);
    fetchTimeSlots(date);
  };

  const handleTimeSelect = async (timeSlot: TimeSlot) => {
    if (!selectedDate || patientId === null || !timeSlot.isAvailable || hasExistingAppointment) return;
    
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = timeSlot.time.split(':');
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    try {
      await axios.post(`${API_URL}/appointments`, {
        doctorId,
        patientId,
        time: appointmentDateTime.toISOString()
      });
      
      Alert.alert('Éxito', 'Turno creado exitosamente');
      router.push('/home');
    } catch (error: any) {
      const errorMessage = error.response?.data || 'No se pudo crear el turno';
      Alert.alert('Error', errorMessage);
    }
  };

  const changeWeek = (increment: number) => {
    if (hasExistingAppointment) {
      Alert.alert(
        "Acción no permitida",
        "Ya tienes un turno activo. Cancelá tu turno actual para poder solicitar uno nuevo."
      );
      return;
    }
    
    const newWeek = currentWeek.map(date => addDays(date, increment));
    if (increment < 0 && isPast(newWeek[0])) return;
    setCurrentWeek(newWeek);
    setSelectedDate(null);
    setTimeSlots([]);
  };

  if (checkingAppointment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Nuevo Turno",
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />

      <View style={styles.container}>
    
        {hasExistingAppointment ? (
          <View style={styles.warningCard}>
            <MaterialIcons name="warning" size={24} color="#D97706" />
            <Text style={styles.warningText}>
              Ya tienes un turno activo. Debes cancelar tu turno actual antes de solicitar uno nuevo.
            </Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {selectedDate ? (
              <View style={styles.dateSelectionContainer}>
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={() => setSelectedDate(null)}
                >
                  <MaterialIcons name="arrow-back" size={24} />
                  <Text style={styles.backButtonText}>
                    Elegir nueva fecha
                  </Text>
                </TouchableOpacity>
                <TimeSelector
                  selectedDate={selectedDate}
                  timeSlots={timeSlots}
                  isLoading={isLoading}
                  onTimeSelect={handleTimeSelect}
                />
              </View>
            ) : (
              <DateSelector
                currentWeek={currentWeek}
                selectedDate={selectedDate}
                hasExistingAppointment={hasExistingAppointment}
                isDateAvailable={isDateAvailable}
                onDateSelect={handleDateSelect}
                onWeekChange={changeWeek}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default NewAppointmentScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format, addDays, startOfWeek, isSameDay, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  time: string;
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

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = 'indigo';

  const API_URL = 'http://192.168.18.166:8080';

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
      if (!id) throw new Error('No se pudo obtener el ID del paciente');
      
      const patId = parseInt(id);
      setPatientId(patId);
      
      // Verificar si el paciente ya tiene un turno
      const token = await SecureStore.getItemAsync('token');
      try {
        const response = await axios.get(
          `${API_URL}/appointments/appointment/${patId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data) {
          setHasExistingAppointment(true);
          Alert.alert(
            "Turno Existente",
            "Ya tienes un turno programado. Solo puedes tener un turno activo a la vez."
          );
        }
      } catch (error: any) {
        // Si el error es 404, significa que no tiene turnos (esto es esperado)
        if (error.response?.status === 404) {
          setHasExistingAppointment(false);
        } else {
          // Si es otro tipo de error, lo manejamos
          console.error('Error al verificar turnos existentes:', error);
          Alert.alert(
            "Error",
            "Hubo un problema al verificar tus turnos existentes. Por favor, intentá más tarde."
          );
        }
      }
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

  const fetchTimeSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axios.get(`${API_URL}/appointments/available-times`, {
        params: { date: formattedDate }
      });
      
      const allTimeSlots = generateTimeSlots();
      const availableTimes = new Set(response.data);
      
      const slots = allTimeSlots.map(time => ({
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

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    if (hasExistingAppointment) {
      Alert.alert(
        "Acción no permitida",
        "Ya tienes un turno activo. Cancelá tu turno actual para poder solicitar uno nuevo."
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
        doctorId: 24,
        patientId: patientId,
        time: appointmentDateTime.toISOString()
      });
      
      Alert.alert('Éxito', 'Turno creado exitosamente');
      router.back();
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
      <View style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Solicitar nuevo turno
      </Text>

      {hasExistingAppointment ? (
        <View style={styles.warningCard}>
          <MaterialIcons name="warning" size={24} color="#D97706" />
          <Text style={styles.warningText}>
            Ya tienes un turno activo. Debes cancelar tu turno actual antes de solicitar uno nuevo.
          </Text>
        </View>
      ) : (
        <>
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
            <View style={styles.timesContainer}>
              <Text style={[styles.subtitle, { color: textColor }]}>
                Horarios disponibles:
              </Text>
              
              {isLoading ? (
                <ActivityIndicator size="large" color={primaryColor} />
              ) : (
                <FlatList
                  data={timeSlots}
                  renderItem={({ item: timeSlot }) => {
                    const isPastTime = selectedDate && 
                      isPast(new Date(selectedDate?.toISOString().split('T')[0] + 'T' + timeSlot.time));

                    return (
                      <TouchableOpacity
                        style={[
                          styles.timeButton,
                          timeSlot.isAvailable && !isPastTime && styles.availableTime,
                          isPastTime && styles.pastTime
                        ]}
                        onPress={() => timeSlot.isAvailable && !isPastTime && handleTimeSelect(timeSlot)}
                        disabled={!timeSlot.isAvailable || isPastTime}
                      >
                        <MaterialIcons 
                          name="access-time" 
                          size={20} 
                          color={timeSlot.isAvailable && !isPastTime ? 'white' : '#666'} 
                        />
                        <Text style={[
                          styles.timeText,
                          { color: timeSlot.isAvailable && !isPastTime ? 'white' : '#666' }
                        ]}>
                          {timeSlot.time}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item) => item.time}
                  numColumns={2}
                  columnWrapperStyle={styles.timeButtonsRow}
                />
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
        </>
      )}
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
  timesContainer: {
    flex: 1,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    gap: 8,
  },
  availableTime: {
    backgroundColor: 'indigo',
  },
  pastTime: {
    opacity: 0.5,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeButtonsRow: {
    justifyContent: 'space-between',
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    gap: 12,
  },
  warningText: {
    flex: 1,
    color: '#92400E',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default NewAppointmentScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import apiClient from '@/services/apiClient';
import * as SecureStore from 'expo-secure-store';
import styles from '@/styles/screens/doctors/doctorSchedule.styles';

const WEEKDAYS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' }
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

const appointmentIdsByDayOfWeek = {
  1: 7, 
  2: 10,
  3: 8,
  4: 9,
  5: 6
} as const;

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

const DoctorScheduleScreen = () => {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<{ [key: number]: DaySchedule }>({});

  useEffect(() => {
    const initialSchedules: { [key: number]: DaySchedule } = {};
    WEEKDAYS.forEach(day => {
      initialSchedules[day.id] = {
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30
      };
    });
    setSchedules(initialSchedules);
  }, []);

  const fetchDoctorData = async () => {
    try {
      const id = await SecureStore.getItemAsync('doctor_id');
      const token = await SecureStore.getItemAsync('token');
      
      if (!id || !token) {
        Alert.alert('Error', 'Información de autenticación incompleta. Por favor, inicie sesión nuevamente.');
        return;
      }

      setDoctorId(id);
    } catch (error) {
      console.error('Error al recuperar datos del doctor:', error);
      Alert.alert('Error', 'No se pudo recuperar la información del doctor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const toggleDayEnabled = (dayId: number) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId].enabled
      }
    }));
  };

  const updateDaySchedule = (dayId: number, field: keyof DaySchedule, value: string | number) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
  };

  const saveSchedule = async () => {
    if (!doctorId) {
      Alert.alert('Error', 'No se encontró ID del doctor');
      return;
    }

    setIsSaving(true);
    
    try {
      const enabledDays = Object.entries(schedules)
        .filter(([_, schedule]) => schedule.enabled)
        .map(([dayId, schedule]) => ({
          appointmentId: appointmentIdsByDayOfWeek[parseInt(dayId, 10) as keyof typeof appointmentIdsByDayOfWeek],
          doctorId: parseInt(doctorId, 10),
          dayOfWeek: parseInt(dayId, 10),
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          slotDuration: schedule.slotDuration
        }));

      if (enabledDays.length === 0) {
        Alert.alert('Error', 'Por favor habilite al menos un día');
        setIsSaving(false);
        return;
      }

      await Promise.all(enabledDays.map(schedule => 
        apiClient.put(`/work-schedules/${schedule.appointmentId}`, schedule)
      ));

      Alert.alert('Éxito', 'Horarios guardados con éxito');
    } catch (error: any) {
      console.error('Error al guardar horarios:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar los horarios';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Horarios Semanales</Text>
        
        {WEEKDAYS.map((day) => (
          <View key={day.id} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <TouchableOpacity
                style={[
                  styles.dayToggle,
                  schedules[day.id]?.enabled && styles.dayToggleEnabled
                ]}
                onPress={() => toggleDayEnabled(day.id)}
              >
                <Text style={[
                  styles.dayToggleText,
                  schedules[day.id]?.enabled && styles.dayToggleTextEnabled
                ]}>
                  {day.name}
                </Text>
              </TouchableOpacity>
            </View>

            {schedules[day.id]?.enabled && (
              <View style={styles.daySchedule}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeSelection}>
                    <Text style={styles.timeLabel}>Inicio:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {TIME_SLOTS.map((time) => (
                        <TouchableOpacity
                          key={`start-${time}`}
                          style={[
                            styles.timeButton,
                            schedules[day.id]?.startTime === time && styles.timeButtonSelected
                          ]}
                          onPress={() => updateDaySchedule(day.id, 'startTime', time)}
                        >
                          <Text style={[
                            styles.timeButtonText,
                            schedules[day.id]?.startTime === time && styles.timeButtonTextSelected
                          ]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.timeSelection}>
                    <Text style={styles.timeLabel}>Fin:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {TIME_SLOTS.map((time) => (
                        <TouchableOpacity
                          key={`end-${time}`}
                          style={[
                            styles.timeButton,
                            schedules[day.id]?.endTime === time && styles.timeButtonSelected
                          ]}
                          onPress={() => updateDaySchedule(day.id, 'endTime', time)}
                        >
                          <Text style={[
                            styles.timeButtonText,
                            schedules[day.id]?.endTime === time && styles.timeButtonTextSelected
                          ]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View style={styles.durationContainer}>
                  <Text style={styles.timeLabel}>Duración de la consulta:</Text>
                  <View style={styles.durationButtons}>
                    {[15, 20, 30, 45, 60].map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={[
                          styles.durationButton,
                          schedules[day.id]?.slotDuration === duration && styles.durationButtonSelected
                        ]}
                        onPress={() => updateDaySchedule(day.id, 'slotDuration', duration)}
                      >
                        <Text style={[
                          styles.durationButtonText,
                          schedules[day.id]?.slotDuration === duration && styles.durationButtonTextSelected
                        ]}>
                          {duration} min
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={saveSchedule}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Guardando...' : 'Guardar Horarios'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DoctorScheduleScreen;

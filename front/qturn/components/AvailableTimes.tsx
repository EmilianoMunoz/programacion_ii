// app/available-times.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { format } from 'date-fns';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AvailableTimesScreen = () => {
  const router = useRouter();
  const { date, description } = useLocalSearchParams();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await axios.get('http://192.168.18.166:8080/appointments/available-times', {
          params: { date: format(new Date(date), 'yyyy-MM-dd') },
        });
        setAvailableTimes(response.data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron obtener los horarios disponibles.');
      }
    };

    fetchAvailableTimes();
  }, [date]);

  const handleTimeSelect = async (time: string) => {
    const appointmentDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    try {
      const appointmentDto = { appointmentDateTime, description }; // Incluir descripción en el DTO
      await axios.post('http://192.168.18.166:8080/appointments', appointmentDto);
      Alert.alert('Éxito', 'Cita creada con éxito.');
      router.back(); // Regresar a la pantalla anterior
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cita.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Horarios disponibles para {format(new Date(date), 'eeee, dd MMMM')}:</Text>
      <FlatList
        data={availableTimes}
        renderItem={({ item }) => (
          <Button
            key={item}
            title={item}
            onPress={() => handleTimeSelect(item)}
            color="indigo"
          />
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Aquí puedes agregar estilos personalizados
});

export default AvailableTimesScreen;

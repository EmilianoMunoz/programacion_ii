import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { isPast } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import styles from '@/styles/screens/appointments/newAppointment.styles';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface TimeSelectorProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  isLoading: boolean;
  onTimeSelect: (timeSlot: TimeSlot) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedDate,
  timeSlots,
  isLoading,
  onTimeSelect
}) => {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = 'indigo';

  return (
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
                onPress={() => timeSlot.isAvailable && !isPastTime && onTimeSelect(timeSlot)}
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
  );
};

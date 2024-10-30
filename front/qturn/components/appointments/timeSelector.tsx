import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { isPast } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import createStyles from '@/styles/components/appointments/timeSelector.Styles';

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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  
  const backgroundColor = useThemeColor({}, 'background');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const titleColor = useThemeColor({}, 'titleColor');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const primaryColor = useThemeColor({}, 'primaryColor');
  const textColor = useThemeColor({}, 'itemTextColor');

  const styles = createStyles({
    backgroundColor,
    buttonBackground,
    buttonTextColor,
    titleColor,
    inputBackground,
    buttonColor,
    primaryColor,
    textColor,
  });

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    onTimeSelect(timeSlot);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loadingText}>
          Cargando horarios disponibles...
        </Text>
      </View>
    );
  }

  if (!timeSlots || timeSlots.length === 0) {
    return (
      <View style={styles.timesContainer}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Horarios disponibles
          </Text>
          <View style={styles.subtitleBar} />
        </View>
        <View style={styles.noTimesContainer}>
          <MaterialIcons 
            name="event-busy" 
            size={48} 
            color={textColor}
            style={styles.noTimesIcon}
          />
          <Text style={styles.noTimesText}>
            No hay horarios disponibles{'\n'}para esta fecha
          </Text>
        </View>
      </View>
    );
  }

  const renderTimeButton = ({ item: timeSlot }: { item: TimeSlot }) => {
    const isPastTime = selectedDate && 
      isPast(new Date(selectedDate?.toISOString().split('T')[0] + 'T' + timeSlot.time));
    
    const isAvailable = timeSlot.isAvailable && !isPastTime;
    const isSelected = selectedTimeSlot?.time === timeSlot.time;

    return (
      <TouchableOpacity
        style={[
          styles.timeButton,
          isAvailable && styles.availableTime,
          isPastTime && styles.pastTime,
          isSelected && styles.selectedTime,
        ]}
        onPress={() => isAvailable && handleTimeSelect(timeSlot)}
        disabled={!isAvailable}
      >
        <View style={styles.timeContent}>
          <MaterialIcons 
            name={isSelected ? "check-circle" : "access-time"} 
            size={22} 
            color={isAvailable ? 'white' : '#666'} 
          />
          <Text style={[
            styles.timeText,
            isAvailable && styles.timeTextAvailable
          ]}>
            {timeSlot.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.timesContainer}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Horarios disponibles
        </Text>
        <View style={styles.subtitleBar} />
      </View>
      
      <FlatList
        style={styles.timeButtonsContainer}
        data={timeSlots}
        renderItem={renderTimeButton}
        keyExtractor={(item) => item.time}
        numColumns={2}
        columnWrapperStyle={styles.timeButtonsRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TimeSelector;
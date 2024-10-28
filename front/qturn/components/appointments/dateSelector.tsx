import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { format, isPast, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import styles from '@/styles/screens/appointments/newAppointment.styles';

interface DateSelectorProps {
  currentWeek: Date[];
  selectedDate: Date | null;
  hasExistingAppointment: boolean;
  isDateAvailable: (date: Date) => boolean;
  onDateSelect: (date: Date) => void;
  onWeekChange: (increment: number) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  currentWeek,
  selectedDate,
  hasExistingAppointment,
  isDateAvailable,
  onDateSelect,
  onWeekChange
}) => {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = 'indigo';

  const renderDateButton = ({ item }: { item: Date }) => {
    const isAvailable = isDateAvailable(item);
    const isSelected = selectedDate && isSameDay(selectedDate, item);

    return (
      <TouchableOpacity
        style={[
          styles.dateButton,
          isSelected && styles.selectedButton,
          !isAvailable && styles.disabledButton
        ]}
        onPress={() => onDateSelect(item)}
        disabled={!isAvailable || isPast(item)}
      >
        <MaterialIcons 
          name="event" 
          size={24} 
          color={isSelected ? primaryColor : isAvailable ? textColor : '#666'} 
        />
        <Text style={[
          styles.dateText,
          { color: isSelected ? primaryColor : isAvailable ? textColor : '#666' }
        ]}>
          {format(item, 'eeee, dd MMMM', { locale: es })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.dateSection}>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Seleccione una fecha:
        </Text>
        
        <FlatList
          data={currentWeek}
          renderItem={renderDateButton}
          keyExtractor={(item) => item.toISOString()}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.weekButton, isPast(currentWeek[0]) && styles.disabledButton]}
          onPress={() => onWeekChange(-7)}
          disabled={isPast(currentWeek[0])}
        >
          <MaterialIcons name="chevron-left" size={24} color="white" />
          <Text style={styles.weekButtonText}>Semana Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.weekButton}
          onPress={() => onWeekChange(7)}
        >
          <Text style={styles.weekButtonText}>Semana Siguiente</Text>
          <MaterialIcons name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};
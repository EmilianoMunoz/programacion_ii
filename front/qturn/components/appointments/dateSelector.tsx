import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated } from 'react-native';
import { format, isPast, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import createStyles from '@/styles/components/appointments/dateSelector.Styles';

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

  const renderDateButton = ({ item }: { item: Date }) => {
    const isAvailable = isDateAvailable(item);
    const isSelected = selectedDate && isSameDay(selectedDate, item);

    return (
      <TouchableOpacity
        style={[
          styles.dateButton,
          isSelected && styles.selectedButton,
          !isAvailable && styles.disabledButton,
        ]}
        onPress={() => onDateSelect(item)}
        disabled={!isAvailable || isPast(item)}
      >
        <View style={styles.dateContent}>
          <MaterialIcons 
            name={isSelected ? "event-available" : "event"} 
            size={28} 
            color={isSelected ? primaryColor : isAvailable ? textColor : '#666'} 
          />
          <View style={styles.dateInfo}>
            <Text style={[
              styles.dayName,
              { color: isSelected ? primaryColor : isAvailable ? textColor : '#666' }
            ]}>
              {format(item, 'eeee', { locale: es })}
            </Text>
            <Text style={[
              styles.dateText,
              { color: isSelected ? primaryColor : isAvailable ? textColor : '#666' }
            ]}>
              {format(item, 'dd MMMM', { locale: es })}
            </Text>
          </View>
          {isSelected && (
            <MaterialIcons 
              name="check-circle" 
              size={24} 
              color={primaryColor} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.dateSection}>
        
        <FlatList
          data={currentWeek}
          renderItem={renderDateButton}
          keyExtractor={(item) => item.toISOString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.weekButton, isPast(currentWeek[0]) && styles.disabledButton]}
          onPress={() => onWeekChange(-7)}
          disabled={isPast(currentWeek[0])}
        >
          <MaterialIcons name="chevron-left" size={24} color={buttonTextColor} />
          <Text style={styles.weekButtonText}>Semana Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.weekButton}
          onPress={() => onWeekChange(7)}
        >
          <Text style={styles.weekButtonText}>Semana Siguiente</Text>
          <MaterialIcons name="chevron-right" size={24} color={buttonTextColor} />
        </TouchableOpacity>
      </View>
    </>
  );
};
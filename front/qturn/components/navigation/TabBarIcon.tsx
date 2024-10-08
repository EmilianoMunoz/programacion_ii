// components/navigation/TabBarIcon.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { View, StyleSheet } from 'react-native';

type TabBarIconProps = IconProps<ComponentProps<typeof Ionicons>['name']> & {
  focused: boolean;
};

export function TabBarIcon({ focused, style, ...rest }: TabBarIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Ionicons
        size={28}
        style={[{ marginBottom: -3 }, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 10, // Ajusta el radio del borde según tus necesidades
    borderWidth: 2,
    borderColor: 'transparent', // Color del borde por defecto
    padding: 0,
    backgroundColor: 'transparent', // Fondo transparente por defecto
  },
  iconContainerFocused: {
    borderColor: 'transparent', // Color del borde cuando el ícono está seleccionado
    backgroundColor: 'transparent', // Fondo blanco cuando el ícono está seleccionado
  },
});

// components/TestAuth.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/authcontext';

export function TestAuth() {
  const { isAuthenticated } = useAuth();
  
  return (
    <View>
      <Text>Auth State: {isAuthenticated ? 'true' : 'false'}</Text>
    </View>
  );
}
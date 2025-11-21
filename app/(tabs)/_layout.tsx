import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthContext } from '@app/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext as any);
  const role = user?.role;

  const isHR = role === 'HR' || role === 'ADMIN';
  const isAdmin = role === 'ADMIN';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      {isHR && <Tabs.Screen name="teams" options={{ title: 'Teams' }} />}
      {isHR && <Tabs.Screen name="payroll" options={{ title: 'Payroll' }} />}
      <Tabs.Screen name="notes" options={{ title: 'Notes' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {isAdmin && <Tabs.Screen name="admin" options={{ title: 'Admin' }} />}
    </Tabs>
  );
}

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthContext, AuthProvider } from '@app/contexts/AuthContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.tabIconSelected,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { height: 64, paddingBottom: 6 },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            // Keep the login screen reachable but hide the tab bar while on it.
            title: 'Home',
            tabBarLabel: 'Attend',
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
            // Remove the tab button so it doesn't show in the bar
            tabBarButton: () => null,
            // Hide the entire tab bar while this screen is active
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: 'Attendance',
            tabBarLabel: 'Attendance',
            tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: 'Teams',
            tabBarLabel: 'Teams',
            tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="payroll"
          options={{
            title: 'Payroll',
            tabBarLabel: 'Payroll',
            tabBarIcon: ({ color }) => <MaterialIcons name="receipt-long" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
      </Tabs>
      {/* Floating Logout button shown when user is authenticated and not on the login/index screen */}
      <FloatingLogout theme={theme} />
    </AuthProvider>
  );
}

function FloatingLogout({ theme }: { theme: typeof Colors.light }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useContext(AuthContext) as any;

  // Hide on login/index route and when not authenticated
  if (!isAuthenticated) return null;
  if (!pathname || pathname === '/' || pathname === '/index') return null;

  const onPress = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore
    }
    router.replace('/');
  };

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.tint }]} onPress={onPress}>
        <MaterialIcons name="logout" size={18} color="#fff" />
        <Text style={styles.fabText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 78,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

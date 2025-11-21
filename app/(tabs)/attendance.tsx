import api from '@/services/api';
import { AuthContext } from '@app/contexts/AuthContext';
import React, { useContext, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function AttendanceScreen() {
  const { user } = useContext(AuthContext) as any;
  const [status, setStatus] = useState<string>('Not checked in');

  const checkIn = async () => {
    try {
      await api.post('/api/v1/attendance/check-in');
      setStatus('Checked in');
    } catch (e) {
      Alert.alert('Error', 'Could not check in');
    }
  };

  const checkOut = async () => {
    try {
      await api.post('/api/v1/attendance/check-out');
      setStatus('Checked out');
    } catch (e) {
      Alert.alert('Error', 'Could not check out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <Text style={styles.subtitle}>User: {user?.fullName ?? 'Guest'}</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <View style={styles.buttons}>
        <Button title="Check In" onPress={checkIn} />
        <Button title="Check Out" onPress={checkOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  status: { fontSize: 16, marginBottom: 20 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
});

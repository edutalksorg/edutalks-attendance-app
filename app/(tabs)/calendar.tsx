import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/v1/attendance/me');
        setEvents(data || []);
      } catch (e) {
        setEvents([]);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Calendar</Text>
      <FlatList
        data={events}
        keyExtractor={(i, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.date} — {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
});

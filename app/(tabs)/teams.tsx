import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function TeamsScreen() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/v1/teams');
        setTeams(data || []);
      } catch (e) {
        setTeams([]);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams</Text>
      <FlatList
        data={teams}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.members?.length ?? 0} members</Text>
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
  name: { fontWeight: '600' },
  meta: { color: '#666' },
});

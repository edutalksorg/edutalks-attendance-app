import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PayrollScreen() {
  const [payslips, setPayslips] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/v1/payroll/payslips/me');
        setPayslips(data || []);
      } catch (e) {
        setPayslips([]);
      }
    })();
  }, []);

  const download = async (url: string) => {
    // on mobile just open the link (user can save)
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payslips</Text>
      <FlatList
        data={payslips}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.meta}>{item.period}</Text>
            <TouchableOpacity onPress={() => download(item.pdfUrl)}>
              <Text style={styles.link}>Open PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { fontWeight: '600' },
  link: { color: '#3478f6' },
});

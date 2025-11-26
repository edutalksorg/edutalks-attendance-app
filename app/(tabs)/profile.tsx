import { AuthContext } from '@app/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext) as any;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.item}>Name: {user?.fullName ?? '—'}</Text>
      <Text style={styles.item}>Email: {user?.email ?? '—'}</Text>
      <Text style={styles.item}>Role: {user?.role ?? '—'}</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Logout"
          onPress={async () => {
            try {
              await logout();
            } catch (e) {
              // ignore logout errors
            }
            // redirect to login/index page
            router.replace('/');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  item: { fontSize: 16, marginBottom: 8 },
});

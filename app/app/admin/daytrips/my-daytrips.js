import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, FAB } from 'react-native-paper';
import { useSettings } from '../../providers/SettingsProvider';
import api from '../../../services/api';
import { useRouter } from 'expo-router';

export default function MyDaytripsScreen() {
  const [daytrips, setDaytrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appearance, paperTheme } = useSettings();
  const router = useRouter();

  useEffect(() => {
    fetchDaytrips();
  }, []);

  const fetchDaytrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/daytrips/mine');
      setDaytrips(res.data);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar los pasadías');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar este pasadía?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/daytrips/${id}`);
            setDaytrips(daytrips.filter((d) => d.id !== id));
          } catch (e) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Mis Pasadías</Text>
        {daytrips.map((trip) => (
          <Card key={trip.id} style={{ marginBottom: 16 }}>
            <Card.Title title={trip.title} subtitle={`$${trip.price} - ${trip.duration}`} />
            <Card.Content>
              <Text>{trip.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => router.push(`/admin/daytrips/${trip.id}`)}>Editar</Button>
              <Button onPress={() => handleDelete(trip.id)} textColor="red">Eliminar</Button>
            </Card.Actions>
          </Card>
        ))}
        {!daytrips.length && !loading && <Text>No tienes pasadías publicados.</Text>}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/admin/daytrips/create')}
        label="Nuevo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32,
  },
});

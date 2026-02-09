import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import api from '../../../services/api';

export default function AdminDaytripReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/daytrips/reservations');
      console.log('Respuesta reservas admin:', res.data);
      setReservations(res.data || []);
    } catch (e) {
      console.error('Error reservas admin:', e);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/daytrips/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePayment = async (id, paymentStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/daytrips/reservations/${id}/payment`, { paymentStatus });
      fetchReservations();
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el pago');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Reservas de Pasadías</Text>
      {loading ? <Text>Cargando...</Text> : reservations.length === 0 ? <Text>No hay reservas.</Text> : (
        reservations.map(res => (
          <Card key={res.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{res.daytrip?.title || 'Sin título'}</Text>
              <Text style={styles.user}>Usuario: {res.user?.name || res.user?.email || 'Desconocido'}</Text>
              <Text style={styles.price}>Total: {res.totalPrice}</Text>
              <Chip style={[styles.status, { backgroundColor: res.status === 'confirmed' ? '#00C853' : res.status === 'pending' ? '#FF9800' : '#FF4444' }]}>{res.status === 'confirmed' ? 'Confirmada' : res.status === 'pending' ? 'Pendiente' : 'Cancelada'}</Chip>
              <Chip style={[styles.status, { backgroundColor: res.paymentStatus === 'paid' ? '#00C853' : res.paymentStatus === 'pending_payment' ? '#FF9800' : '#FF4444' }]}>{res.paymentStatus === 'paid' ? 'Pagado' : res.paymentStatus === 'pending_payment' ? 'Pendiente de pago' : 'No pagado'}</Chip>
              <View style={styles.actions}>
                <Button mode="outlined" loading={updatingId === res.id} onPress={() => updateStatus(res.id, 'confirmed')}>Confirmar</Button>
                <Button mode="outlined" loading={updatingId === res.id} onPress={() => updateStatus(res.id, 'pending')}>Pendiente</Button>
                <Button mode="outlined" loading={updatingId === res.id} onPress={() => updateStatus(res.id, 'cancelled')}>Cancelar</Button>
                <Button mode="outlined" loading={updatingId === res.id} onPress={() => updatePayment(res.id, 'pending_payment')}>Pendiente de pago</Button>
                <Button mode="outlined" loading={updatingId === res.id} onPress={() => updatePayment(res.id, 'paid')}>Confirmar pago</Button>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#181c1f',
    minHeight: '100%',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#222',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  user: {
    color: '#C3C7D3',
    marginBottom: 4,
  },
  price: {
    color: '#fff',
    marginBottom: 4,
  },
  status: {
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
});

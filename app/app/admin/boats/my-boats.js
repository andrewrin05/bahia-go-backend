import React, { useEffect, useMemo, useState } from 'react';
import { Image } from 'react-native';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useSettings } from '../../providers/SettingsProvider';
import api from '../../../services/api';
import { useRouter } from 'expo-router';

export default function AdminBoatsScreen() {
  const { appearance, paperTheme } = useSettings();
  const styles = useMemo(() => makeStyles(appearance, paperTheme), [appearance, paperTheme]);
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBoats();
  }, []);

  const loadBoats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/boats/admin/all');
      setBoats(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los anuncios');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = (id) => {
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar este anuncio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/boats/${id}`);
            loadBoats();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el anuncio');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.type} />
      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: item.images[0] }}
          style={{ width: '100%', height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          resizeMode="cover"
        />
      )}
      <Card.Content>
        <Text>Ubicación: {item.location}</Text>
        <Text>Capacidad: {item.capacity}</Text>
        <Text>Precio: ${item.pricePerDay}</Text>
        <Text>Publicado: {item.published ? 'Sí' : 'No'}</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Button
            mode="outlined"
            onPress={() => router.push(`/admin/boats/edit/${item.id}`)}
            style={{ marginRight: 12 }}
            textColor="#4DA3FF"
          >
            Editar
          </Button>
          <Button
            mode="contained"
            onPress={() => handleDelete(item.id)}
            buttonColor="#FF5555"
            textColor="#fff"
          >
            Eliminar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis anuncios (admin)</Text>
      <FlatList
        data={boats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay anuncios</Text>}
      />
    </View>
  );
}

const makeStyles = (appearance, paperTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: paperTheme.colors.background,
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      color: paperTheme.colors.primary,
    },
    card: {
      marginBottom: 16,
    },
    empty: {
      textAlign: 'center',
      marginTop: 40,
      color: paperTheme.colors.onSurface,
    },
  });

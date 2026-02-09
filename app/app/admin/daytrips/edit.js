import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Switch, Image } from 'react-native';
import { Text, Button, TextInput, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../../services/api';
import { useSettings } from '../../providers/SettingsProvider';

export default function EditDaytripScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [horaRetorno, setHoraRetorno] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const { appearance, paperTheme } = useSettings();
  const router = useRouter();

  useEffect(() => {
    fetchDaytrip();
  }, [id]);

  const fetchDaytrip = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/daytrips/${id}`);
      const trip = res.data;
      setTitle(trip.title);
      setPrice(String(trip.price));
      setDuration(trip.duration);
      setDescription(trip.description || '');
      setHoraSalida(trip.horaSalida || '');
      setHoraRetorno(trip.horaRetorno || '');
      let imgs = trip.images;
      if (!imgs) imgs = [];
      if (typeof imgs === 'string') {
        try {
          const parsed = JSON.parse(imgs);
          imgs = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          imgs = [];
        }
      }
      setImages(imgs);
      setPublished(!!trip.published);
    } catch (e) {
      Alert.alert('Error', 'No se pudo cargar el pasadía');
      router.back();
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const filteredImages = images.filter((v) => v && v.trim()).slice(0, 10);
    try {
      await api.put(`/daytrips/${id}`, {
        title,
        price: Number(price),
        duration,
        description,
        horaSalida,
        horaRetorno,
        imageUrl: filteredImages[0] || null,
        images: JSON.stringify(filteredImages),
        published,
      });
      Alert.alert('Actualizado', 'Pasadía actualizado', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar');
    }
    setSubmitting(false);
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Habilita acceso a fotos para seleccionar imágenes.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map(asset =>
        asset.base64
          ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri
      );
      setImages(newImages.slice(0, 10));
    }
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Cargando...</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: paperTheme.colors.background, flexGrow: 1 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16, marginTop: 32, textAlign: 'center' }}>Editar Pasadía</Text>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Duración"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
      />
      <TextInput
        label="Hora de salida"
        value={horaSalida}
        onChangeText={setHoraSalida}
        style={styles.input}
        placeholder="Ej: 08:00 am"
      />
      <TextInput
        label="Hora de retorno"
        value={horaRetorno}
        onChangeText={setHoraRetorno}
        style={styles.input}
        placeholder="Ej: 17:00 pm"
      />
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ marginRight: 8 }}>¿Publicar?</Text>
        <Switch value={published} onValueChange={setPublished} />
      </View>
      <Divider style={{ marginVertical: 14 }} />
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>Puedes seleccionar hasta 10 imágenes.</Text>
        <Button mode="outlined" onPress={pickImages} style={{ marginBottom: 4 }}>
          <Text>Elegir imágenes de galería</Text>
        </Button>
        {images.length > 0 && (
          <ScrollView horizontal style={{ marginTop: 8, marginBottom: 0 }} showsHorizontalScrollIndicator={false}>
            {images.map((img, idx) => (
              <View key={idx} style={{ marginRight: 8, alignItems: 'center' }}>
                <View style={{ width: 80, height: 80, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden', backgroundColor: '#eee', marginBottom: 2 }}>
                  {img ? (
                    <Image
                      source={{ uri: img }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
                <Text style={{ fontSize: 12 }}>{`#${idx + 1}`}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Button mode="contained" onPress={handleSubmit} loading={submitting} disabled={submitting} style={{ marginTop: 16 }}>
        <Text>Guardar Cambios</Text>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
});

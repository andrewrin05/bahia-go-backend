// import eliminado porque ya está arriba
import { ScrollView, View, StyleSheet, Alert, Platform, Image } from 'react-native';
// import eliminado porque ya está arriba
// import eliminado porque ya está arriba
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import api from '../../../services/api';
import { uploadImageToCloudinary } from '../../../services/cloudinary';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { useSettings } from '../../../providers/SettingsProvider';
import { Text, TextInput, Button, Switch, HelperText, Divider } from 'react-native-paper';

export default function AdminCreateDaytripScreen() {
  const { appearance, paperTheme } = useSettings();
  const styles = makeStyles(appearance, paperTheme);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [images, setImages] = useState([]);
  const [horaSalida, setHoraSalida] = useState('');
  const [horaRetorno, setHoraRetorno] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!title || !price || !duration) {
      Alert.alert('Faltan campos', 'Completa título, precio y duración.');
      return;
    }
    setLoading(true);
    try {
      // Si tienes lógica de upload a Cloudinary, aquí deberías subir las imágenes y obtener URLs
      // Por simplicidad, se envían como están
      await api.post('/daytrips', {
        title,
        description,
        price: Number(price),
        duration,
        horaSalida,
        horaRetorno,
        published,
        images: JSON.stringify(images),
      });
      Alert.alert('Éxito', 'Pasadía creado y publicado.');
      router.back();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message || 'No se pudo crear el pasadía');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Pasadía</Text>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={3}
      />
      <TextInput
        label="Precio por persona"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="Duración"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
        placeholder="Ej: 8 horas"
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
      <Button mode="outlined" onPress={pickImages} style={{ marginBottom: 10 }}>
        Seleccionar imágenes
      </Button>
      <ScrollView horizontal style={{ marginBottom: 10 }}>
        {images.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={{ width: 80, height: 80, marginRight: 8, borderRadius: 8 }} />
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text>Publicado</Text>
        <Switch value={published} onValueChange={setPublished} style={{ marginLeft: 8 }} />
      </View>
      <Button
        mode="contained"
        style={styles.submit}
        loading={loading}
        onPress={handleSubmit}
        disabled={loading}
      >
        Crear pasadía
      </Button>
    </ScrollView>
  );
}
function makeStyles(mode, paperTheme) {
  const isDark = mode === 'dark';
  const background = paperTheme.colors.background || (isDark ? '#0B0E14' : '#FFFFFF');
  const surface = paperTheme.colors.surface || (isDark ? '#10141D' : '#F8F9FA');
  const primaryText = paperTheme.colors.onSurface || (isDark ? '#F7F8FA' : '#0B0E14');
  const border = paperTheme.colors.outline || (isDark ? '#1C2331' : '#E0E6EF');
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: background,
      flexGrow: 1,
      paddingBottom: 0,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 12,
      color: primaryText,
      textAlign: 'center',
      marginTop: 56,
    },
    input: {
      marginBottom: 14,
      backgroundColor: surface,
      color: primaryText,
      fontSize: 16,
      paddingVertical: 7,
    },
    divider: {
      marginVertical: 14,
      backgroundColor: border,
    },
    submit: {
      marginTop: 10,
      backgroundColor: paperTheme.colors.primary,
      marginBottom: 0,
      height: 44,
      justifyContent: 'center',
    },
    cancel: {
      marginTop: 8,
      marginBottom: 0,
      height: 40,
      justifyContent: 'center',
    },
  });
}

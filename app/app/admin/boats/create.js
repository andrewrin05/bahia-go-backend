import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Image } from 'react-native';
import { useSettings } from '../../../providers/SettingsProvider';
import { Text, TextInput, Button, Switch, HelperText, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import api from '../../../services/api';

export default function AdminCreateBoatScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState('yacht');
  const [location, setLocation] = useState('Cartagena');
  const [capacity, setCapacity] = useState('8');
  const [pricePerDay, setPricePerDay] = useState('500');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { appearance, paperTheme } = useSettings();
  const styles = makeStyles(appearance, paperTheme);

  const onSubmit = async () => {
    if (!name.trim() || !type.trim() || !location.trim()) {
      Alert.alert('Faltan datos', 'Nombre, tipo y ubicación son obligatorios');
      return;
    }
    const priceNumber = parseFloat(pricePerDay) || 0;
    const capacityNumber = parseInt(capacity, 10) || 0;
    const filteredImages = images.filter((v) => v && v.trim()).slice(0, 10);

    setSubmitting(true);
    try {
      await api.post('/boats', {
        name,
        type,
        location,
        capacity: capacityNumber,
        price: priceNumber,
        pricePerDay: priceNumber,
        description,
        imageUrl: filteredImages[0] || null,
        images: filteredImages,
        published,
      });
      Alert.alert('Guardado', 'Embarcación creada', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.warn('Error creando boat', error?.response?.data || error?.message);
      const msg = error?.response?.data?.message || 'No se pudo crear (¿tienes rol admin?)';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin: Crear Embarcación</Text>
      <HelperText type="info">Solo usuarios ADMIN pueden guardar.</HelperText>
      <TextInput label="Nombre" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
      <TextInput label="Tipo (yacht, speedboat, jetski, etc.)" value={type} onChangeText={setType} style={styles.input} mode="outlined" />
      <TextInput label="Ubicación" value={location} onChangeText={setLocation} style={styles.input} mode="outlined" />
      <TextInput label="Capacidad" value={capacity} onChangeText={setCapacity} keyboardType="numeric" style={styles.input} mode="outlined" />
      <TextInput label="Precio por día" value={pricePerDay} onChangeText={setPricePerDay} keyboardType="numeric" style={styles.input} mode="outlined" />
      <TextInput label="Descripción" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />
      <Divider style={styles.divider} />
      <View style={{ marginBottom: 8 }}>
        <Text style={{ marginBottom: 4 }}>
          Puedes seleccionar hasta 10 imágenes.
        </Text>
        <Button mode="outlined" onPress={pickImages} style={styles.pickButton}>
          Elegir imágenes de galería
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
                <Text style={{ fontSize: 12 }}>#{idx + 1}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.switchLabel}>Publicar</Text>
        <Switch value={published} onValueChange={setPublished} />
      </View>
      <Button mode="contained" onPress={onSubmit} loading={submitting} disabled={submitting} style={styles.submit}>
        Guardar
      </Button>
      <Button mode="text" onPress={() => router.back()} style={styles.cancel}>Cancelar</Button>
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    switchLabel: {
      fontSize: 16,
      color: primaryText,
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

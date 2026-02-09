import React, { useMemo, useState, useRef } from 'react';
import { ScrollView, View, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { Text, Button, Card, Chip, Divider, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useSettings } from '../../providers/SettingsProvider';

const ACCENT = '#FF8A5C';




export default function DaytripDetailScreen() {
  const { id } = useLocalSearchParams();
  const screenWidth = Dimensions.get('window').width;
  const [trip, setTrip] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingReserve, setLoadingReserve] = useState(false);
  const [personCount, setPersonCount] = useState(1);
  const { appearance, paperTheme } = useSettings();
  const styles = useMemo(() => makeStyles(appearance, paperTheme, screenWidth), [appearance, paperTheme, screenWidth]);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/daytrips/${id}`)
      .then((res) => {
        let data = res.data;
        // Normalizar imágenes
        let images = [];
        if (Array.isArray(data.images)) {
          images = data.images;
        } else if (typeof data.images === 'string') {
          try {
            const parsed = JSON.parse(data.images);
            if (Array.isArray(parsed)) images = parsed;
          } catch (e) { images = []; }
        }
        // Normalizar includes y timeline
        let includes = [];
        if (Array.isArray(data.includes)) {
          includes = data.includes;
        } else if (typeof data.includes === 'string') {
          try {
            const parsed = JSON.parse(data.includes);
            if (Array.isArray(parsed)) includes = parsed;
          } catch (e) { includes = []; }
        }
        let timeline = [];
        if (Array.isArray(data.timeline)) {
          timeline = data.timeline;
        } else if (typeof data.timeline === 'string') {
          try {
            const parsed = JSON.parse(data.timeline);
            if (Array.isArray(parsed)) timeline = parsed;
          } catch (e) { timeline = []; }
        }
        setTrip({ ...data, images, includes, timeline });
      })
      .catch(() => setTrip(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserve = () => {
    if (loadingReserve) return;
    setLoadingReserve(true);
    const totalPrice = trip.price * personCount;
    api
      .post('/daytrips/reservations', {
        tripId: trip.id,
        title: trip.title,
        price: totalPrice,
        personCount,
      })
      .then(() => {
        Alert.alert(
          'Reserva recibida',
          'Un operador te contactará para confirmar transporte y horarios.',
          [{ text: 'Ok' }]
        );
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          Alert.alert('Inicia sesión', 'Debes iniciar sesión para reservar.', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Iniciar sesión', onPress: () => router.push('/auth') },
          ]);
        } else {
          console.warn('Reserva daytrip (detalle) error:', {
            status: error?.response?.status,
            data: error?.response?.data,
            message: error?.message,
            url: error?.config?.url,
          });
          const msg = error?.response?.data?.message || error?.message || 'No se pudo registrar la reserva. Inténtalo de nuevo.';
          Alert.alert('Error', msg);
        }
      })
      .finally(() => setLoadingReserve(false));
  };

  const handleChat = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para chatear con el operador.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Iniciar sesión', onPress: () => router.push('/auth') },
      ]);
      return;
    }

    try {
      // Crear o asegurar la conversación con el operador
      await api.post('/messages', {
        boatId: trip.id,
        content: `Hola, quiero reservar el pasadía: ${trip.title}`,
      });
    } catch (error) {
      console.warn('No se pudo iniciar el chat', error?.response?.data || error?.message);
    }

    router.push({ pathname: '/messages/[boatId]', params: { boatId: trip.id, title: trip.title } });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Cargando pasadía...</Text>
      </View>
    );
  }
  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Pasadía no encontrado</Text>
        <Button mode="text" onPress={() => router.back()} textColor={paperTheme.colors.primary}>
          <Text>Volver</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {trip.images && trip.images.length > 0 && (
        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={[styles.carousel, { width: screenWidth }]} 
            onScroll={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImage(idx);
            }}
            scrollEventThrottle={16}
          >
            {trip.images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={[styles.hero, { width: screenWidth }]} 
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Indicadores tipo puntos */}
          <View style={styles.carouselIndicators}>
            {trip.images.map((_, idx) => (
              <View
                key={idx}
                style={[styles.carouselDot, currentImage === idx && styles.carouselDotActive]}
              />
            ))}
          </View>
          {/* Contador de fotos en la esquina */}
          <View style={styles.carouselCounter}>
            <Text style={styles.carouselCounterText}>{currentImage + 1} / {trip.images.length}</Text>
          </View>
        </View>
      )}
        <View style={styles.metaRow}>
          <Chip compact style={styles.chip} textStyle={styles.chipText}>
            <Text>Duración: {trip.duration}</Text>
          </Chip>
          <Chip compact style={styles.chip} textStyle={styles.chipText}>
            <Text>Confirmación inmediata</Text>
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Qué incluye</Text>
            {trip.includes.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
            <Divider style={styles.divider} />
            {/* Descripción solo aquí, no arriba */}
            <Text style={styles.description}>{trip.description}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Punto de encuentro</Text>
            <Text style={styles.muted}>{trip.meetingPoint ? trip.meetingPoint : 'Muelle La Bodeguita, 8:00 a.m. Presentarse 15 min antes.'}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Horarios</Text>
            <Text style={styles.muted}>Salida: {trip.horaSalida ? trip.horaSalida : 'No especificada'}</Text>
            <Text style={styles.muted}>Retorno: {trip.horaRetorno ? trip.horaRetorno : 'No especificada'}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Política de cancelación</Text>
            <Text style={styles.muted}>{trip.cancellation ? trip.cancellation : 'Cancelación gratis hasta 48 horas antes. Luego aplica tarifa del operador.'}</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.priceCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Detalle de precio</Text>
            <View style={styles.priceRow}>
              <Text style={styles.muted}>Tarifa por persona</Text>
              <Text style={styles.priceStrong}>{trip.price ? `$${trip.price.toLocaleString('es-CO')}` : ''}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.muted}>Impuestos y cargos</Text>
              <Text style={styles.muted}>Incluidos</Text>
            </View>
            <Divider style={styles.divider} />
            {/* Selector de personas */}
            <View style={styles.personSelectorRow}>
              <Text style={styles.muted}>Personas:</Text>
              <View style={styles.personSelectorBtns}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() => setPersonCount(Math.max(1, personCount - 1))}
                  disabled={personCount === 1}
                  style={styles.personBtn}
                />
                <Text style={styles.personCount}>{personCount}</Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => setPersonCount(personCount + 1)}
                  style={styles.personBtn}
                />
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceStrong}>Total estimado</Text>
              <Text style={styles.priceStrong}>{trip.price ? `$${(trip.price * personCount).toLocaleString('es-CO')}` : ''}</Text>
            </View>
          </Card.Content>
        </Card>
        <View style={styles.actions}>
          <Button
            mode="contained"
            buttonColor={ACCENT}
            textColor={paperTheme.colors.onPrimary || '#FFFFFF'}
            onPress={handleReserve}
            loading={loadingReserve}
            disabled={loadingReserve}
          >
            <Text>Reservar ahora</Text>
          </Button>
        </View>
    </ScrollView>
  );
}

const makeStyles = (mode, paperTheme, screenWidth) => {
  const isDark = mode === 'dark';
  const background = paperTheme.colors.background || (isDark ? '#0B0E14' : '#FFFFFF');
  const surface = paperTheme.colors.surface || (isDark ? '#10141D' : '#FFFFFF');
  const primaryText = paperTheme.colors.onSurface || (isDark ? '#F7F8FA' : '#1C1C1E');
  const secondaryText = isDark ? '#C3C7D3' : '#3C3C43';

  return StyleSheet.create({
    personSelectorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      gap: 12,
    },
    personSelectorBtns: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    personBtn: {
      marginHorizontal: 0,
      backgroundColor: 'transparent',
    },
    personCount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: primaryText,
      minWidth: 32,
      textAlign: 'center',
    },
    container: {
      backgroundColor: background,
      paddingBottom: 32,
    },
    content: {
      paddingHorizontal: 16,
    },
    carousel: {
      height: 220,
      marginBottom: 0,
      overflow: 'hidden',
    },
    hero: {
      height: 220,
      backgroundColor: '#222',
      width: screenWidth,
      margin: 0,
      overflow: 'hidden',
    },
    headerRow: {
      paddingTop: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    title: {
      flex: 1,
      fontSize: 22,
      fontWeight: '700',
      color: primaryText,
    },
    price: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    chip: {
      backgroundColor: isDark ? '#162032' : '#F3F4F7',
      borderColor: isDark ? '#1C2331' : '#E0E6EF',
    },
    chipText: {
      color: primaryText,
      fontSize: 12,
    },
    description: {
      marginTop: 12,
      fontSize: 15,
      color: primaryText,
      lineHeight: 22,
    },
    card: {
      marginTop: 16,
      backgroundColor: surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#1C2331' : '#E9ECEF',
      overflow: 'hidden',
    },
    priceCard: {
      backgroundColor: isDark ? '#181C23' : surface,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: primaryText,
      marginBottom: 8,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: ACCENT,
      marginRight: 8,
    },
    includeText: {
      fontSize: 14,
      color: primaryText,
    },
    divider: {
      marginVertical: 12,
      backgroundColor: isDark ? '#1C2331' : '#E0E6EF',
    },
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 10,
    },
    timelineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: ACCENT,
      marginTop: 4,
    },
    timelineTextWrapper: {
      flex: 1,
      gap: 2,
    },
    timelineHour: {
      fontSize: 12,
      color: secondaryText,
    },
    timelineText: {
      fontSize: 14,
      color: primaryText,
      lineHeight: 20,
    },
    muted: {
      fontSize: 14,
      color: secondaryText,
      lineHeight: 20,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    priceStrong: {
      fontSize: 16,
      fontWeight: '700',
      color: primaryText,
    },
    actions: {
      marginTop: 20,
      gap: 12,
    },
    secondaryBtn: {
      borderColor: paperTheme.colors.primary,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: background,
      padding: 24,
    },
    error: {
      fontSize: 16,
      color: primaryText,
      marginBottom: 12,
    },
  });
};

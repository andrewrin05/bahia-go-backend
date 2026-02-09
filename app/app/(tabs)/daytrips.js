import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, ActivityIndicator, Image, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
import { Text, Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import api from '../../services/api';
import { useSettings } from '../../providers/SettingsProvider';

// Carrusel con contador de imagen
function Carousel({ images, onImagePress = undefined }) {
  const [currentImage, setCurrentImage] = useState(0);
  const safeImages = Array.isArray(images) ? images : [];
  return (
    <View style={{ position: 'relative', width: screenWidth }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: screenWidth, height: 160 }}
        onScroll={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCurrentImage(idx);
        }}
        scrollEventThrottle={16}
      >
        <View style={{ flexDirection: 'row', width: safeImages.length * screenWidth }}>
          {safeImages.map((img, idx) => (
            <View key={idx} style={{ width: screenWidth, height: 160, maxWidth: screenWidth, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: img }}
                style={{ width: screenWidth, height: 160, borderRadius: 10, backgroundColor: '#222' }}
                resizeMode="cover"
                onTouchEnd={() => onImagePress && onImagePress(img)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Indicadores tipo puntos */}
      <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
        {safeImages.map((_, idx) => (
          <View
            key={idx}
            style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#888', marginHorizontal: 4, opacity: currentImage === idx ? 1 : 0.5 }}
          />
        ))}
      </View>
      {/* Contador de fotos en la esquina */}
      <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 2, zIndex: 2 }}>
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{currentImage + 1} / {safeImages.length}</Text>
      </View>
    </View>
  );
}

const ACCENT = '#FF8A5C';

export default function DayTripsScreen() {
      const [personCount, setPersonCount] = useState(1);
    // ...existing code...
    const handleReserve = (trip) => {
    Alert.alert(
      'Reservar',
      `¿Deseas reservar el pasadía "${trip.title}" para ${personCount} persona${personCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setSubmittingId(trip.id);
              await api.post('/bookings/daytrip', {
                daytripId: trip.id,
                totalPrice: (trip.price || 0) * personCount,
                personCount,
              });
              Alert.alert('Reserva realizada', 'Tu reserva fue creada exitosamente.');
              router.push('/bookings');
            } catch (e) {
              Alert.alert('Error', 'No se pudo crear la reserva.');
            } finally {
              setSubmittingId(null);
            }
          },
        },
      ]
    );
    };
  const [submittingId, setSubmittingId] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const { appearance, paperTheme } = useSettings();
  const styles = useMemo(() => makeStyles(appearance, paperTheme), [appearance, paperTheme]);

  useEffect(() => {
    setLoading(true);
    api.get('/daytrips')
      .then(res => {
        // Normalizar imágenes
        const trips = Array.isArray(res.data) ? res.data.map(trip => {
          let images = [];
          if (Array.isArray(trip.images)) {
            images = trip.images;
          } else if (typeof trip.images === 'string') {
            try {
              const parsed = JSON.parse(trip.images);
              if (Array.isArray(parsed)) images = parsed;
            } catch (e) { images = []; }
          }
          return { ...trip, images };
        }) : [];
        setTrips(trips);
      })
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Pasadías disponibles</Text>
        {trips.length === 0 ? (
          <Text style={styles.text}>No hay pasadías disponibles.</Text>
        ) : (
          trips.map((trip) => (
            <Card key={trip.id} style={styles.card}>
              <View style={{flex: 1, padding: 12}}>
                {trip.images && trip.images.length > 0 && (
                  <Carousel images={trip.images} onImagePress={img => {
                    // Validar que img sea string y parezca URL
                    if (typeof img === 'string' && img.startsWith('http')) {
                      setSelectedImage(img);
                      setModalVisible(true);
                    } else {
                      setSelectedImage(null);
                      setModalVisible(true);
                    }
                  }} />
                )}
                <Text style={styles.title}>{trip.title}</Text>
                {/* Mostrar precio si existe */}
                {typeof trip.price !== 'undefined' && trip.price !== null && trip.price !== '' ? (
                  <>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
                      {`${Number(trip.price).toLocaleString('es-CO', { minimumFractionDigits: 0 })} `}
                      <Text style={{fontSize:13,color:'#C3C7D3',marginLeft:2,marginBottom:2}}>/persona</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: '#fff', fontSize: 16, marginRight: 8 }}>Personas:</Text>
                      <Button mode="outlined" onPress={() => setPersonCount(Math.max(1, personCount - 1))} style={{ minWidth: 32 }}>-</Button>
                      <Text style={{ color: '#fff', fontSize: 16, marginHorizontal: 8 }}>{personCount}</Text>
                      <Button mode="outlined" onPress={() => setPersonCount(personCount + 1)} style={{ minWidth: 32 }}>+</Button>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                      Total: {(Number(trip.price) * personCount).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                    </Text>
                  </>
                ) : null}
                <Text style={styles.duration}>{trip.duration || ''}</Text>
                <View style={styles.actions}>
                  <Button
                    mode="contained"
                    buttonColor={ACCENT}
                    textColor={paperTheme.colors.onPrimary || '#FFFFFF'}
                    onPress={() => handleReserve(trip, personCount)}
                    loading={submittingId === trip.id}
                    disabled={!!submittingId}
                  >
                    <Text>Reservar ahora</Text>
                  </Button>
                  <Button
                    mode="text"
                    textColor={paperTheme.colors.primary}
                    onPress={() => router.push({ pathname: '/daytrips/[id]', params: { id: trip.id } })}
                  >
                    <Text>Ver detalles</Text>
                  </Button>
                  {/* Botón de editar visible si el usuario es dueño/admin (ajusta lógica según roles) */}
                  {trip.ownerId === 'admin' || trip.ownerId === 'currentUserId' ? (
                    <Button
                      mode="outlined"
                      textColor={paperTheme.colors.primary}
                      onPress={() => router.push({ pathname: '/admin/daytrips/[id]', params: { id: trip.id } })}
                      style={{ marginTop: 8 }}
                    >
                      <Text>Editar</Text>
                    </Button>
                  ) : null}
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
      {/* Modal fullscreen para imagen */}
      {modalVisible && selectedImage && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView
              maximumZoomScale={4}
              minimumZoomScale={1}
              contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              {selectedImage ? (
                <>
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: '90%', height: '70%', borderRadius: 12 }}
                    resizeMode="contain"
                  />
                  <Text style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>{selectedImage}</Text>
                </>
              ) : (
                <Text style={{ color: '#fff', fontSize: 18 }}>No se pudo cargar la imagen</Text>
              )}
            </ScrollView>
            <Button mode="contained" onPress={() => setModalVisible(false)} style={{ marginTop: 24 }}>Cerrar</Button>
          </View>
        </View>
      )}
    </>
  );
}

              const styles = StyleSheet.create({
                container: {
                  padding: 16,
                  backgroundColor: "#181c1f",
                  minHeight: "100%",
                },
                center: {
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#181c1f",
                },
                header: {
                  color: "#00ff99",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 16,
                  textAlign: "center",
                },
                card: {
                  backgroundColor: "#23282d",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: "#00ff99",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                },
                title: {
                  color: "#00ff99",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 8,
                },
                text: {
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 4,
                },
                error: {
                  color: "#ff5555",
                  fontSize: 18,
                  fontWeight: "bold",
                },
                debugBox: {
                  backgroundColor: "#222",
                  marginTop: 24,
                  padding: 8,
                  borderRadius: 8,
                },
                debugText: {
                  color: "#aaa",
                  fontSize: 12,
                  fontFamily: "monospace",
                },
              });


const makeStyles = (mode, paperTheme) => {
  const isDark = mode === 'dark';
  const background = paperTheme.colors.background || (isDark ? '#0B0E14' : '#FFFFFF');
  const surface = paperTheme.colors.surface || (isDark ? '#10141D' : '#FFFFFF');
  const primaryText = paperTheme.colors.onSurface || (isDark ? '#F7F8FA' : '#1C1C1E');
  const secondaryText = isDark ? '#C3C7D3' : '#3C3C43';

  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: background,
    },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      color: primaryText,
      marginBottom: 4,
    },
    subheading: {
      fontSize: 16,
      color: secondaryText,
      marginBottom: 16,
    },
    card: {
      marginBottom: 16,
      backgroundColor: surface,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? '#1C2331' : '#E9ECEF',
    },
    cover: {
      height: 180,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: primaryText,
      marginTop: 12,
    },
    duration: {
      fontSize: 14,
      color: secondaryText,
      marginTop: 4,
    },
    price: {
      fontSize: 18,
      fontWeight: '700',
      color: ACCENT,
      marginTop: 6,
    },
    includes: {
      marginTop: 10,
      gap: 6,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
    actions: {
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingBottom: 12,
    },
  });
};

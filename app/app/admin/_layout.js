import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#00C853',
        headerBackTitleVisible: false,
        gestureEnabled: true,
        headerStyle: { backgroundColor: '#181c1f' },
        headerTitleStyle: { color: '#fff' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Panel Admin' }} />
      <Stack.Screen name="daytrips/reservations" options={{ title: 'Reservas de Pasadías' }} />
      <Stack.Screen name="daytrips/my-daytrips" options={{ title: 'Mis Pasadías' }} />
      <Stack.Screen name="daytrips/create" options={{ title: 'Crear Pasadía' }} />
      <Stack.Screen name="boats/my-boats" options={{ title: 'Mis Barcos' }} />
      <Stack.Screen name="boats/create" options={{ title: 'Crear Barco' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppSettingsProvider, useSettings } from '../providers/SettingsProvider';

const ThemedShell = () => {
  const { paperTheme } = useSettings();
  return (
    <PaperProvider theme={paperTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
};

export default function Layout() {
  return (
    <AppSettingsProvider>
      <ThemedShell />
    </AppSettingsProvider>
  );
}
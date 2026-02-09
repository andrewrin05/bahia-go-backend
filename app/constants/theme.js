import { MD3LightTheme } from 'react-native-paper';

// Naranja pastel principal: #FFB870
// Naranja pastel secundario/acento: #FFD8A8
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FFB870', // Naranja pastel principal
    secondary: '#FFD8A8', // Naranja pastel claro/acento
    background: '#FFFFFF',
    surface: '#FFF7ED', // Fondo suave
    surfaceVariant: '#FFE8CC', // Cards
    onSurface: '#1C1C1E',
    onSurfaceVariant: '#3C3C43',
    text: '#1C1C1E',
    onPrimary: '#FFFFFF',
    onSecondary: '#1C1C1E',
    outline: '#FFD8A8',
    outlineVariant: '#FFE8CC',
  },
};
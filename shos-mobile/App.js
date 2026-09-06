import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { HospitalDataProvider } from './src/context/HospitalDataContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Enable screens properly so react-native-screens preserves style on web
enableScreens(true);

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('SHOS App ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>SHOS Clinical Terminal Error</Text>
          <Text style={styles.errorMessage}>{this.state.error?.toString()}</Text>
          <Text style={styles.errorStack}>{this.state.error?.stack}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const isWeb = Platform.OS === 'web';

  return (
    <ErrorBoundary>
      <View style={isWeb ? styles.webOuter : styles.nativeOuter}>
        <View style={isWeb ? styles.webFrame : styles.nativeFrame}>
          <SafeAreaProvider
            initialMetrics={initialWindowMetrics}
            style={styles.flexFill}
          >
            <NavigationContainer
              fallback={
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Initializing SHOS Hospital Systems...</Text>
                </View>
              }
            >
              <AuthProvider>
                <NotificationProvider>
                  <HospitalDataProvider>
                    <StatusBar style="light" />
                    <RootNavigator />
                  </HospitalDataProvider>
                </NotificationProvider>
              </AuthProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#0F172A', // Dark slate backdrop for desktop preview
    alignItems: 'center',
    justifyContent: 'center',
  },
  webFrame: {
    width: '100%',
    maxWidth: 480,
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    overflow: 'hidden',
  },
  nativeOuter: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  nativeFrame: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexFill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 14,
    color: '#0284C7',
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 12,
  },
  errorStack: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});

// SHOS Mobile Central Axios Client Layer
// Pre-configured for plug-and-play backend API integration.

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// In development, auto-detect host IP from Expo Metro connection with fallback to current LAN IP
const getHostIp = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || '';
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return '172.29.17.206';
};

const LAN_IP = getHostIp();
export const API_BASE_URL = Platform.OS === 'web'
  ? 'https://shos-backend.onrender.com/api'
  : `http://${LAN_IP}:5000/api`;


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Auth Token if available
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@shos_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Offline fallback
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error messaging for mobile UI
    const customError = {
      message: error.response?.data?.message || error.message || 'Network communication error',
      status: error.response?.status || 500,
      details: error.response?.data?.errors || null,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;

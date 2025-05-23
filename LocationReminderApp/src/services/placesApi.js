import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:8001'; // Android emulator

const categoryToPlaceType = {
  'Groceries': 'grocery_or_supermarket',
  'Shopping': 'shopping_mall',
  'Pharmacy': 'pharmacy',
  'Services': 'store',
  'Other': 'point_of_interest'
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/token', {
      username,
      password,
    });
    await AsyncStorage.setItem('userToken', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await apiClient.post('/users/', {
      username,
      password,
    });
    await AsyncStorage.setItem('userToken', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const fetchNearbyPlaces = async (latitude, longitude, category, radius) => {
  try {
    const placeType = categoryToPlaceType[category] || 'store';
    const radiusInMeters = radius * 1609.34;
    const response = await apiClient.get('/api/places/nearby', {
      params: {
        latitude,
        longitude,
        place_type: placeType,
        radius: radiusInMeters,
      },
    });
    return response.data.places;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

export const geocodeAddress = async (address) => {
  try {
    const response = await apiClient.get('/api/geocode', {
      params: { address },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

export const createReminder = async (title, category) => {
  try {
    const response = await apiClient.post('/reminders/', {
      title,
      category,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

export const getReminders = async () => {
  try {
    const response = await apiClient.get('/reminders/');
    return response.data;
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
};

export const deleteReminder = async (reminderId) => {
  try {
    await apiClient.delete(`/reminders/${reminderId}`);
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};
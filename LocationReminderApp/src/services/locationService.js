import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { fetchNearbyPlaces, getReminders } from './placesApi';

let watchId = null;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const startLocationTracking = async () => {
  stopLocationTracking();
  
  const settingsStr = await AsyncStorage.getItem('settings');
  const settings = settingsStr ? JSON.parse(settingsStr) : { 
    notificationsEnabled: true,
    locationTracking: true,
    searchRadius: 2 
  };
  
  if (!settings.locationTracking) {
    console.log('Location tracking disabled in settings');
    return;
  }
  
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
  
  PushNotification.createChannel(
    {
      channelId: 'reminder-channel',
      channelName: 'Reminder Notifications',
      channelDescription: 'Notifications for location-based reminders',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );
  
  watchId = Geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      const currentReminders = await getReminders();
      
      if (currentReminders.length === 0) {
        return;
      }
      
      let notifiedPlaces = [];
      try {
        const notifiedStr = await AsyncStorage.getItem('notifiedPlaces');
        if (notifiedStr) {
          notifiedPlaces = JSON.parse(notifiedStr);
          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          notifiedPlaces = notifiedPlaces.filter(
            place => place.timestamp > oneHourAgo
          );
        }
      } catch (error) {
        console.error('Error loading notified places:', error);
      }
      
      const categories = [...new Set(currentReminders.map(r => r.category))];
      
      for (const category of categories) {
        const categoryReminders = currentReminders
          .filter(r => r.category === category);
        
        if (categoryReminders.length === 0) continue;
        
        try {
          const nearbyPlaces = await fetchNearbyPlaces(
            latitude,
            longitude,
            category,
            settings.searchRadius
          );
          
          for (const place of nearbyPlaces) {
            const alreadyNotified = notifiedPlaces.some(
              p => p.placeId === place.place_id
            );
            
            if (alreadyNotified) continue;
            
            const distance = calculateDistance(
              latitude,
              longitude,
              place.geometry.location.lat,
              place.geometry.location.lng
            );
            
            if (distance <= settings.searchRadius) {
              const reminderItems = categoryReminders
                .map(r => r.title)
                .join(', ');
              
              PushNotification.localNotification({
                channelId: 'reminder-channel',
                title: `Reminder: ${place.name} is nearby`,
                message: `You can get ${reminderItems} at ${place.name}, ${distance.toFixed(1)} miles away.`,
                playSound: true,
                soundName: 'default',
                importance: 'high',
              });
              
              notifiedPlaces.push({
                placeId: place.place_id,
                timestamp: Date.now(),
              });
              
              await AsyncStorage.setItem(
                'notifiedPlaces',
                JSON.stringify(notifiedPlaces)
              );
              
              break;
            }
          }
        } catch (error) {
          console.error(`Error fetching nearby places for ${category}:`, error);
        }
      }
    },
    (error) => {
      console.error('Location tracking error:', error);
    },
    { 
      enableHighAccuracy: true,
      distanceFilter: 100,
      interval: 30000,
      fastestInterval: 10000,
      forceRequestLocation: true,
      showLocationDialog: true,
    }
  );
};

export const stopLocationTracking = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
};
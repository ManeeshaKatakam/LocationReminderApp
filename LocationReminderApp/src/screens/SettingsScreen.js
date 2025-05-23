import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopLocationTracking, startLocationTracking } from '../services/locationService';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    locationTracking: true,
    searchRadius: '2',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
    if (settings.locationTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [settings]);

  const loadSettings = async () => {
    try {
      const settingsStr = await AsyncStorage.getItem('settings');
      if (settingsStr) {
        setSettings(JSON.parse(settingsStr));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleRadiusChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0.1 || numValue > 10) {
      Alert.alert('Invalid Input', 'Please enter a radius between 0.1 and 10 miles');
      return;
    }
    setSettings({ ...settings, searchRadius: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) =>
              setSettings({ ...settings, notificationsEnabled: value })
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Tracking</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Background Location</Text>
          <Switch
            value={settings.locationTracking}
            onValueChange={(value) =>
              setSettings({ ...settings, locationTracking: value })
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Radius</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Radius (miles)</Text>
          <TextInput
            style={styles.input}
            value={settings.searchRadius}
            onChangeText={handleRadiusChange}
            keyboardType="numeric"
            placeholder="e.g., 2"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => Alert.alert('Settings Saved', 'Your settings have been saved.')}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 100,
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
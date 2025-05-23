# Quick Start Guide

This guide will help you set up and run your location-based reminder app quickly.

## Step 1: Get a Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable these APIs:
   - Places API
   - Geocoding API
   - Maps SDK for Android/iOS
4. Create an API key and restrict it to these APIs
5. Make note of your API key for later

## Step 2: Set Up the Backend

```bash
# Clone the repository (if you're using version control)
# git clone <your-repo-url>

# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Google API key
echo "GOOGLE_PLACES_API_KEY=your_api_key_here" > .env
echo "SECRET_KEY=your_secret_key_here" >> .env

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Step 3: Set Up the Frontend

```bash
# In a new terminal, navigate to the React Native app directory
cd LocationReminderApp

# Install dependencies
npm install

# For iOS, install pods
cd ios && pod install && cd ..

# Update the API base URL in src/services/placesApi.js
# - For emulator: Android uses 10.0.2.2:8000, iOS uses localhost:8000
# - For physical device: use your computer's network IP address

# Start the Metro bundler
npx react-native start

# In another terminal, run the app
npx react-native run-android
# or
npx react-native run-ios
```

## Step 4: Testing the App

1. Open the app on your device/emulator
2. Add a few reminders in different categories
3. Go to Settings and make sure notifications and location tracking are enabled
4. Set a comfortable search radius (e.g., 2 miles)
5. Keep the app running in the background and move around
6. You should receive notifications when you're near places that match your reminder categories

## Common Issues

### Location Tracking Issues
- Ensure location permissions are granted
- Check that battery optimization is disabled for the app
- For Android, ensure background location is explicitly granted
- For iOS, allow "Always" location access

### Notification Issues
- Check that notifications are enabled in the app settings
- Verify system notification permissions
- For Android, ensure notification channel is created properly

### API Connection Issues
- Verify your Google API key is correct
- Make sure the backend server is running
- Check the API base URL in placesApi.js matches your server's address
- Ensure your API key has the necessary APIs enabled

## Next Steps

After getting the basic app working, consider these improvements:

1. Implement user authentication with JWT
2. Add database storage for reminders on the backend
3. Implement push notifications through Firebase Cloud Messaging
4. Add unit and integration tests
5. Improve UI/UX with loading states and error handling
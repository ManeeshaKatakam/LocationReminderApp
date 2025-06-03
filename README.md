# Location-Based Reminder App

A React Native app with FastAPI backend that helps users remember important tasks when they're near relevant locations. When users are on the move, the app notifies them about nearby stores where they can complete items on their to-do list.

## Features

- Add reminders by category (groceries, shopping, pharmacy, etc.)
- Background location tracking to detect when you're near relevant places
- Push notifications when you're near a store that matches your reminder categories
- Customizable settings for notification preferences and search radius
- Energy-efficient background processing

## Technology Stack

- **Frontend**: React Native, React Navigation, AsyncStorage
- **Backend**: FastAPI, SQLAlchemy
- **APIs**: Google Places API for location-based services
- **Storage**: Local storage on device, SQLite for backend

## Prerequisites

- Node.js and npm
- Python 3.8+
- Google Places API key
- React Native development environment setup (Android Studio / Xcode)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your Google API key:
   ```
   GOOGLE_PLACES_API_KEY=your_google_api_key_here
   SECRET_KEY=your_secret_key_here
   DATABASE_URL=sqlite:///./location_reminders.db
   ```

5. Start the FastAPI server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd LocationReminderApp
   npm install
   ```

2. Configure API endpoint:
   - Open `src/services/placesApi.js`
   - Update `API_BASE_URL` to your backend server address
   - For emulator: Android uses `10.0.2.2:8000`, iOS uses `localhost:8000`
   - For physical device: use your computer's local IP address

3. Run the app:
   ```
   # For Android
   npx react-native run-android
   
   # For iOS
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

## Project Structure

```
location_based_reminder/
├── backend/               # FastAPI backend
│   ├── main.py            # Main API endpoints
│   ├── requirements.txt   # Dependencies
│   └── .env               # Environment variables
│
└── LocationReminderApp/   # React Native frontend
    ├── src/
    │   ├── screens/       # UI screens
    │   ├── services/      # API interactions and location tracking
    │   └── utils/         # Helper functions
    └── ...
```

## Android Specific Setup

For Android devices, you need to add location permissions to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## iOS Specific Setup

For iOS devices, add these to your `Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to provide reminders when you are near stores.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need background location access to notify you about nearby stores even when the app is closed.</string>
<key>UIBackgroundModes</key>
<array>
    <string>location</string>
</array>
```

## Future Enhancements

- User authentication and cloud sync
- Machine learning to predict which stores you're likely to visit
- Smart categorization of reminders
- Integration with popular shopping list apps
- Custom notification preferences per reminder category

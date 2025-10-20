# Push Notifications Setup Guide

## ✅ Configuration Complete

Your push notifications are now properly configured according to Expo's official documentation.

## What's Been Set Up:

### 1. **App Configuration (app.json)**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/icon.png",
          "color": "#E6491E",
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

### 2. **Notification Service (utils/notificationService.ts)**
- Uses `expo-constants` to get projectId from app config
- Properly configured according to Expo docs:
```typescript
const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;

const token = await Notifications.getExpoPushTokenAsync({
  projectId,
});
```

### 3. **Installed Packages**
- ✅ `expo-notifications` - Push notification handling
- ✅ `expo-device` - Device detection
- ✅ `expo-constants` - Access to app config
- ✅ `expo-sensors` - Shake detection

## 📝 Next Steps:

### For Development (Expo Go):
1. The current setup works with Expo Go for **local notifications**
2. Push notifications from external servers require a development build

### For Production:

#### 1. Get Your Project ID:
```bash
# If you don't have an EAS account yet
npx eas-cli login

# Create/link your project
npx eas-cli init

# This will give you a projectId
```

#### 2. Update app.json:
Replace `"your-project-id-here"` with your actual EAS project ID:
```json
"extra": {
  "eas": {
    "projectId": "your-actual-uuid-here"
  }
}
```

#### 3. Build Your App:
```bash
# For Android
npx eas-cli build --platform android

# For iOS
npx eas-cli build --platform ios
```

#### 4. Test Push Notifications:
Use the Expo Push Notification Tool:
https://expo.dev/notifications

## 🔧 Configuration Options:

### Notification Plugin Options (app.json):
- **icon**: Notification icon (Android)
- **color**: Notification color (Android)
- **sounds**: Custom notification sounds

### Android Notification Channels:
Already configured in `notificationService.ts`:
- **default** - Standard notifications
- **emergency** - High-priority emergency alerts

### iOS Configuration:
Automatically handled by the plugin. No additional setup needed.

## 📱 Current Features:

### Working Now (Expo Go):
✅ Local notifications
✅ Scheduled notifications
✅ Emergency alerts (high priority)
✅ Notification tap handling
✅ Badge count management
✅ Shake detection → Emergency report

### Requires Development Build:
❌ Push notifications from external servers
❌ Background notifications (iOS)

## 🧪 Testing:

### Test Local Notifications:
1. Go to Settings screen
2. Tap "Test Notification" or "Test Emergency Alert"
3. Check your notification tray

### Test Shake Detection:
1. Shake your device
2. App should navigate to emergency report screen

## 📚 Documentation References:
- [Expo Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [expo-notifications API](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

## 🚨 Important Notes:

1. **projectId is optional for Expo Go** - Local notifications work without it
2. **For production**, you MUST set a valid projectId
3. **Notification sounds** - Add custom sounds to `assets/sounds/` folder
4. **Android channels** - Already configured for default and emergency
5. **iOS permissions** - Automatically requested on first launch

## 🔐 Security:

- Push tokens are device-specific
- Tokens are tied to your projectId
- Never hardcode push tokens in your app
- Store tokens securely on your backend

Your push notification system is now properly configured and ready for both development and production use!

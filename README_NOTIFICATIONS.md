# Push Notifications Setup Guide

## Overview
This app uses `expo-notifications` for local and push notifications. The notification system is fully configured and ready to use.

## Installation
The required packages are already installed:
```bash
npm install expo-notifications expo-device @react-native-async-storage/async-storage
```

## Usage

### 1. Using the Notification Hook (Recommended)

Import the hook in any component:

```tsx
import { useNotification } from '@/context/NotificationContext';

function MyComponent() {
  const { 
    sendNotification, 
    sendEmergencyNotification,
    scheduleNotification,
    expoPushToken 
  } = useNotification();

  // Send immediate notification
  const handleSendNotification = async () => {
    await sendNotification(
      'New Alert',
      'You have a new emergency nearby',
      { screen: '/view-sos', emergencyId: '123' }
    );
  };

  // Send emergency notification (high priority)
  const handleEmergency = async () => {
    await sendEmergencyNotification(
      '🚨 Emergency Alert',
      'Fire reported at Nyamkombo KK 291',
      { screen: '/view-sos', emergencyId: '456' }
    );
  };

  // Schedule notification for later
  const handleSchedule = async () => {
    const futureDate = new Date(Date.now() + 60000); // 1 minute from now
    await scheduleNotification(
      'Reminder',
      'Check emergency status',
      futureDate,
      { screen: '/view-sos' }
    );
  };

  return (
    <Button onPress={handleSendNotification} title="Send Notification" />
  );
}
```

### 2. Using the Notification Service Directly

For more advanced use cases:

```tsx
import { notificationService } from '@/utils/notificationService';

// Send custom notification
await notificationService.sendNotification({
  title: 'Custom Alert',
  body: 'This is a custom notification',
  data: { customData: 'value' },
  priority: 'high',
  sound: true,
});

// Schedule repeating notification
await notificationService.scheduleRepeatingNotification(
  {
    title: 'Daily Reminder',
    body: 'Check for emergencies in your area',
  },
  86400 // Every 24 hours (in seconds)
);

// Cancel all notifications
await notificationService.cancelAllNotifications();

// Get all scheduled notifications
const scheduled = await notificationService.getAllScheduledNotifications();
```

## Available Methods

### NotificationContext Hook
- `sendNotification(title, body, data?)` - Send immediate notification
- `sendEmergencyNotification(title, body, data?)` - Send high-priority emergency notification
- `scheduleNotification(title, body, date, data?)` - Schedule notification for specific time
- `cancelAllNotifications()` - Cancel all scheduled notifications
- `expoPushToken` - Get the device's push token
- `notification` - Current notification object

### NotificationService
- `registerForPushNotifications()` - Register device for push notifications
- `sendNotification(notification)` - Send immediate notification
- `sendEmergencyNotification(title, body, data?)` - Send emergency alert
- `scheduleNotificationAt(notification, date)` - Schedule for specific time
- `scheduleRepeatingNotification(notification, seconds)` - Schedule repeating notification
- `cancelNotification(id)` - Cancel specific notification
- `cancelAllNotifications()` - Cancel all notifications
- `dismissNotification(id)` - Dismiss specific notification
- `dismissAllNotifications()` - Dismiss all notifications
- `setBadgeCount(count)` - Set app badge count (iOS)
- `getBadgeCount()` - Get current badge count (iOS)

## Notification Channels (Android)

Two channels are configured:
1. **default** - Standard notifications
2. **emergency** - High-priority emergency alerts with custom vibration

## Handling Notification Taps

Notifications can include navigation data:

```tsx
await sendNotification(
  'New Emergency',
  'Tap to view details',
  { 
    screen: '/view-sos',
    emergencyId: '123',
    // Any custom data
  }
);
```

The NotificationContext automatically logs tap events. You can extend this in `context/NotificationContext.tsx`:

```tsx
responseListener.current =
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.screen) {
      router.push(data.screen); // Navigate to screen
    }
  });
```

## Configuration

### Update Project ID
In `utils/notificationService.ts`, replace the project ID:

```tsx
const token = await Notifications.getExpoPushTokenAsync({
  projectId: "your-expo-project-id", // Update this
});
```

### Customize Notification Behavior
In `utils/notificationService.ts`:

```tsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

## Example Use Cases

### Emergency Reporting
```tsx
// When user reports emergency
await sendEmergencyNotification(
  '🚨 Emergency Reported',
  'Your emergency has been reported to nearby volunteers',
  { screen: '/view-sos', emergencyId: newEmergency.id }
);
```

### Volunteer Notifications
```tsx
// When someone volunteers
await sendNotification(
  '👋 New Volunteer',
  'John Doe volunteered to help with your emergency',
  { screen: '/view-sos', emergencyId: emergency.id }
);
```

### Status Updates
```tsx
// When emergency status changes
await sendNotification(
  '✅ Status Update',
  'Emergency services are on the way',
  { screen: '/view-sos', emergencyId: emergency.id }
);
```

## Testing

Test notifications in development:

```tsx
import { useNotification } from '@/context/NotificationContext';

function TestScreen() {
  const { sendNotification } = useNotification();

  return (
    <Button
      title="Test Notification"
      onPress={() => sendNotification('Test', 'This is a test notification')}
    />
  );
}
```

## Notes

- Notifications work on physical devices and simulators
- Push notifications require a physical device
- The notification permission is requested automatically on app launch
- All notification methods are async and return Promises
- Emergency notifications use maximum priority for immediate delivery

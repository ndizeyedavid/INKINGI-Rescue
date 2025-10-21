# Settings Screen Translation Update Guide

Due to the large size of the settings.tsx file (723 lines), here's a comprehensive guide for updating all text to use i18n translations.

## Required Changes:

### 1. Section Titles and Subtitles
Replace hardcoded text with translation keys:

```typescript
// Permissions Section
<Text style={styles.sectionTitle}>{t('settings.permissions')}</Text>
<Text style={styles.sectionSubtitle}>{t('settings.permissionsSubtitle')}</Text>

// Location Access
<Text style={styles.settingTitle}>{t('settings.locationAccess')}</Text>
<Text style={styles.settingDescription}>{t('settings.locationDescription')}</Text>

// Camera Access
<Text style={styles.settingTitle}>{t('settings.cameraAccess')}</Text>
<Text style={styles.settingDescription}>{t('settings.cameraDescription')}</Text>

// Microphone Access
<Text style={styles.settingTitle}>{t('settings.microphoneAccess')}</Text>
<Text style={styles.settingDescription}>{t('settings.microphoneDescription')}</Text>

// Notifications
<Text style={styles.settingTitle}>{t('settings.notifications')}</Text>
<Text style={styles.settingDescription}>{t('settings.notificationsDescription')}</Text>

// App Preferences Section
<Text style={styles.sectionTitle}>{t('settings.appPreferences')}</Text>
<Text style={styles.sectionSubtitle}>{t('settings.appPreferencesSubtitle')}</Text>

// Sound Effects
<Text style={styles.settingTitle}>{t('settings.soundEffects')}</Text>
<Text style={styles.settingDescription}>{t('settings.soundDescription')}</Text>

// Vibration
<Text style={styles.settingTitle}>{t('settings.vibration')}</Text>
<Text style={styles.settingDescription}>{t('settings.vibrationDescription')}</Text>

// Auto-Share Location
<Text style={styles.settingTitle}>{t('settings.autoShareLocation')}</Text>
<Text style={styles.settingDescription}>{t('settings.autoShareDescription')}</Text>

// Functionality Testing Section
<Text style={styles.sectionTitle}>{t('settings.functionalityTesting')}</Text>
<Text style={styles.sectionSubtitle}>{t('settings.testingSubtitle')}</Text>

// Test Notification
<Text style={styles.settingTitle}>{t('settings.testNotification')}</Text>
<Text style={styles.settingDescription}>{t('settings.testNotificationDescription')}</Text>

// Test Emergency Alert
<Text style={styles.settingTitle}>{t('settings.testEmergencyAlert')}</Text>
<Text style={styles.settingDescription}>{t('settings.testEmergencyDescription')}</Text>

// Test Government Broadcast
<Text style={styles.settingTitle}>{t('settings.testBroadcast')}</Text>
<Text style={styles.settingDescription}>{t('settings.testBroadcastDescription')}</Text>

// Other Section
<Text style={styles.sectionTitle}>{t('settings.other')}</Text>

// Language
<Text style={styles.settingTitle}>{t('settings.language')}</Text>
<Text style={styles.settingDescription}>{i18n.language.toUpperCase()}</Text>

// Privacy Policy
<Text style={styles.settingTitle}>{t('settings.privacyPolicy')}</Text>
<Text style={styles.settingDescription}>{t('settings.privacyPolicyDescription')}</Text>

// Terms of Service
<Text style={styles.settingTitle}>{t('settings.termsOfService')}</Text>
<Text style={styles.settingDescription}>{t('settings.termsDescription')}</Text>

// Version
<Text style={styles.versionText}>{t('settings.version')}</Text>
```

All translation keys are already defined in the i18n/locales/*.json files!

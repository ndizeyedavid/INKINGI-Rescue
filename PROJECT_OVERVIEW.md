# INKINGI Rescue - Project Overview

## Table of Contents
1. [Project Description](#project-description)
2. [System Architecture](#system-architecture)
3. [Mobile App Features](#mobile-app-features)
4. [Technical Stack](#technical-stack)
5. [Emergency Flow](#emergency-flow)
6. [Responder Dashboard Requirements](#responder-dashboard-requirements)
7. [Government Dashboard Requirements](#government-dashboard-requirements)
8. [API Integration](#api-integration)
9. [Future Enhancements](#future-enhancements)

---

## Project Description

**INKINGI Rescue** is a comprehensive emergency response mobile application designed for Rwanda, enabling citizens to quickly report emergencies, request help, and connect with nearby volunteers and professional responders. The app leverages AI-powered assistance, real-time location tracking, and community engagement to provide rapid emergency response.

### Key Objectives
- **Rapid Emergency Reporting**: Enable users to report emergencies with one tap
- **Automated Detection**: Shake-to-alert and loud sound detection for hands-free emergency reporting
- **Community Response**: Connect users with nearby volunteers willing to help
- **AI Assistance**: Provide context-aware safety tips and emergency guidance
- **Multi-language Support**: Available in English, French, Kinyarwanda, and Kiswahili

---

## System Architecture

### Components
```
┌─────────────────────────────────────────────────────────────┐
│                     INKINGI Rescue System                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │  Mobile App  │◄──►│   Backend    │◄──►│  Dashboards  │ │
│  │  (Citizens)  │    │     API      │    │  (Responders)│ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │         │
│         │                    │                    │         │
│  ┌──────▼────────┐    ┌─────▼──────┐    ┌───────▼──────┐ │
│  │  Push Notifs  │    │  Database  │    │  Government  │ │
│  │   (Expo)      │    │ (PostgreSQL)│   │  Dashboard   │ │
│  └───────────────┘    └────────────┘    └──────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            AI Services (Gemini)                       │  │
│  │  - Emergency Tips Generation                          │  │
│  │  - Chat Assistant                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile App Features

### 1. **Emergency Reporting**
- **Manual Reporting**: Users can report emergencies by selecting type, location, and adding details
- **Quick SOS**: Pre-configured emergency contacts and one-tap emergency alerts
- **Shake Alert**: Shake phone to automatically trigger emergency with photo and audio evidence
- **Loud Sound Detection**: Automatic emergency trigger when loud sounds (screams, crashes) are detected
- **Media Capture**: Automatic photo and 5-second audio recording as evidence

### 2. **Emergency Types**
- Fire
- Medical Emergency
- Accident
- Robbery/Crime
- Natural Disaster
- Other

### 3. **Real-time Features**
- **Live Location Tracking**: GPS coordinates sent with every emergency
- **Route Calculation**: Shows distance and route to emergency location
- **Nearby Emergencies**: View emergencies within user's vicinity
- **Emergency Map**: Interactive map showing all active emergencies

### 4. **Volunteer System**
- Users can volunteer to help with emergencies
- Provide skills and availability information
- View list of volunteers responding to emergencies
- Emergency creator can see who's coming to help

### 5. **AI-Powered Assistance**
- **INKINGI AI Chat**: 24/7 emergency guidance chatbot
- **Context-Aware Tips**: AI generates specific safety tips based on:
  - Emergency type
  - Location
  - Situation description
  - Real-time context
- **Emergency Instructions**: Step-by-step guidance for various emergency scenarios

### 6. **Community Features**
- **Community Posts**: Share safety tips, warnings, and updates
- **Like & Comment**: Engage with community content
- **Post Creation**: Share text, images, and important information
- **Organization Accounts**: Red Cross, Police, etc. can post official updates

### 7. **Notifications**
- **Emergency Alerts**: Nearby emergencies notification
- **Community Updates**: New posts from organizations
- **System Notifications**: App updates and important announcements
- **Smart Badge**: Shows unread notification count
- **Local Storage**: Read/unread status persisted locally

### 8. **User Profile & Settings**
- **Profile Management**: Update personal information and profile picture
- **Emergency Contacts**: Configure quick-dial emergency contacts
- **Language Selection**: Switch between 4 supported languages
- **Permissions**: Manage camera, microphone, and location access
- **Privacy Settings**: Control data sharing and visibility

### 9. **Panic Buttons**
- **Customizable Buttons**: Create quick-access emergency buttons
- **One-Tap Activation**: Instant emergency reporting
- **Pre-filled Information**: Auto-populate emergency details

---

## Technical Stack

### Mobile App
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **UI**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API
- **Navigation**: Expo Router (File-based routing)
- **Maps**: React Native Maps (Google Maps)
- **AI**: Google Gemini API
- **Storage**: AsyncStorage
- **Notifications**: Expo Notifications
- **Sensors**: Expo Sensors (Accelerometer for shake detection)
- **Audio**: Expo AV (Audio recording and playback)
- **Internationalization**: i18next

### Backend (Expected)
- **API**: RESTful API
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **File Storage**: Cloud storage for media files
- **Real-time**: WebSockets for live updates

---

## Emergency Flow

### 1. **Manual Emergency Report**
```
User → Select Emergency Type → Add Location → Add Description 
→ Attach Media (Optional) → Submit → Backend Creates Emergency 
→ Nearby Users Notified → Volunteers Can Respond
```

### 2. **Shake Alert Emergency**
```
User Shakes Phone (3 times) → App Detects Shake → Captures Photo 
→ Records 5s Audio → Auto-submits Emergency → Plays Alert Sound 
→ Backend Processes → Notifications Sent → Help Dispatched
```

### 3. **Loud Sound Detection**
```
App Monitors Audio Levels → Detects Loud Sound (>80dB) 
→ Triggers Emergency → Captures Evidence → Auto-submits 
→ Notifications Sent → Emergency Response Initiated
```

### 4. **Volunteer Response**
```
User Views Emergency → Clicks "Volunteer to Help" → Fills Form 
(Skills, Message) → Submits → Emergency Creator Notified 
→ Volunteer Added to List → Can Navigate to Location
```

---

## Responder Dashboard Requirements

### Purpose
A web-based dashboard for professional emergency responders (Police, Fire Department, Ambulance Services, Red Cross) to monitor, manage, and respond to emergencies reported through the INKINGI Rescue mobile app.

### Key Features

#### 1. **Real-time Emergency Monitor**
- **Live Emergency Feed**: Display all active emergencies in real-time
- **Map View**: Interactive map showing emergency locations with color-coded markers
- **Emergency Details**: View full emergency information including:
  - Type and severity
  - Location (GPS coordinates + address)
  - Reporter information
  - Description and media files (photos, videos, audio)
  - Timestamp
  - Number of volunteers responding

#### 2. **Emergency Management**
- **Status Updates**: Mark emergencies as:
  - Pending
  - Acknowledged
  - En Route
  - On Scene
  - Resolved
  - False Alarm
- **Assignment System**: Assign emergencies to specific responder units
- **Priority Levels**: Set and update emergency priority (Critical, High, Medium, Low)
- **Response Time Tracking**: Monitor time from report to resolution

#### 3. **Responder Coordination**
- **Unit Management**: View available responder units and their locations
- **Dispatch System**: Assign and dispatch units to emergencies
- **Communication**: Internal messaging between responders
- **Resource Allocation**: Track equipment and personnel deployment

#### 4. **Analytics & Reporting**
- **Response Metrics**: Average response time, resolution rate
- **Emergency Statistics**: Types, locations, frequency
- **Performance Reports**: Individual and team performance
- **Trend Analysis**: Identify emergency hotspots and patterns

#### 5. **Volunteer Coordination**
- **Volunteer List**: View all volunteers responding to emergencies
- **Volunteer Verification**: Verify volunteer credentials and skills
- **Communication**: Send updates to volunteers on scene

#### 6. **Media Management**
- **Evidence Viewer**: View photos, videos, and audio recordings
- **Download Capability**: Download media for reports and investigations
- **Timeline View**: See media in chronological order

#### 7. **Notification System**
- **Alert Sounds**: Audio alerts for new critical emergencies
- **Desktop Notifications**: Browser notifications for new emergencies
- **SMS/Email Alerts**: Optional alerts for off-duty responders

#### 8. **User Management**
- **Responder Accounts**: Create and manage responder accounts
- **Role-Based Access**: Different permissions for different responder types
- **Activity Logs**: Track responder actions and decisions

### Technical Requirements
- **Platform**: Web-based (responsive design for desktop and tablet)
- **Real-time Updates**: WebSocket connection for live data
- **Authentication**: Secure login with 2FA
- **Map Integration**: Google Maps or Mapbox
- **Performance**: Handle 100+ concurrent emergencies
- **Offline Mode**: Cache critical data for offline access

---

## Government Dashboard Requirements

### Purpose
A comprehensive analytics and oversight platform for government officials and emergency management agencies to monitor emergency response effectiveness, allocate resources, and make data-driven policy decisions.

### Key Features

#### 1. **Executive Overview**
- **KPI Dashboard**: Key performance indicators at a glance
  - Total emergencies (daily, weekly, monthly)
  - Average response time
  - Resolution rate
  - Active emergencies
  - Volunteer participation rate
- **Trend Graphs**: Visual representation of emergency trends over time
- **Geographic Heatmap**: Emergency hotspots across regions

#### 2. **Emergency Analytics**
- **Emergency Types Distribution**: Breakdown by category (Fire, Medical, Crime, etc.)
- **Time Analysis**: Peak emergency hours and days
- **Seasonal Trends**: Emergency patterns across seasons
- **Location Analysis**: Most affected areas and neighborhoods
- **Severity Distribution**: Critical vs. non-critical emergencies

#### 3. **Response Performance**
- **Response Time Metrics**:
  - Average time to acknowledge
  - Average time to dispatch
  - Average time to arrive on scene
  - Average time to resolve
- **Responder Performance**: Efficiency by department and unit
- **Success Rate**: Percentage of successfully resolved emergencies
- **False Alarm Rate**: Track and analyze false reports

#### 4. **Resource Management**
- **Resource Allocation**: View distribution of emergency services across regions
- **Capacity Planning**: Identify under-resourced areas
- **Equipment Tracking**: Monitor availability of emergency equipment
- **Personnel Management**: Track responder availability and workload

#### 5. **Community Engagement**
- **User Statistics**: Total app users, active users, growth rate
- **Volunteer Metrics**: Number of volunteers, participation rate, skills distribution
- **Community Posts**: Monitor safety awareness content
- **User Feedback**: Ratings and reviews of emergency response

#### 6. **Geographic Intelligence**
- **Regional Comparison**: Compare emergency statistics across districts
- **Risk Assessment**: Identify high-risk areas requiring additional resources
- **Infrastructure Mapping**: Overlay emergency data with infrastructure (hospitals, fire stations, police stations)
- **Route Optimization**: Analyze response routes and suggest improvements

#### 7. **Reporting & Compliance**
- **Automated Reports**: Generate daily, weekly, monthly, and annual reports
- **Custom Reports**: Create reports based on specific criteria
- **Export Functionality**: Export data in PDF, Excel, CSV formats
- **Compliance Tracking**: Monitor adherence to response time standards

#### 8. **Policy & Planning**
- **Scenario Modeling**: Simulate emergency scenarios and response strategies
- **Budget Planning**: Data-driven budget allocation recommendations
- **Training Needs**: Identify areas requiring additional training
- **Public Safety Campaigns**: Plan campaigns based on emergency trends

#### 9. **Integration & Collaboration**
- **Multi-Agency View**: Coordinate with Police, Fire, Medical, Red Cross
- **Data Sharing**: Share relevant data with partner organizations
- **Alert System**: Send public safety alerts through the app
- **Communication Hub**: Coordinate between government agencies

#### 10. **AI Insights**
- **Predictive Analytics**: Predict emergency likelihood based on historical data
- **Anomaly Detection**: Identify unusual emergency patterns
- **Recommendation Engine**: Suggest resource allocation and policy changes
- **Natural Language Reports**: AI-generated summary reports

### Technical Requirements
- **Platform**: Web-based (desktop-optimized)
- **Data Visualization**: Advanced charts, graphs, and maps
- **Authentication**: Government-grade security with SSO
- **Data Privacy**: Anonymized data for analytics
- **Performance**: Handle millions of historical records
- **API Access**: RESTful API for data integration
- **Scalability**: Support multiple government agencies and departments

### User Roles
1. **National Emergency Management**: Full access to all data and features
2. **Regional Coordinators**: Access to specific region data
3. **Department Heads**: Department-specific analytics
4. **Policy Makers**: Read-only access to reports and insights
5. **Auditors**: Access to compliance and performance reports

---

## API Integration

### Key Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

#### Emergency Management
- `POST /emergency` - Create emergency
- `GET /emergency` - Get all emergencies
- `GET /emergency/nearby` - Get nearby emergencies
- `GET /emergency/:id` - Get emergency by ID
- `PUT /emergency/:id` - Update emergency
- `DELETE /emergency/:id` - Delete emergency
- `POST /emergency/with-media` - Create emergency with media files
- `POST /emergency/:id/volunteer` - Volunteer for emergency
- `DELETE /emergency/:emergencyId/volunteers/:volunteerId` - Remove volunteer

#### Community Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/like` - Like post
- `POST /posts/:id/unlike` - Unlike post
- `GET /posts/:id/comments` - Get post comments
- `POST /posts/:id/comments` - Create comment

#### Notifications
- `GET /notifications` - Get all notifications
- `PATCH /notifications/:id/read` - Mark notification as read (optional - handled locally)
- `PATCH /notifications/read-all` - Mark all as read (optional - handled locally)
- `DELETE /notifications/:id` - Delete notification (optional - handled locally)

---

## Future Enhancements

### Mobile App
1. **Offline Mode**: Cache emergencies and sync when online
2. **Video Calls**: Enable video communication with responders
3. **Medical Records**: Store and share medical information in emergencies
4. **Emergency Drills**: Practice emergency scenarios
5. **Gamification**: Reward active volunteers and community members
6. **Weather Integration**: Alert users about weather-related emergencies
7. **Traffic Integration**: Optimize routes based on real-time traffic
8. **Multi-device Sync**: Sync data across multiple devices

### Responder Dashboard
1. **Predictive Dispatch**: AI-powered dispatch recommendations
2. **Drone Integration**: View drone footage of emergency scenes
3. **Body Camera Integration**: Stream responder body camera footage
4. **Voice Commands**: Hands-free dashboard control
5. **AR Navigation**: Augmented reality navigation for responders

### Government Dashboard
1. **Machine Learning Models**: Advanced predictive analytics
2. **Social Media Integration**: Monitor social media for emergency signals
3. **Public API**: Allow third-party integrations
4. **Mobile App**: Government dashboard mobile version
5. **International Collaboration**: Share data with neighboring countries

---

## Security & Privacy

### Data Protection
- **Encryption**: End-to-end encryption for sensitive data
- **Anonymization**: Personal data anonymized in analytics
- **GDPR Compliance**: Follow data protection regulations
- **Secure Storage**: Encrypted database and file storage

### User Privacy
- **Consent Management**: Users control data sharing
- **Data Retention**: Automatic deletion of old data
- **Privacy Settings**: Granular privacy controls
- **Audit Logs**: Track data access and modifications

---

## Deployment

### Mobile App
- **iOS**: App Store (pending)
- **Android**: Google Play Store (pending)
- **Updates**: Over-the-air updates via Expo

### Backend
- **Hosting**: Cloud hosting (AWS, Azure, or Google Cloud)
- **Database**: Managed PostgreSQL
- **CDN**: CloudFlare for media files
- **Monitoring**: Application performance monitoring

### Dashboards
- **Hosting**: Web hosting with SSL
- **CDN**: Global content delivery
- **Backup**: Automated daily backups
- **Disaster Recovery**: Multi-region redundancy

---

## Support & Maintenance

### User Support
- **In-App Help**: Contextual help and tutorials
- **FAQ Section**: Common questions and answers
- **Support Chat**: Real-time support chat
- **Emergency Hotline**: 24/7 phone support

### Technical Support
- **Bug Reporting**: In-app bug reporting
- **Version Updates**: Regular feature and security updates
- **Performance Monitoring**: Real-time app performance tracking
- **User Feedback**: Continuous improvement based on feedback

---

## Contact & Contributors

**Project**: INKINGI Rescue  
**Version**: 1.0 Alpha  
**Last Updated**: October 2025  
**Supported Languages**: English, French, Kinyarwanda, Kiswahili

---

## License

This project is proprietary software developed for emergency response in Rwanda.

---

**Note**: This document provides a comprehensive overview of the INKINGI Rescue project. For technical implementation details, refer to the codebase documentation and API specifications.

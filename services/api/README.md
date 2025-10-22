# API Services Documentation

This directory contains the axios configuration and API service utilities for the INKINGI Rescue app.

## 📁 File Structure

```
services/api/
├── axios.instance.ts   # Configured axios instance with interceptors
├── api.service.ts      # API service methods and endpoint wrappers
├── index.ts           # Central export point
└── README.md          # This file
```

## 🚀 Quick Start

### 1. Configure Your API Base URL

Update the `BASE_URL` in `config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'  // Your local dev server
    : 'https://your-api.com/api',  // Your production server
};
```

### 2. Using the API Service

Import the API methods you need:

```typescript
import { authApi, emergencyApi, sosApi } from '@/services/api';

// Login example
const handleLogin = async () => {
  const response = await authApi.login(email, password);
  
  if (response.success) {
    console.log('User:', response.data);
    // Save token, navigate, etc.
  } else {
    console.error('Error:', response.error);
  }
};

// Report emergency example
const reportEmergency = async () => {
  const response = await emergencyApi.report({
    type: 'medical',
    description: 'Need immediate help',
    location: { lat: -1.9441, lng: 30.0619 },
  });
  
  if (response.success) {
    console.log('Emergency reported:', response.data);
  }
};
```

## 📚 Available API Methods

### Authentication (`authApi`)
- `login(email, password)` - User login
- `register(data)` - User registration
- `logout()` - User logout

### User (`userApi`)
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update user profile

### Emergency (`emergencyApi`)
- `report(data)` - Report new emergency
- `getAll(params)` - Get all emergencies
- `getById(id)` - Get emergency by ID
- `update(id, data)` - Update emergency

### SOS (`sosApi`)
- `create(data)` - Create SOS alert
- `getMySos()` - Get my SOS reports
- `getNearby(params)` - Get nearby SOS alerts
- `volunteer(id)` - Volunteer for SOS

### Emergency Contacts (`contactsApi`)
- `getAll()` - Get all contacts
- `add(data)` - Add new contact
- `update(id, data)` - Update contact
- `delete(id)` - Delete contact

### Panic Buttons (`panicButtonsApi`)
- `getAll()` - Get all panic buttons
- `create(data)` - Create panic button
- `trigger(id)` - Trigger panic button

### Community (`communityApi`)
- `getPosts(params)` - Get community posts
- `createPost(data)` - Create new post

### Notifications (`notificationsApi`)
- `getAll()` - Get all notifications
- `markAsRead(id)` - Mark notification as read

## 🔧 Advanced Usage

### Direct Axios Instance

For custom requests, use the axios instance directly:

```typescript
import { axiosInstance } from '@/services/api';

const customRequest = async () => {
  const response = await axiosInstance.get('/custom-endpoint');
  return response.data;
};
```

### Generic API Service

Use the generic methods for flexibility:

```typescript
import { apiService } from '@/services/api';

// GET request
const data = await apiService.get('/endpoint', { param: 'value' });

// POST request
const result = await apiService.post('/endpoint', { data: 'value' });

// File upload
const formData = new FormData();
formData.append('file', file);
const upload = await apiService.upload('/upload', formData);
```

## 🔐 Authentication

The axios instance automatically:
- Adds the auth token to all requests
- Refreshes expired tokens
- Handles 401 errors
- Clears tokens on refresh failure

Tokens are stored in AsyncStorage:
- `authToken` - Access token
- `refreshToken` - Refresh token
- `user` - User data

## 🐛 Debugging

In development mode (`__DEV__`), all requests and responses are logged to the console:

```
📤 API Request: { method: 'POST', url: '/auth/login', data: {...} }
📥 API Response: { status: 200, url: '/auth/login', data: {...} }
❌ API Error: { status: 401, url: '/user/profile', message: 'Unauthorized' }
```

## 📝 Response Format

All API methods return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

Success response:
```typescript
{ success: true, data: {...} }
```

Error response:
```typescript
{ success: false, error: 'Error message', message: 'Error message' }
```

## 🎯 Best Practices

1. **Always check `response.success`** before using data
2. **Handle errors gracefully** with user-friendly messages
3. **Use TypeScript types** for better type safety
4. **Update API_CONFIG** endpoints to match your backend
5. **Test in development** before deploying to production

## 🔄 Token Refresh Flow

1. Request fails with 401 Unauthorized
2. Interceptor catches the error
3. Attempts to refresh token using refresh token
4. If successful, retries original request
5. If failed, clears tokens and redirects to login

## 📌 Notes

- The axios instance is configured with a 30-second timeout
- All requests include `Content-Type: application/json` header
- File uploads automatically set `Content-Type: multipart/form-data`
- The base URL switches between dev and production based on `__DEV__`

/**
 * API Configuration
 *
 * This file contains the base configuration for API endpoints.
 * Update the BASE_URL to match your backend server URL.
 */

// Set to true to use mock authentication (no backend required)
export const USE_MOCK_AUTH = false;

// TODO: Replace with your actual backend API URL
export const API_CONFIG = {
  // Development
  BASE_URL: __DEV__
    ? "http://192.168.137.1:3000" // Local development server
    : "https://your-production-api.com", // Production server

  TIMEOUT: 120000, // 2 minutes

  // API Endpoints
  ENDPOINTS: {
    // Health
    HEALTH_CHECK: "/",

    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/signup",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    GET_CURRENT_USER: "/auth/me",

    // Users
    GET_ALL_USERS: "/users",
    GET_USER_BY_ID: "/users/:id",
    UPDATE_USER: "/users/:id",
    DELETE_USER: "/users/:id",
    GET_USER_STATS: "/users/:id/stats",

    // Emergency
    CREATE_EMERGENCY: "/emergency",
    GET_ALL_EMERGENCIES: "/emergency",
    GET_NEARBY_EMERGENCIES: "/emergency/nearby",
    GET_EMERGENCY_BY_ID: "/emergency/:id",
    UPDATE_EMERGENCY: "/emergency/:id",
    DELETE_EMERGENCY: "/emergency/:id",
    CREATE_EMERGENCY_WITH_MEDIA: "/emergency/with-media",
    UPDATE_EMERGENCY_STATUS: "/emergency/:id/status",
    ASSIGN_RESPONDER: "/emergency/:id/assign",
    ADD_EMERGENCY_UPDATE: "/emergency/:id/updates",
    VOLUNTEER_FOR_EMERGENCY: "/emergency/:id/volunteer",
    DELETE_VOLUNTEER: "/emergency/:emergencyId/volunteers/:volunteerId",
  },
};

// Helper function to replace URL parameters
export const buildUrl = (
  endpoint: string,
  params: Record<string, string | number> = {}
): string => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, String(params[key]));
  });
  return url;
};

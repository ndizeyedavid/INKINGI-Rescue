/**
 * Example Usage of API Services
 * 
 * This file demonstrates how to use the API services in your React Native components.
 * Copy these examples into your actual components as needed.
 */

import { useState } from 'react';
import { authApi, emergencyApi, sosApi, userApi, contactsApi } from '@/services/api';

// ============================================
// EXAMPLE 1: Login with Error Handling
// ============================================
export const LoginExample = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    const response = await authApi.login(email, password);

    if (response.success) {
      // Login successful
      console.log('User logged in:', response.data);
      // Navigate to home screen, save user data, etc.
    } else {
      // Login failed
      setError(response.error || 'Login failed');
      console.error('Login error:', response.error);
    }

    setLoading(false);
  };

  return { handleLogin, loading, error };
};

// ============================================
// EXAMPLE 2: Register New User
// ============================================
export const RegisterExample = () => {
  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    const response = await authApi.register({
      name,
      email,
      password,
      phoneNumber,
    });

    if (response.success) {
      console.log('Registration successful:', response.data);
      // Navigate to login or home
    } else {
      console.error('Registration failed:', response.error);
      // Show error to user
    }
  };

  return { handleRegister };
};

// ============================================
// EXAMPLE 3: Fetch and Display User Profile
// ============================================
export const ProfileExample = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);

    const response = await userApi.getProfile();

    if (response.success) {
      setProfile(response.data);
    } else {
      console.error('Failed to fetch profile:', response.error);
    }

    setLoading(false);
  };

  const updateProfile = async (data: any) => {
    const response = await userApi.updateProfile(data);

    if (response.success) {
      console.log('Profile updated:', response.data);
      // Refresh profile
      fetchProfile();
    } else {
      console.error('Update failed:', response.error);
    }
  };

  return { profile, loading, fetchProfile, updateProfile };
};

// ============================================
// EXAMPLE 4: Report Emergency
// ============================================
export const ReportEmergencyExample = () => {
  const reportEmergency = async (
    type: string,
    description: string,
    location: { latitude: number; longitude: number }
  ) => {
    const response = await emergencyApi.report({
      type,
      description,
      location,
      timestamp: new Date().toISOString(),
    });

    if (response.success) {
      console.log('Emergency reported:', response.data);
      // Show success message, navigate to emergency details
      return response.data;
    } else {
      console.error('Failed to report emergency:', response.error);
      // Show error message
      return null;
    }
  };

  return { reportEmergency };
};

// ============================================
// EXAMPLE 5: Fetch Emergencies with Pagination
// ============================================
export const EmergenciesListExample = () => {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchEmergencies = async (pageNum: number = 1) => {
    setLoading(true);

    const response = await emergencyApi.getAll({
      page: pageNum,
      limit: 10,
      status: 'active', // Filter by status
    });

    if (response.success) {
      if (pageNum === 1) {
        setEmergencies(response.data);
      } else {
        setEmergencies(prev => [...prev, ...response.data]);
      }
      setPage(pageNum);
    } else {
      console.error('Failed to fetch emergencies:', response.error);
    }

    setLoading(false);
  };

  const loadMore = () => {
    fetchEmergencies(page + 1);
  };

  return { emergencies, loading, fetchEmergencies, loadMore };
};

// ============================================
// EXAMPLE 6: Create SOS Alert
// ============================================
export const SOSExample = () => {
  const createSOS = async (
    emergencyType: string,
    location: { latitude: number; longitude: number },
    description?: string
  ) => {
    const response = await sosApi.create({
      emergencyType,
      location,
      description,
      timestamp: new Date().toISOString(),
    });

    if (response.success) {
      console.log('SOS created:', response.data);
      // Notify emergency contacts, show confirmation
      return response.data;
    } else {
      console.error('Failed to create SOS:', response.error);
      return null;
    }
  };

  const volunteerForSOS = async (sosId: string) => {
    const response = await sosApi.volunteer(sosId);

    if (response.success) {
      console.log('Volunteered successfully');
      return true;
    } else {
      console.error('Failed to volunteer:', response.error);
      return false;
    }
  };

  return { createSOS, volunteerForSOS };
};

// ============================================
// EXAMPLE 7: Manage Emergency Contacts
// ============================================
export const EmergencyContactsExample = () => {
  const [contacts, setContacts] = useState<any[]>([]);

  const fetchContacts = async () => {
    const response = await contactsApi.getAll();

    if (response.success) {
      setContacts(response.data);
    } else {
      console.error('Failed to fetch contacts:', response.error);
    }
  };

  const addContact = async (
    name: string,
    phoneNumber: string,
    relationship: string
  ) => {
    const response = await contactsApi.add({
      name,
      phoneNumber,
      relationship,
    });

    if (response.success) {
      console.log('Contact added:', response.data);
      // Refresh contacts list
      fetchContacts();
    } else {
      console.error('Failed to add contact:', response.error);
    }
  };

  const deleteContact = async (contactId: string) => {
    const response = await contactsApi.delete(contactId);

    if (response.success) {
      console.log('Contact deleted');
      // Refresh contacts list
      fetchContacts();
    } else {
      console.error('Failed to delete contact:', response.error);
    }
  };

  return { contacts, fetchContacts, addContact, deleteContact };
};

// ============================================
// EXAMPLE 8: Using in a React Component
// ============================================
/*
import React, { useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { emergencyApi } from '@/services/api';

export default function EmergenciesScreen() {
  const [emergencies, setEmergencies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    setLoading(true);
    const response = await emergencyApi.getAll();
    
    if (response.success) {
      setEmergencies(response.data);
    }
    
    setLoading(false);
  };

  return (
    <View>
      <FlatList
        data={emergencies}
        renderItem={({ item }) => (
          <Text>{item.description}</Text>
        )}
        refreshing={loading}
        onRefresh={loadEmergencies}
      />
    </View>
  );
}
*/

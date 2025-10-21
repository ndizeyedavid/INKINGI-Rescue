'use client';

import React from 'react';
import { Settings, User, Bell, Shield, LogOut } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div style={{ background: '#f9f9f9' }} className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Profile Information</h2>
        <div className="flex items-center space-x-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          <div className="flex-grow">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-800">--</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-800">--</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-800">--</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone number</label>
                <p className="text-gray-800">--</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md">Edit</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md">Save Changes</button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Account Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <p className="text-gray-800">--</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Password</label>
            <p className="text-gray-800">********</p>
            <button className="text-orange-500">Change Password</button>
          </div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-500">Two-Factor Authentication</label>
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Account type</label>
            <p className="text-gray-800">--</p>
          </div>
          <button className="text-red-500 text-sm">Delete account</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Emergency alerts</span>
            <div className="w-12 h-6 bg-orange-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span>New reports</span>
            <div className="w-12 h-6 bg-orange-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span>Team updates</span>
            <div className="w-12 h-6 bg-orange-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span>Community posts</span>
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span>System messages</span>
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">System Preferences</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-500">Language</label>
            <p className="text-gray-800">--</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Theme</label>
            <div className="flex items-center space-x-2">
              <span>Light</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              <span>Dark</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Default map view</label>
            <p className="text-gray-800">--</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Data refresh rate</label>
            <p className="text-gray-800">--</p>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Privacy & Security</h2>
        <div className="space-y-4">
            <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-md">View Privacy Policy</button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md">Manage Access Permissions</button>
          <div>
            <label className="block text-sm font-medium text-gray-500">Data Usage Settings</label>
            <p className="text-gray-800">--</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="flex justify-center">
        <button className="bg-orange-500 text-white px-8 py-3 rounded-md">Log Out</button>
      </div>
    </div>
  );
};

export default SettingsPage;

'use client';

import React from 'react';

const NotificationsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Notifications</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Placeholder Notification */}
        <div className="border-b border-border pb-4">
          <p className="text-text">-- reported an emergency at --</p>
        </div>
        <div className="border-b border-border pb-4">
          <p className="text-text">-- new responder added to team --</p>
        </div>
        {/* Add more placeholder notifications as needed */}
      </div>
    </div>
  );
};

export default NotificationsPage;

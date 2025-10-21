'use client';

import React from 'react';

const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'User', dateJoined: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', dateJoined: '2023-02-20' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Admin', dateJoined: '2023-03-10' },
  { id: 4, name: 'Mary Johnson', email: 'mary.johnson@example.com', role: 'User', dateJoined: '2023-04-05' },
  { id: 5, name: 'Chris Lee', email: 'chris.lee@example.com', role: 'User', dateJoined: '2023-05-12' },
];

const UsersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Users</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-border">
                <td className="py-4">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;

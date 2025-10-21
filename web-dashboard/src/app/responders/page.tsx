'use client';

import React from 'react';

const responders = [
  { id: 1, name: 'Team Alpha', status: 'Available', location: 'Kigali' },
  { id: 2, name: 'Team Bravo', status: 'On-site', location: 'Remera' },
  { id: 3, name: 'Team Charlie', status: 'Available', location: 'Kiyovu' },
  { id: 4, name: 'Team Delta', status: 'Unavailable', location: 'Kicukiro' },
  { id: 5, name: 'Team Echo', status: 'Available', location: 'Gikondo' },
];

const RespondersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Responders</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4">Team</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {responders.map(responder => (
              <tr key={responder.id} className="border-b border-border">
                <td className="py-4">{responder.name}</td>
                <td>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-semibold 
                      ${responder.status === 'Available' ? 'bg-green-100 text-green-800' : 
                        responder.status === 'On-site' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                    {responder.status}
                  </span>
                </td>
                <td>{responder.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RespondersPage;

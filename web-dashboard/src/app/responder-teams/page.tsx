'use client';

import React from 'react';

const ResponderTeamsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Responder Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder Responder Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-text mb-2">Team Name: --</h2>
          <p className="text-textLight mb-2">Status: --</p>
          <p className="text-textLight">Contact: --</p>
        </div>
        {/* Add more placeholder cards as needed */}
      </div>
    </div>
  );
};

export default ResponderTeamsPage;

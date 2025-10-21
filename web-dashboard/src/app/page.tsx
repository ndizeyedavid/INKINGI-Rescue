'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@/components/Chart'), { 
  ssr: false 
});

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false 
});

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-textLight mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-text">1,257</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-textLight mb-2">Reports Submitted</h2>
          <p className="text-3xl font-bold text-text">342</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-textLight mb-2">Responders Online</h2>
          <p className="text-3xl font-bold text-text">23</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-textLight mb-2">Resolved Cases</h2>
          <p className="text-3xl font-bold text-text">298</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-textLight mb-4">Reports per Day</h2>
          <div className="h-64 bg-backgroundLight rounded-lg">
            <Chart />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-textLight mb-4">Incident Locations</h2>
          <div className="h-64 bg-backgroundLight rounded-lg">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

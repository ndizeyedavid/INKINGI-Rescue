'use client';

import React from 'react';

const EmergencyReportsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">Emergency Reports</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryHover transition-all">
          View Details
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-end mb-4">
            {/* Placeholder for filter dropdown */}
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-textLight">
              <th className="pb-2">Report ID</th>
              <th>Reporter</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
            </tr>
            {/* Add more placeholder rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmergencyReportsPage;

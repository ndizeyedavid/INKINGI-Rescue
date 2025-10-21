'use client';

import React from 'react';

const reports = [
  { id: 1, type: 'Fire', location: 'Kigali', status: 'Resolved', date: '2023-10-26' },
  { id: 2, type: 'Flood', location: 'Remera', status: 'In Progress', date: '2023-10-25' },
  { id: 3, type: 'Accident', location: 'Kiyovu', status: 'New', date: '2023-10-24' },
  { id: 4, type: 'Fire', location: 'Kicukiro', status: 'Resolved', date: '2023-10-23' },
  { id: 5, type: 'Medical', location: 'Gikondo', status: 'New', date: '2023-10-22' },
];

const ReportsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Reports</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4">Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="border-b border-border">
                <td className="py-4">{report.type}</td>
                <td>{report.location}</td>
                <td>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-semibold 
                      ${report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                        report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                    {report.status}
                  </span>
                </td>
                <td>{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;

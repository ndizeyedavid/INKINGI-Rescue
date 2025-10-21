'use client';

import React from 'react';

const CommunityPostsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Community Posts</h1>
      <div className="space-y-6">
        {/* Placeholder Post Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-text mb-2">Post Title: --</h2>
          <p className="text-textLight mb-4">Posted By: -- | Category: --</p>
          <p className="text-text mb-4">---</p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryHover transition-all">
            View Post
          </button>
        </div>
        {/* Add more placeholder cards as needed */}
      </div>
    </div>
  );
};

export default CommunityPostsPage;

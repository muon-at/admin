import React, { useState } from 'react'

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white shadow-lg p-6">
        <h1 className="text-2xl font-bold">🧠 Second Brain</h1>
        <p className="text-sm text-gray-400 mt-1">Dashboard</p>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">🧠 Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Dashboard loading... ✨</p>
            <p className="text-sm text-gray-500 mt-2">Connected to Supabase at: {process.env.REACT_APP_SUPABASE_URL}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

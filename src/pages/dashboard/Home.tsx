import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    tasksToday: 0,
    tasksCompleted: 0,
    adsActive: 0,
    filesIndexed: 0,
  })
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Get today's tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .limit(5)

      setRecentTasks(tasksData || [])
      setStats({
        tasksToday: tasksData?.length || 0,
        tasksCompleted: 0,
        adsActive: 0,
        filesIndexed: 0,
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">⏳ Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">🏠 Home</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your daily overview.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon="✅" label="Tasks Pending" value={stats.tasksToday} />
        <StatCard icon="🎯" label="Completed" value={stats.tasksCompleted} />
        <StatCard icon="📊" label="Active Ads" value={stats.adsActive} />
        <StatCard icon="📁" label="Files" value={stats.filesIndexed} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Today's Tasks</h2>
        {recentTasks.length > 0 ? (
          <ul className="space-y-3">
            {recentTasks.map((task) => (
              <li key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100">
                <input type="checkbox" className="mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {task.category}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Priority: {task.priority}/10
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No tasks today!</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-3xl">{icon}</p>
      <p className="text-gray-600 text-sm mt-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

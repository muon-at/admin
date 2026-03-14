import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', category: 'daily', priority: 5 })

  useEffect(() => { loadTasks() }, [filter])

  async function loadTasks() {
    try {
      setLoading(true)
      let query = supabase.from('tasks').select('*')
      if (filter !== 'all') query = query.eq('status', filter)
      const { data } = await query.order('priority', { ascending: false })
      setTasks(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === 'pending' ? 'in_progress' : currentStatus === 'in_progress' ? 'completed' : 'pending'
    try {
      await supabase.from('tasks').update({ status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }).eq('id', taskId)
      loadTasks()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async function addTask(e: any) {
    e.preventDefault()
    if (!formData.title.trim()) return
    try {
      const { data } = await supabase.from('tasks').insert({ ...formData, status: 'pending', created_by: 'sebastian' }).select()
      if (data) {
        setTasks([data[0], ...tasks])
        setFormData({ title: '', description: '', category: 'daily', priority: 5 })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const stats = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">✅ Task Manager</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? '✕ Close' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addTask} className="bg-white rounded-lg shadow p-6 mb-8">
          <input
            type="text"
            placeholder="Task title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-16"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="strategic">Strategic</option>
              <option value="automation">Automation</option>
              <option value="monitoring">Monitoring</option>
            </select>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              placeholder="Priority (1-10)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Task
          </button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="In Progress" value={stats.inProgress} color="blue" />
        <StatCard label="Completed" value={stats.completed} color="green" />
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 rounded-lg border-l-4 bg-white hover:shadow-lg transition"
            style={{ borderColor: task.status === 'completed' ? '#10b981' : task.status === 'in_progress' ? '#3b82f6' : '#f59e0b' }}>
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStatus(task.id, task.status)}
                className="mt-1 w-6 h-6 rounded border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center"
              >
                {task.status === 'completed' && <span className="text-green-600">✓</span>}
              </button>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{task.category}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Priority: {task.priority}/10</span>
                  {task.execute_automatically && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🤖 Auto</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: any = {
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
  }
  return (
    <div className={`rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

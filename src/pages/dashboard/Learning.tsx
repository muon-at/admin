import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function LearningPage() {
  const [learnings, setLearnings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', summary: '', details: '' })

  useEffect(() => { loadLearnings() }, [])

  async function loadLearnings() {
    try {
      setLoading(true)
      const { data, error: err } = await supabase.from('marketing_learnings').select('*').order('created_at', { ascending: false })
      if (err) {
        console.error('Error:', err)
        setError(err.message)
        setLearnings([])
      } else {
        setLearnings(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addLearning(e: any) {
    e.preventDefault()
    if (!formData.title.trim()) return
    try {
      const { data } = await supabase.from('marketing_learnings').insert(formData).select()
      if (data) {
        setLearnings([data[0], ...learnings])
        setFormData({ title: '', summary: '', details: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filtered = learnings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    (l.summary && l.summary.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">💡 Learning Center</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? '✕ Close' : '+ Add Learning'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addLearning} className="bg-white rounded-lg shadow p-6 mb-8">
          <input
            type="text"
            placeholder="Learning title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Summary..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
          <textarea
            placeholder="Details..."
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Learning
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search learnings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
      />

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((learning) => (
            <div key={learning.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{learning.title}</h3>
              <p className="text-gray-600 mb-4">{learning.summary}</p>
              {learning.details && <div className="bg-gray-50 p-4 rounded mb-4 text-sm text-gray-700">{learning.details}</div>}
              <div className="flex flex-wrap gap-2">
                {learning.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">{new Date(learning.created_at).toLocaleDateString('nb-NO')}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 p-8">No learnings found.</div>
        )}
      </div>
    </div>
  )
}

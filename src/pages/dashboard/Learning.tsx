import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.REACT_APP_SUPABASE_URL || '',
  import.meta.env.REACT_APP_SUPABASE_KEY || ''
)

export default function LearningPage() {
  const [learnings, setLearnings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadLearnings() }, [])

  async function loadLearnings() {
    try {
      setLoading(true)
      const { data } = await supabase.from('marketing_learnings').select('*').order('created_at', { ascending: false })
      setLearnings(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = learnings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    (l.summary && l.summary.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">💡 Learning Center</h1>

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

import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MemoryPage() {
  const [memories, setMemories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMemories() }, [])

  async function loadMemories() {
    try {
      setLoading(true)
      const { data } = await supabase.from('sebastian_memory').select('*').order('created_at', { ascending: false })
      setMemories(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteMemory(id: string) {
    if (!confirm('Delete this memory?')) return
    try {
      await supabase.from('sebastian_memory').delete().eq('id', id)
      setMemories(memories.filter((m) => m.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filtered = memories.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.content && m.content.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">🧠 Memory Bank</h1>

      <input
        type="text"
        placeholder="Search memories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
      />

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((memory) => (
            <div key={memory.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{memory.title}</h3>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="text-sm px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
              {memory.content && <p className="text-gray-700 mb-3">{memory.content}</p>}
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded">{memory.category}</span>
                <span className="text-xs text-gray-500">{new Date(memory.created_at).toLocaleDateString('nb-NO')}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 p-8">No memories found.</div>
        )}
      </div>
    </div>
  )
}

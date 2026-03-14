import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.REACT_APP_SUPABASE_URL || '',
  import.meta.env.REACT_APP_SUPABASE_KEY || ''
)

export default function DropoffPage() {
  const [digests, setDigests] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDigests() }, [])

  async function loadDigests() {
    try {
      setLoading(true)
      const { data } = await supabase.from('daily_digest').select('*').order('date', { ascending: false }).limit(30)
      setDigests(data || [])
      if (data && data.length > 0) setSelectedDate(data[0].date)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const selected = digests.find((d) => d.date === selectedDate)

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">📝 Nightly Dropoff Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Digests</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {digests.map((digest) => (
              <button
                key={digest.date}
                onClick={() => setSelectedDate(digest.date)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  selectedDate === digest.date
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="font-medium">{new Date(digest.date).toLocaleDateString('nb-NO', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                {digest.sent_to_user && <div className="text-xs opacity-75">✓ Sent</div>}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="space-y-6">
              {selected.summary && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Summary</h2>
                  <p className="text-gray-700">{selected.summary}</p>
                </div>
              )}

              {selected.achievements && selected.achievements.length > 0 && (
                <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
                  <h2 className="text-2xl font-bold text-green-900 mb-4">🎉 Achievements</h2>
                  <ul className="space-y-2">
                    {selected.achievements.map((a: string, i: number) => (
                      <li key={i} className="flex gap-3"><span className="text-green-600">✓</span><span className="text-green-900">{a}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.key_learnings && selected.key_learnings.length > 0 && (
                <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">💡 Key Learnings</h2>
                  <ul className="space-y-2">
                    {selected.key_learnings.map((l: string, i: number) => (
                      <li key={i} className="flex gap-3"><span className="text-blue-600">•</span><span className="text-blue-900">{l}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.tomorrow_focus && selected.tomorrow_focus.length > 0 && (
                <div className="bg-orange-50 rounded-lg shadow p-6 border-l-4 border-orange-500">
                  <h2 className="text-2xl font-bold text-orange-900 mb-4">🎯 Tomorrow Focus</h2>
                  <ul className="space-y-2">
                    {selected.tomorrow_focus.map((f: string, i: number) => (
                      <li key={i} className="flex gap-3"><span className="text-orange-600">→</span><span className="text-orange-900">{f}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.metrics && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center"><p className="text-gray-600 text-sm">Tasks Done</p><p className="text-2xl font-bold text-gray-900 mt-1">{selected.metrics.tasks_completed || 0}</p></div>
                    <div className="text-center"><p className="text-gray-600 text-sm">New Ads</p><p className="text-2xl font-bold text-gray-900 mt-1">{selected.metrics.new_ads_count || 0}</p></div>
                    <div className="text-center"><p className="text-gray-600 text-sm">Learnings</p><p className="text-2xl font-bold text-gray-900 mt-1">{selected.metrics.new_learnings_count || 0}</p></div>
                    <div className="text-center"><p className="text-gray-600 text-sm">Files</p><p className="text-2xl font-bold text-gray-900 mt-1">{selected.metrics.files_uploaded || 0}</p></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">No digests available yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.REACT_APP_SUPABASE_URL || '',
  import.meta.env.REACT_APP_SUPABASE_KEY || ''
)

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAds()
  }, [filter])

  async function loadAds() {
    try {
      setLoading(true)
      let query = supabase.from('ads_campaigns').select('*')
      if (filter !== 'all') query = query.eq('status', filter)
      const { data } = await query.order('created_at', { ascending: false })
      setAds(data || [])
    } catch (error) {
      console.error('Error loading ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const metrics = {
    total: ads.length,
    active: ads.filter((a) => a.status === 'active').length,
    avgCtr: ads.length > 0 ? (ads.reduce((sum, a) => sum + (a.ctr || 0), 0) / ads.length).toFixed(2) : 0,
    avgCps: ads.length > 0 ? (ads.reduce((sum, a) => sum + (a.cps || 0), 0) / ads.length).toFixed(0) : 0,
  }

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">📊 Ads Campaign Tracker</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Ads" value={metrics.total} />
        <MetricCard label="Active" value={metrics.active} />
        <MetricCard label="Avg CTR" value={`${metrics.avgCtr}%`} />
        <MetricCard label="Avg CPS" value={`${metrics.avgCps} kr`} />
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'active', 'paused', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {ads.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">CTR</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">CPS</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ad.name || 'Unnamed'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ad.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ad.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ad.ctr || '-'}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ad.cps || '-'} kr</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ad.score || 0}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-600">No ads found.</div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  )
}

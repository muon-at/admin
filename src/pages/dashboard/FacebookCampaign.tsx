import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function FacebookCampaignPage() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => { loadMetrics() }, [])

  async function loadMetrics() {
    try {
      setLoading(true)
      const { data } = await supabase
        .from('facebook_daily_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30)
      
      setMetrics(data || [])
      if (data && data.length > 0) setSelectedDate(data[0].date)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const selected = metrics.find((m) => m.date === selectedDate)
  const totalMetrics = metrics.length > 0 ? {
    spend: metrics.reduce((sum, m) => sum + (m.spend_kr || 0), 0),
    leads: metrics.reduce((sum, m) => sum + (m.leads || 0), 0),
    clicks: metrics.reduce((sum, m) => sum + (m.clicks || 0), 0),
    impressions: metrics.reduce((sum, m) => sum + (m.impressions || 0), 0),
  } : { spend: 0, leads: 0, clicks: 0, impressions: 0 }

  const avgCpl = totalMetrics.leads > 0 ? totalMetrics.spend / totalMetrics.leads : 0
  const avgCpc = totalMetrics.clicks > 0 ? totalMetrics.spend / totalMetrics.clicks : 0
  const ctr = totalMetrics.impressions > 0 ? ((totalMetrics.clicks / totalMetrics.impressions) * 100) : 0

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">📊 Facebook Heat Pump Campaign</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-sm opacity-90">Total Spend</p>
          <p className="text-3xl font-bold">{totalMetrics.spend.toFixed(0)} kr</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-sm opacity-90">Total Leads</p>
          <p className="text-3xl font-bold">{totalMetrics.leads}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-sm opacity-90">Avg Cost/Lead</p>
          <p className="text-3xl font-bold">{avgCpl.toFixed(0)} kr</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-sm opacity-90">CTR</p>
          <p className="text-3xl font-bold">{ctr.toFixed(2)}%</p>
        </div>
      </div>

      {/* Daily Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Daily Metrics</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {metrics.map((metric) => (
              <button
                key={metric.date}
                onClick={() => setSelectedDate(metric.date)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  selectedDate === metric.date
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="font-medium">{new Date(metric.date).toLocaleDateString('nb-NO')}</div>
                <div className="text-xs opacity-75">{metric.leads} leads · {metric.spend_kr.toFixed(0)} kr</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="space-y-6">
              {/* Daily Stats */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {new Date(selected.date).toLocaleDateString('nb-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm">Spend</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.spend_kr.toFixed(2)} kr</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm">Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.leads}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-gray-600 text-sm">Impressions</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.impressions}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-gray-600 text-sm">Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.clicks}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Cost/Lead</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.cpl.toFixed(0)} kr</p>
                    {selected.cpl > 90 && <p className="text-xs text-red-600 mt-1">⚠️ Over threshold!</p>}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Cost/Click</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.cpc.toFixed(2)} kr</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">CTR</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selected.impressions > 0 ? ((selected.clicks / selected.impressions) * 100).toFixed(2) : '0'}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selected.auto_paused ? '⏸️ Paused' : '🟢 Active'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Notes */}
              <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-3">📈 Performance Notes</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Cost per lead: {selected.cpl.toFixed(0)} kr (target: &lt;80-90 kr)</li>
                  <li>✓ Click-through rate: {selected.impressions > 0 ? ((selected.clicks / selected.impressions) * 100).toFixed(2) : '0'}% (good: &gt;2%)</li>
                  <li>✓ Daily budget used: {((selected.spend_kr / 300) * 100).toFixed(0)}% (target: 100%)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              No data yet. Campaign metrics will appear here after first reporting cycle.
            </div>
          )}
        </div>
      </div>

      {/* Auto-Report Note */}
      <div className="mt-8 bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
        <p className="text-sm text-gray-600">
          📊 <strong>Auto-reporting:</strong> Campaign metrics update every 6 hours (00:10, 06:10, 12:10, 18:10 UTC+1)
        </p>
      </div>
    </div>
  )
}

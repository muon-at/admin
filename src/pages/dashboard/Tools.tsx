import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.REACT_APP_SUPABASE_URL || '',
  import.meta.env.REACT_APP_SUPABASE_KEY || ''
)

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([])
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTools() }, [])

  async function loadTools() {
    try {
      setLoading(true)
      const { data } = await supabase.from('tools_config').select('*').order('tool_type', { ascending: true })
      setTools(data || [])
      if (data && data.length > 0) setSelectedTool(data[0].id)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const selected = tools.find((t) => t.id === selectedTool)
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.tool_type]) acc[tool.tool_type] = []
    acc[tool.tool_type].push(tool)
    return acc
  }, {} as Record<string, any[]>)

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">🔧 Tools & Credentials</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {Object.entries(groupedTools).map(([type, toolsOfType]) => (
            <div key={type}>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{type}</h3>
              <div className="space-y-2">
                {toolsOfType.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedTool === tool.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{tool.tool_name}</div>
                    {!tool.is_active && <div className="text-xs opacity-75">Inactive</div>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{selected.tool_name}</h2>
                <div className="flex gap-2">
                  {selected.is_active && <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">✓ Active</span>}
                  {selected.is_secret && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">🔐 Secret</span>}
                </div>
              </div>

              <p className="text-gray-600 mb-6">{selected.tool_type}</p>

              {selected.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selected.description}</p>
                </div>
              )}

              {selected.config_data && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration</h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{JSON.stringify(selected.config_data, null, 2)}</pre>
                  </div>
                </div>
              )}

              {selected.usage_instructions && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Instructions</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selected.usage_instructions}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">No tool selected</div>
          )}
        </div>
      </div>
    </div>
  )
}

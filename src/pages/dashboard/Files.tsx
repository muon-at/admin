import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFiles() }, [])

  async function loadFiles() {
    try {
      setLoading(true)
      const { data } = await supabase.from('file_index').select('*').order('uploaded_date', { ascending: false })
      setFiles(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = files.filter((f) => f.filename.toLowerCase().includes(search.toLowerCase()))

  const formatSize = (bytes: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes}B`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  if (loading) return <div className="p-8">⏳ Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">📁 File Library</h1>

      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <p className="font-medium text-gray-900 flex-1">{file.filename}</p>
                <span className="text-2xl">📄</span>
              </div>
              {file.summary && <p className="text-sm text-gray-600 mb-3">{file.summary}</p>}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">Size:</span><span className="font-medium">{formatSize(file.file_size_bytes)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="font-medium">{file.category}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Indexed:</span><span className="font-medium">{file.indexed_by_ai ? '✓ Yes' : '— No'}</span></div>
              </div>
              {file.tags && file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {file.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 p-8">No files found.</div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t text-center">
        <p className="text-sm text-gray-600">Total: <span className="font-medium">{files.length}</span> files | Indexed: <span className="font-medium">{files.filter((f) => f.indexed_by_ai).length}</span></p>
      </div>
    </div>
  )
}

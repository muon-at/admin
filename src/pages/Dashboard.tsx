import React, { useState } from 'react'
import DashboardHome from './dashboard/Home'
import AdsPage from './dashboard/Ads'
import LearningPage from './dashboard/Learning'
import TasksPage from './dashboard/Tasks'
import FilesPage from './dashboard/Files'
import MemoryPage from './dashboard/Memory'
import ToolsPage from './dashboard/Tools'
import DropoffPage from './dashboard/Dropoff'
import FacebookCampaignPage from './dashboard/FacebookCampaign'

type PageType = 'home' | 'ads' | 'learning' | 'tasks' | 'files' | 'memory' | 'tools' | 'dropoff' | 'facebook'

const pages: Array<{ id: PageType; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'ads', label: 'Ads', icon: '📊' },
  { id: 'learning', label: 'Learning', icon: '💡' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'memory', label: 'Memory', icon: '🧠' },
  { id: 'tools', label: 'Tools', icon: '🔧' },
  { id: 'facebook', label: 'Campaign 📍', icon: '🔥' },
  { id: 'dropoff', label: 'Dropoff', icon: '📝' },
]

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <DashboardHome />
      case 'ads': return <AdsPage />
      case 'learning': return <LearningPage />
      case 'tasks': return <TasksPage />
      case 'files': return <FilesPage />
      case 'memory': return <MemoryPage />
      case 'tools': return <ToolsPage />
      case 'facebook': return <FacebookCampaignPage />
      case 'dropoff': return <DropoffPage />
      default: return <DashboardHome />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">🧠 Second Brain</h1>
          <p className="text-sm text-gray-400 mt-1">Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                currentPage === page.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="inline-block mr-3">{page.icon}</span>
              {page.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">{new Date().toLocaleDateString('nb-NO')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  )
}

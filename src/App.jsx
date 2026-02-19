import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import AddCompetitor from './components/AddCompetitor'
import AlertHistory from './components/AlertHistory'
import Settings from './components/Settings'
import { competitorService } from './services/competitorService'
import { Moon, Sun, Settings as SettingsIcon, Bell } from 'lucide-react'

function App() {
  const [competitors, setCompetitors] = useState([])
  const [alerts, setAlerts] = useState([])
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    loadData()
    // Set up periodic data refresh
    const interval = setInterval(loadData, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [competitorData, alertData] = await Promise.all([
        competitorService.getCompetitors(),
        competitorService.getAlerts()
      ])
      setCompetitors(competitorData)
      setAlerts(alertData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompetitor = async (competitorData) => {
    try {
      await competitorService.addCompetitor(competitorData)
      await loadData()
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to add competitor:', error)
      throw error
    }
  }

  const handleDeleteCompetitor = async (id) => {
    try {
      await competitorService.deleteCompetitor(id)
      await loadData()
    } catch (error) {
      console.error('Failed to delete competitor:', error)
    }
  }

  const handleTriggerMonitoring = async () => {
    try {
      await competitorService.triggerMonitoring()
      await loadData()
    } catch (error) {
      console.error('Failed to trigger monitoring:', error)
    }
  }

  const unreadAlerts = alerts.filter(alert => !alert.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Brand Pulse Tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BP</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Brand Pulse Tracker
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAlerts(true)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="View Alerts"
              >
                <Bell size={20} />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                    {unreadAlerts}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Settings"
              >
                <SettingsIcon size={20} />
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard
          competitors={competitors}
          alerts={alerts.slice(0, 5)} // Show recent alerts
          onAddCompetitor={() => setShowAddModal(true)}
          onDeleteCompetitor={handleDeleteCompetitor}
          onTriggerMonitoring={handleTriggerMonitoring}
        />
      </main>

      {showAddModal && (
        <AddCompetitor
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCompetitor}
        />
      )}

      {showAlerts && (
        <AlertHistory
          alerts={alerts}
          onClose={() => setShowAlerts(false)}
          onMarkRead={(alertId) => {
            setAlerts(alerts.map(alert =>
              alert.id === alertId ? { ...alert, read: true } : alert
            ))
          }}
        />
      )}

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
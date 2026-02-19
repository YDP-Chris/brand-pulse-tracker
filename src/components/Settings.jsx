import React, { useState, useEffect } from 'react'
import { X, Save, Bell, Mail, MessageSquare, TestTube, Check, AlertCircle } from 'lucide-react'

const Settings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: '',
      ntfyTopic: '',
      enableEmail: false,
      enableNtfy: false,
      threshold: 5 // Minimum percentage change to trigger price alerts
    },
    monitoring: {
      checkInterval: 30, // minutes
      enableContentMonitoring: true,
      enablePriceMonitoring: true,
      enableScreenshots: false
    }
  })

  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('brandPulseSettings')
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) })
    }
  }, [])

  const handleSave = () => {
    setLoading(true)
    setSaveStatus(null)

    try {
      localStorage.setItem('brandPulseSettings', JSON.stringify(settings))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const testNotifications = async (type) => {
    setTestResults({ ...testResults, [type]: 'testing' })

    try {
      const response = await fetch('/api/test-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          email: settings.notifications.email,
          ntfyTopic: settings.notifications.ntfyTopic
        })
      })

      if (response.ok) {
        setTestResults({ ...testResults, [type]: 'success' })
      } else {
        throw new Error('Test failed')
      }
    } catch (error) {
      setTestResults({ ...testResults, [type]: 'error' })
    }

    setTimeout(() => {
      setTestResults({ ...testResults, [type]: null })
    }, 5000)
  }

  const updateSetting = (path, value) => {
    const pathArray = path.split('.')
    setSettings(prev => {
      const updated = { ...prev }
      let current = updated

      for (let i = 0; i < pathArray.length - 1; i++) {
        current[pathArray[i]] = { ...current[pathArray[i]] }
        current = current[pathArray[i]]
      }

      current[pathArray[pathArray.length - 1]] = value
      return updated
    })
  }

  const getTestIcon = (status) => {
    switch (status) {
      case 'testing':
        return <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <Check size={16} className="text-secondary" />
      case 'error':
        return <AlertCircle size={16} className="text-danger" />
      default:
        return <TestTube size={16} className="text-gray-400" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Notification Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Bell size={20} />
              <span>Notifications</span>
            </h3>

            <div className="space-y-4">
              {/* Email Settings */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enableEmail"
                    checked={settings.notifications.enableEmail}
                    onChange={(e) => updateSetting('notifications.enableEmail', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="enableEmail" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Mail size={16} />
                    <span>Email Notifications</span>
                  </label>
                </div>

                {settings.notifications.enableEmail && (
                  <div className="ml-7 space-y-2">
                    <input
                      type="email"
                      value={settings.notifications.email}
                      onChange={(e) => updateSetting('notifications.email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => testNotifications('email')}
                      disabled={!settings.notifications.email || testResults.email === 'testing'}
                      className="flex items-center space-x-2 text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      {getTestIcon(testResults.email)}
                      <span>Test Email</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ntfy Settings */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enableNtfy"
                    checked={settings.notifications.enableNtfy}
                    onChange={(e) => updateSetting('notifications.enableNtfy', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="enableNtfy" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MessageSquare size={16} />
                    <span>ntfy Push Notifications</span>
                  </label>
                </div>

                {settings.notifications.enableNtfy && (
                  <div className="ml-7 space-y-2">
                    <input
                      type="text"
                      value={settings.notifications.ntfyTopic}
                      onChange={(e) => updateSetting('notifications.ntfyTopic', e.target.value)}
                      placeholder="your-topic-name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Subscribe to https://ntfy.sh/your-topic-name on your phone
                    </p>
                    <button
                      onClick={() => testNotifications('ntfy')}
                      disabled={!settings.notifications.ntfyTopic || testResults.ntfy === 'testing'}
                      className="flex items-center space-x-2 text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      {getTestIcon(testResults.ntfy)}
                      <span>Test ntfy</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Alert Threshold */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Alert Threshold
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.notifications.threshold}
                    onChange={(e) => updateSetting('notifications.threshold', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 tabular-nums">
                    {settings.notifications.threshold}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimum price change percentage to trigger alerts
                </p>
              </div>
            </div>
          </div>

          {/* Monitoring Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Monitoring
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Check Interval
                </label>
                <select
                  value={settings.monitoring.checkInterval}
                  onChange={(e) => updateSetting('monitoring.checkInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                  <option value={180}>Every 3 hours</option>
                  <option value={360}>Every 6 hours</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.monitoring.enableContentMonitoring}
                    onChange={(e) => updateSetting('monitoring.enableContentMonitoring', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Monitor content changes
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.monitoring.enablePriceMonitoring}
                    onChange={(e) => updateSetting('monitoring.enablePriceMonitoring', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Monitor pricing changes
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.monitoring.enableScreenshots}
                    onChange={(e) => updateSetting('monitoring.enableScreenshots', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Take screenshots for visual comparison
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {saveStatus && (
              <div className={`flex items-center space-x-2 text-sm ${
                saveStatus === 'success' ? 'text-secondary' : 'text-danger'
              }`}>
                {saveStatus === 'success' ? (
                  <Check size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>
                  {saveStatus === 'success' ? 'Settings saved!' : 'Failed to save settings'}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3 ml-auto">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
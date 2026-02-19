import React from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, Globe, Clock } from 'lucide-react'

const RecentAlerts = ({ alerts = [] }) => {
  const getAlertIcon = (type, severity) => {
    switch (type) {
      case 'price_increase':
        return <TrendingUp size={16} className="text-danger" />
      case 'price_decrease':
        return <TrendingDown size={16} className="text-secondary" />
      case 'content_change':
        return <Globe size={16} className="text-blue-500" />
      default:
        return <AlertTriangle size={16} className={severity === 'critical' ? 'text-danger' : 'text-alert'} />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-danger bg-red-50 dark:bg-red-900/10'
      case 'high':
        return 'border-l-alert bg-orange-50 dark:bg-orange-900/10'
      case 'medium':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
      default:
        return 'border-l-gray-400 bg-gray-50 dark:bg-gray-700/50'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (alerts.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No alerts yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We'll show recent competitor activity here when changes are detected.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`card border-l-4 p-4 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getAlertIcon(alert.type, alert.severity)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.competitorName}
                </h4>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} />
                  <span className="tabular-nums">{formatTimestamp(alert.timestamp)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {alert.message}
              </p>

              {alert.details && (
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {alert.details.oldValue && alert.details.newValue && (
                    <div className="tabular-nums">
                      {alert.details.oldValue} → {alert.details.newValue}
                    </div>
                  )}
                  {alert.details.percentage && (
                    <div>
                      Change: {alert.details.percentage > 0 ? '+' : ''}{alert.details.percentage}%
                    </div>
                  )}
                </div>
              )}

              {alert.url && (
                <a
                  href={alert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-primary hover:underline mt-2"
                >
                  <span>View change</span>
                  <Globe size={10} />
                </a>
              )}
            </div>

            {!alert.read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentAlerts
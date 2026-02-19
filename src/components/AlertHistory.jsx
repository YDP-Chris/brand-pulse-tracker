import React, { useState } from 'react'
import { X, Filter, Search, AlertTriangle, TrendingUp, TrendingDown, Globe, Clock } from 'lucide-react'

const AlertHistory = ({ alerts = [], onClose, onMarkRead }) => {
  const [filter, setFilter] = useState('all') // all, critical, high, medium, low
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all, price_increase, price_decrease, content_change

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
    return new Date(timestamp).toLocaleString()
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter !== 'all' && alert.severity !== filter) return false
    if (typeFilter !== 'all' && alert.type !== typeFilter) return false
    if (search && !alert.competitorName.toLowerCase().includes(search.toLowerCase()) &&
        !alert.message.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const unreadCount = alerts.filter(alert => !alert.read).length
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Alert History
            </h2>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>{alerts.length} total alerts</span>
              {unreadCount > 0 && (
                <span className="text-primary font-medium">{unreadCount} unread</span>
              )}
              {criticalCount > 0 && (
                <span className="text-danger font-medium">{criticalCount} critical</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="price_increase">Price Increases</option>
                <option value="price_decrease">Price Decreases</option>
                <option value="content_change">Content Changes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No alerts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search || filter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters to see more alerts.'
                  : 'Alerts will appear here when changes are detected.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${getSeverityColor(alert.severity)}`}
                  onClick={() => !alert.read && onMarkRead(alert.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type, alert.severity)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {alert.competitorName}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className={`px-2 py-1 rounded-full uppercase font-medium ${
                              alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              alert.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                              alert.severity === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {alert.severity}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span className="tabular-nums">{formatTimestamp(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {!alert.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {alert.message}
                      </p>

                      {alert.details && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                          {alert.details.oldValue && alert.details.newValue && (
                            <div className="tabular-nums bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              <strong>Change:</strong> {alert.details.oldValue} → {alert.details.newValue}
                            </div>
                          )}
                          {alert.details.percentage && (
                            <div className="tabular-nums">
                              <strong>Impact:</strong> {alert.details.percentage > 0 ? '+' : ''}{alert.details.percentage}%
                            </div>
                          )}
                        </div>
                      )}

                      {alert.url && (
                        <a
                          href={alert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>View source</span>
                          <Globe size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </p>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertHistory
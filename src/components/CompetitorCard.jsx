import React, { useState } from 'react'
import { ExternalLink, Trash2, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const CompetitorCard = ({ competitor, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'error':
        return 'status-error'
      case 'updating':
        return 'status-updating'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'error':
        return 'Error'
      case 'updating':
        return 'Updating'
      default:
        return 'Unknown'
    }
  }

  const formatLastCheck = (timestamp) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete()
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const recentChanges = competitor.changes ? competitor.changes.slice(0, 3) : []
  const priceChange = competitor.priceChange || null

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`status-indicator ${getStatusColor(competitor.status)}`}></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {competitor.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center space-x-1 truncate"
            >
              <span className="truncate">{new URL(competitor.url).hostname}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-colors ${
            showDeleteConfirm
              ? 'bg-danger text-white hover:bg-red-600'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={showDeleteConfirm ? 'Click again to confirm' : 'Delete competitor'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Status Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Status</span>
          <span className={`font-medium ${
            competitor.status === 'active' ? 'text-secondary' :
            competitor.status === 'error' ? 'text-danger' :
            'text-alert'
          }`}>
            {getStatusText(competitor.status)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Last Check</span>
          <span className="text-gray-900 dark:text-white tabular-nums">
            {formatLastCheck(competitor.lastCheck)}
          </span>
        </div>

        {competitor.error && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle size={16} className="text-danger mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">
              {competitor.error}
            </p>
          </div>
        )}
      </div>

      {/* Price Change Alert */}
      {priceChange && (
        <div className={`p-3 rounded-lg mb-4 ${
          priceChange.direction === 'up'
            ? 'bg-red-50 dark:bg-red-900/20'
            : 'bg-green-50 dark:bg-green-900/20'
        }`}>
          <div className="flex items-center space-x-2">
            {priceChange.direction === 'up' ? (
              <TrendingUp size={16} className="text-danger" />
            ) : (
              <TrendingDown size={16} className="text-secondary" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Price {priceChange.direction === 'up' ? 'increased' : 'decreased'} by {priceChange.percentage}%
            </span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <DollarSign size={12} className="text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {priceChange.oldPrice} → {priceChange.newPrice}
            </span>
          </div>
        </div>
      )}

      {/* Recent Changes */}
      {recentChanges.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Recent Changes
          </h4>
          <div className="space-y-1">
            {recentChanges.map((change, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{change.type}</span>
                  <span className="tabular-nums">
                    {new Date(change.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {change.description && (
                  <p className="mt-1 text-gray-500 dark:text-gray-500 truncate">
                    {change.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {recentChanges.length === 0 && !competitor.error && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No changes detected yet
          </p>
        </div>
      )}
    </div>
  )
}

export default CompetitorCard
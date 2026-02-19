import React from 'react'
import CompetitorCard from './CompetitorCard'
import RecentAlerts from './RecentAlerts'
import { Plus, RefreshCw } from 'lucide-react'

const Dashboard = ({
  competitors = [],
  alerts = [],
  onAddCompetitor,
  onDeleteCompetitor,
  onTriggerMonitoring
}) => {
  const activeCompetitors = competitors.filter(c => c.status === 'active').length
  const totalChanges = alerts.length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Monitors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {activeCompetitors}
              </p>
            </div>
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Changes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {totalChanges}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Critical Alerts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {criticalAlerts}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-danger rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Last Check
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {competitors.length > 0
                  ? new Date(Math.max(...competitors.map(c => new Date(c.lastCheck || 0)))).toLocaleTimeString()
                  : 'Never'
                }
              </p>
            </div>
            <button
              onClick={onTriggerMonitoring}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Trigger Manual Check"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <RecentAlerts alerts={alerts} />
        </div>
      )}

      {/* Competitors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Competitors
          </h2>
          <button
            onClick={onAddCompetitor}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Competitor</span>
          </button>
        </div>

        {competitors.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No competitors added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start monitoring your competitors by adding their websites.
            </p>
            <button
              onClick={onAddCompetitor}
              className="btn-primary"
            >
              Add Your First Competitor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {competitors.map((competitor) => (
              <CompetitorCard
                key={competitor.id}
                competitor={competitor}
                onDelete={() => onDeleteCompetitor(competitor.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
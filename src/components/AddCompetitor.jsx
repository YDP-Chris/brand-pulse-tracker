import React, { useState } from 'react'
import { X, Plus, AlertCircle, Globe } from 'lucide-react'

const AddCompetitor = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    priceSelector: '',
    notificationEmail: '',
    monitorPricing: true,
    monitorContent: true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else {
      try {
        const url = new URL(formData.url)
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.url = 'URL must start with http:// or https://'
        }
      } catch {
        newErrors.url = 'Please enter a valid URL'
      }
    }

    if (formData.notificationEmail && !isValidEmail(formData.notificationEmail)) {
      newErrors.notificationEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Ensure URL has protocol
      let url = formData.url.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      await onAdd({
        ...formData,
        url,
        id: Date.now().toString(), // Simple ID generation
        status: 'active',
        createdAt: new Date().toISOString(),
        lastCheck: null,
        changes: []
      })
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to add competitor' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const fillFromURL = () => {
    if (formData.url && !formData.name) {
      try {
        const url = new URL(formData.url.startsWith('http') ? formData.url : 'https://' + formData.url)
        const hostname = url.hostname.replace('www.', '')
        const name = hostname.split('.')[0]
        setFormData(prev => ({
          ...prev,
          name: name.charAt(0).toUpperCase() + name.slice(1)
        }))
      } catch {
        // Ignore invalid URLs
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Competitor
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-2">
              <AlertCircle size={16} className="text-danger mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* URL Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL *
            </label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                onBlur={fillFromURL}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.url ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="https://competitor.com"
              />
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-danger">{errors.url}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              The homepage or main page you want to monitor
            </p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-danger' : 'border-gray-300'
              }`}
              placeholder="e.g., Nike, Adidas"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger">{errors.name}</p>
            )}
          </div>

          {/* Monitoring Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monitoring Options
            </h3>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.monitorContent}
                  onChange={(e) => handleChange('monitorContent', e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Monitor content changes
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.monitorPricing}
                  onChange={(e) => handleChange('monitorPricing', e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Monitor pricing (if visible)
                </span>
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Advanced Options
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price CSS Selector (Optional)
              </label>
              <input
                type="text"
                value={formData.priceSelector}
                onChange={(e) => handleChange('priceSelector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., .price, [data-price]"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                CSS selector for price elements if automatic detection fails
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Email (Optional)
              </label>
              <input
                type="email"
                value={formData.notificationEmail}
                onChange={(e) => handleChange('notificationEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.notificationEmail ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.notificationEmail && (
                <p className="mt-1 text-sm text-danger">{errors.notificationEmail}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Add Competitor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCompetitor
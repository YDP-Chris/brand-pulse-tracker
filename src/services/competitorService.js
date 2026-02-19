// Client-side service for managing competitors and alerts
export const competitorService = {
  // Get all competitors from localStorage and server
  async getCompetitors() {
    try {
      const response = await fetch('/api/competitors')
      if (response.ok) {
        return await response.json()
      }
      throw new Error('Failed to fetch competitors')
    } catch (error) {
      console.error('Failed to fetch competitors:', error)
      // Fallback to localStorage
      return this.getLocalCompetitors()
    }
  },

  // Get competitors from localStorage only
  getLocalCompetitors() {
    const stored = localStorage.getItem('brandPulseCompetitors')
    return stored ? JSON.parse(stored) : []
  },

  // Save competitors to localStorage
  saveLocalCompetitors(competitors) {
    localStorage.setItem('brandPulseCompetitors', JSON.stringify(competitors))
  },

  // Add a new competitor
  async addCompetitor(competitorData) {
    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(competitorData)
      })

      if (response.ok) {
        return await response.json()
      }
      throw new Error('Failed to add competitor')
    } catch (error) {
      console.error('Failed to add competitor via API:', error)
      // Fallback to localStorage
      const competitors = this.getLocalCompetitors()
      const newCompetitor = {
        ...competitorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastCheck: null,
        changes: [],
        status: 'active'
      }
      competitors.push(newCompetitor)
      this.saveLocalCompetitors(competitors)
      return newCompetitor
    }
  },

  // Delete a competitor
  async deleteCompetitor(id) {
    try {
      const response = await fetch(`/api/competitors/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete competitor')
      }
    } catch (error) {
      console.error('Failed to delete competitor via API:', error)
      // Fallback to localStorage
      const competitors = this.getLocalCompetitors()
      const filtered = competitors.filter(c => c.id !== id)
      this.saveLocalCompetitors(filtered)
    }
  },

  // Get alerts
  async getAlerts() {
    try {
      const response = await fetch('/api/alerts')
      if (response.ok) {
        return await response.json()
      }
      throw new Error('Failed to fetch alerts')
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      // Fallback to localStorage
      return this.getLocalAlerts()
    }
  },

  // Get alerts from localStorage only
  getLocalAlerts() {
    const stored = localStorage.getItem('brandPulseAlerts')
    return stored ? JSON.parse(stored) : []
  },

  // Save alerts to localStorage
  saveLocalAlerts(alerts) {
    localStorage.setItem('brandPulseAlerts', JSON.stringify(alerts))
  },

  // Trigger manual monitoring check
  async triggerMonitoring() {
    try {
      const response = await fetch('/api/monitor', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to trigger monitoring')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to trigger monitoring:', error)
      throw error
    }
  },

  // Get system status
  async getStatus() {
    try {
      const response = await fetch('/api/status')
      if (response.ok) {
        return await response.json()
      }
      throw new Error('Failed to get status')
    } catch (error) {
      console.error('Failed to get status:', error)
      return {
        status: 'error',
        message: 'Unable to connect to monitoring service',
        lastCheck: null,
        activeMonitors: 0
      }
    }
  }
}
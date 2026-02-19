import fs from 'fs'
import path from 'path'

const DATA_DIR = '/tmp/brand-pulse-data'
const COMPETITORS_FILE = path.join(DATA_DIR, 'competitors.json')

function readCompetitors() {
  if (!fs.existsSync(DATA_DIR) || !fs.existsSync(COMPETITORS_FILE)) {
    return []
  }

  try {
    const data = fs.readFileSync(COMPETITORS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading competitors file:', error)
    return []
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const competitors = readCompetitors()

    const activeCount = competitors.filter(c => c.status === 'active').length
    const errorCount = competitors.filter(c => c.status === 'error').length
    const totalCount = competitors.length

    // Find most recent check
    const lastCheck = competitors.reduce((latest, competitor) => {
      if (!competitor.lastCheck) return latest
      const checkTime = new Date(competitor.lastCheck)
      return !latest || checkTime > latest ? checkTime : latest
    }, null)

    const status = {
      status: errorCount > 0 ? 'warning' : 'healthy',
      message: `Monitoring ${activeCount} of ${totalCount} competitors`,
      activeMonitors: activeCount,
      totalMonitors: totalCount,
      errorMonitors: errorCount,
      lastCheck: lastCheck ? lastCheck.toISOString() : null,
      uptime: '100%', // Placeholder - in real implementation, track actual uptime
      version: '1.0.0',
      features: {
        contentMonitoring: true,
        priceMonitoring: true,
        emailNotifications: true,
        ntfyNotifications: true,
        visualDiff: false // Not implemented in this demo
      }
    }

    res.status(200).json(status)

  } catch (error) {
    console.error('Status API error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve system status',
      error: error.message
    })
  }
}
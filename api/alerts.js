import fs from 'fs'
import path from 'path'

const DATA_DIR = '/tmp/brand-pulse-data'
const ALERTS_FILE = path.join(DATA_DIR, 'alerts.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readAlerts() {
  ensureDataDir()
  if (!fs.existsSync(ALERTS_FILE)) {
    return []
  }

  try {
    const data = fs.readFileSync(ALERTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading alerts file:', error)
    return []
  }
}

function writeAlerts(alerts) {
  ensureDataDir()
  try {
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(alerts, null, 2))
  } catch (error) {
    console.error('Error writing alerts file:', error)
    throw error
  }
}

// Generate sample alerts if none exist
function generateSampleAlerts() {
  const now = new Date()
  const alerts = [
    {
      id: '1',
      competitorName: 'Nike',
      type: 'price_decrease',
      severity: 'high',
      message: 'Air Max 90 price dropped by 15% - now $89.99',
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://nike.com/air-max-90',
      read: false,
      details: {
        oldValue: '$105.99',
        newValue: '$89.99',
        percentage: -15
      }
    },
    {
      id: '2',
      competitorName: 'Adidas',
      type: 'content_change',
      severity: 'medium',
      message: 'Major homepage redesign detected',
      timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      url: 'https://adidas.com',
      read: false,
      details: null
    },
    {
      id: '3',
      competitorName: 'Under Armour',
      type: 'price_increase',
      severity: 'critical',
      message: 'HeatGear collection prices increased by 8%',
      timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      url: 'https://underarmour.com/heatgear',
      read: true,
      details: {
        oldValue: '$45.00',
        newValue: '$48.60',
        percentage: 8
      }
    }
  ]

  writeAlerts(alerts)
  return alerts
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      let alerts = readAlerts()

      // Generate sample data if no alerts exist
      if (alerts.length === 0) {
        alerts = generateSampleAlerts()
      }

      // Sort by timestamp (newest first)
      alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      res.status(200).json(alerts)

    } else if (req.method === 'POST') {
      // Add new alert
      const alertData = req.body

      if (!alertData.competitorName || !alertData.message) {
        return res.status(400).json({ error: 'Competitor name and message are required' })
      }

      const alerts = readAlerts()
      const newAlert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...alertData
      }

      alerts.push(newAlert)

      // Keep only last 100 alerts
      if (alerts.length > 100) {
        alerts.splice(0, alerts.length - 100)
      }

      writeAlerts(alerts)
      res.status(201).json(newAlert)

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = '/tmp/brand-pulse-data'
const COMPETITORS_FILE = path.join(DATA_DIR, 'competitors.json')
const ALERTS_FILE = path.join(DATA_DIR, 'alerts.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readCompetitors() {
  ensureDataDir()
  if (!fs.existsSync(COMPETITORS_FILE)) {
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

function writeCompetitors(competitors) {
  ensureDataDir()
  try {
    fs.writeFileSync(COMPETITORS_FILE, JSON.stringify(competitors, null, 2))
  } catch (error) {
    console.error('Error writing competitors file:', error)
    throw error
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

// Simulate website monitoring
async function monitorWebsite(competitor) {
  console.log(`Monitoring ${competitor.name} (${competitor.url})`)

  try {
    // In a real implementation, this would use puppeteer or similar
    // For demo purposes, we'll simulate monitoring results

    const response = await fetch(competitor.url, {
      headers: {
        'User-Agent': 'Brand-Pulse-Tracker/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const content = await response.text()
    const contentHash = crypto.createHash('md5').update(content).digest('hex')

    const changes = []
    let hasSignificantChange = false

    // Check for content changes
    if (competitor.lastContentHash && competitor.lastContentHash !== contentHash) {
      changes.push({
        type: 'content_change',
        timestamp: new Date().toISOString(),
        description: 'Website content has changed'
      })
      hasSignificantChange = true
    }

    // Simulate price detection (in reality, this would parse the HTML)
    const mockPriceChange = Math.random() < 0.1 // 10% chance of price change
    if (mockPriceChange && competitor.monitorPricing) {
      const priceChangePercent = (Math.random() - 0.5) * 20 // -10% to +10%
      if (Math.abs(priceChangePercent) >= 5) {
        const oldPrice = '$99.99'
        const newPrice = `$${(99.99 * (1 + priceChangePercent / 100)).toFixed(2)}`

        changes.push({
          type: priceChangePercent > 0 ? 'price_increase' : 'price_decrease',
          timestamp: new Date().toISOString(),
          description: `Price ${priceChangePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChangePercent).toFixed(1)}%`,
          details: {
            oldValue: oldPrice,
            newValue: newPrice,
            percentage: Math.round(priceChangePercent)
          }
        })
        hasSignificantChange = true

        // Create price alert
        const alerts = readAlerts()
        const newAlert = {
          id: `${competitor.id}_${Date.now()}`,
          competitorName: competitor.name,
          type: priceChangePercent > 0 ? 'price_increase' : 'price_decrease',
          severity: Math.abs(priceChangePercent) >= 10 ? 'critical' : 'high',
          message: `${competitor.name}: Price ${priceChangePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChangePercent).toFixed(1)}%`,
          timestamp: new Date().toISOString(),
          url: competitor.url,
          read: false,
          details: {
            oldValue: oldPrice,
            newValue: newPrice,
            percentage: Math.round(priceChangePercent)
          }
        }
        alerts.push(newAlert)
        writeAlerts(alerts)
      }
    }

    // Update competitor record
    const updatedCompetitor = {
      ...competitor,
      status: 'active',
      lastCheck: new Date().toISOString(),
      lastContentHash: contentHash,
      changes: [...changes, ...competitor.changes].slice(0, 20), // Keep last 20 changes
      error: null
    }

    return updatedCompetitor

  } catch (error) {
    console.error(`Error monitoring ${competitor.name}:`, error)

    return {
      ...competitor,
      status: 'error',
      lastCheck: new Date().toISOString(),
      error: error.message
    }
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const competitors = readCompetitors()

    if (competitors.length === 0) {
      return res.status(200).json({
        message: 'No competitors to monitor',
        monitored: 0,
        successful: 0,
        failed: 0
      })
    }

    console.log(`Starting monitoring for ${competitors.length} competitors`)

    // Monitor all competitors
    const results = []
    let successful = 0
    let failed = 0

    for (const competitor of competitors) {
      try {
        const updatedCompetitor = await monitorWebsite(competitor)
        results.push(updatedCompetitor)

        if (updatedCompetitor.status === 'active') {
          successful++
        } else {
          failed++
        }
      } catch (error) {
        console.error(`Failed to monitor ${competitor.name}:`, error)
        results.push({
          ...competitor,
          status: 'error',
          lastCheck: new Date().toISOString(),
          error: error.message
        })
        failed++
      }
    }

    // Save updated competitors
    writeCompetitors(results)

    res.status(200).json({
      message: 'Monitoring completed',
      monitored: competitors.length,
      successful,
      failed,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Monitoring error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
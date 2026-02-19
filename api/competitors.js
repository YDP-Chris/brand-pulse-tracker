import fs from 'fs'
import path from 'path'

// Simple file-based storage for competitors
const DATA_DIR = '/tmp/brand-pulse-data'
const COMPETITORS_FILE = path.join(DATA_DIR, 'competitors.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Read competitors from file
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

// Write competitors to file
function writeCompetitors(competitors) {
  ensureDataDir()
  try {
    fs.writeFileSync(COMPETITORS_FILE, JSON.stringify(competitors, null, 2))
  } catch (error) {
    console.error('Error writing competitors file:', error)
    throw error
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      // Get all competitors
      const competitors = readCompetitors()
      res.status(200).json(competitors)

    } else if (req.method === 'POST') {
      // Add new competitor
      const competitorData = req.body

      // Validate required fields
      if (!competitorData.name || !competitorData.url) {
        return res.status(400).json({ error: 'Name and URL are required' })
      }

      const competitors = readCompetitors()

      // Check for duplicate URLs
      if (competitors.some(c => c.url === competitorData.url)) {
        return res.status(400).json({ error: 'This URL is already being monitored' })
      }

      const newCompetitor = {
        id: Date.now().toString(),
        ...competitorData,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastCheck: null,
        changes: []
      }

      competitors.push(newCompetitor)
      writeCompetitors(competitors)

      res.status(201).json(newCompetitor)

    } else if (req.method === 'DELETE') {
      // Delete competitor (handled by dynamic route)
      res.status(405).json({ error: 'Method not allowed for this endpoint' })

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
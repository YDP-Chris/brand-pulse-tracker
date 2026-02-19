import fs from 'fs'
import path from 'path'

const DATA_DIR = '/tmp/brand-pulse-data'
const COMPETITORS_FILE = path.join(DATA_DIR, 'competitors.json')

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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Competitor ID is required' })
  }

  try {
    if (req.method === 'DELETE') {
      const competitors = readCompetitors()
      const index = competitors.findIndex(c => c.id === id)

      if (index === -1) {
        return res.status(404).json({ error: 'Competitor not found' })
      }

      competitors.splice(index, 1)
      writeCompetitors(competitors)

      res.status(200).json({ message: 'Competitor deleted successfully' })

    } else if (req.method === 'GET') {
      const competitors = readCompetitors()
      const competitor = competitors.find(c => c.id === id)

      if (!competitor) {
        return res.status(404).json({ error: 'Competitor not found' })
      }

      res.status(200).json(competitor)

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
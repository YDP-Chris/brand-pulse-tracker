// Test notification endpoints - would require email/ntfy credentials in production

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

  const { type, email, ntfyTopic } = req.body

  try {
    if (type === 'email') {
      if (!email) {
        return res.status(400).json({ error: 'Email address is required' })
      }

      // In production, this would use a service like SendGrid, Nodemailer, etc.
      console.log(`Would send test email to: ${email}`)

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000))

      res.status(200).json({
        success: true,
        message: `Test email would be sent to ${email}`,
        note: 'Email service not configured in demo mode'
      })

    } else if (type === 'ntfy') {
      if (!ntfyTopic) {
        return res.status(400).json({ error: 'ntfy topic is required' })
      }

      try {
        // Send actual ntfy notification
        const ntfyResponse = await fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          headers: {
            'Title': 'Brand Pulse Tracker - Test Notification',
            'Priority': 'default',
            'Tags': 'test,brand-pulse'
          },
          body: 'Test notification from Brand Pulse Tracker! 🎯 Your competitor monitoring system is working correctly.'
        })

        if (ntfyResponse.ok) {
          res.status(200).json({
            success: true,
            message: `Test notification sent to ntfy topic: ${ntfyTopic}`
          })
        } else {
          throw new Error(`ntfy returned ${ntfyResponse.status}`)
        }

      } catch (error) {
        console.error('ntfy error:', error)
        res.status(400).json({
          success: false,
          error: 'Failed to send ntfy notification',
          details: error.message
        })
      }

    } else {
      res.status(400).json({ error: 'Invalid notification type' })
    }

  } catch (error) {
    console.error('Test notification error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
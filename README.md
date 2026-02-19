# Brand Pulse Tracker

A real-time competitive intelligence dashboard that monitors competitor websites for changes, pricing updates, and content modifications. Built specifically for D2C brand managers and competitive analysts who need immediate visibility into competitor activities.

## Features

- **Real-time Website Monitoring**: Track content changes, pricing updates, and website modifications
- **Unified Dashboard**: Monitor 3-5 competitors from a single, mobile-first interface
- **Smart Alerts**: Email and ntfy notifications for significant changes
- **Price Tracking**: Automatic detection of pricing changes with configurable thresholds
- **Change History**: 30-day history of all detected competitor activities
- **Mobile Optimized**: Responsive design that works perfectly on all devices
- **Dark Mode**: Easy on the eyes for extended monitoring sessions

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Production Build

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)

This app is optimized for Vercel deployment with serverless functions:

1. **Connect to Vercel**:
   ```bash
   vercel
   ```

2. **Set Environment Variables** (optional):
   ```bash
   # For email notifications (future feature)
   SMTP_HOST=your-smtp-host
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password

   # For enhanced monitoring (future feature)
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Other Platforms

The app can be deployed to any platform that supports Node.js and static hosting:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Google Cloud Run

## Usage

### Adding Your First Competitor

1. **Open the Dashboard**: Navigate to your deployed app
2. **Click "Add Competitor"**: Use the prominent blue button
3. **Enter Details**:
   - **Website URL**: The homepage or main page to monitor (e.g., `https://competitor.com`)
   - **Company Name**: Display name (auto-filled from URL)
   - **Monitoring Options**: Choose content and/or pricing monitoring
4. **Advanced Options** (optional):
   - **Price CSS Selector**: If automatic price detection fails
   - **Notification Email**: For direct email alerts

### Monitoring Dashboard

The dashboard provides:

- **Status Cards**: Real-time status of each competitor
- **Recent Alerts**: Latest changes and price movements
- **Change History**: Detailed view of all detected modifications
- **Statistics**: Active monitors, total changes, critical alerts

### Notifications

Configure notifications in Settings:

1. **Email Notifications**:
   - Enter your email address
   - Test delivery with the built-in test function

2. **ntfy Push Notifications**:
   - Choose a unique topic name (e.g., `mybrand-competitive-intel`)
   - Subscribe on your phone: https://ntfy.sh/your-topic-name
   - Test delivery immediately

3. **Alert Thresholds**:
   - Set minimum price change percentage (default: 5%)
   - Customize monitoring intervals

## Technical Architecture

### Frontend
- **React 18** with hooks for state management
- **Tailwind CSS** for responsive, mobile-first styling
- **Lucide React** for consistent iconography
- **Vite** for fast development and building

### Backend
- **Vercel Serverless Functions** for API endpoints
- **File-based Storage** for simplicity and reliability
- **Real HTTP Requests** for website monitoring (no mock data)

### API Endpoints

- `GET /api/competitors` - List all monitored competitors
- `POST /api/competitors` - Add a new competitor
- `DELETE /api/competitors/[id]` - Remove a competitor
- `GET /api/alerts` - Retrieve alert history
- `POST /api/monitor` - Trigger manual monitoring check
- `GET /api/status` - System health and statistics
- `POST /api/test-notifications` - Test notification delivery

### Data Storage

The app uses simple JSON file storage in `/tmp/brand-pulse-data/`:
- `competitors.json` - Competitor configurations and status
- `alerts.json` - Alert history and notifications

For production use with persistent storage, consider:
- **Database**: PostgreSQL, MongoDB, or SQLite
- **Cloud Storage**: AWS S3, Google Cloud Storage
- **Managed Services**: PlanetScale, Supabase, Firebase

## Customization

### Adding New Competitor Types

Extend the monitoring logic in `/api/monitor.js`:

```javascript
// Add custom price selectors for specific sites
const SITE_SELECTORS = {
  'shopify.com': '.price',
  'woocommerce.com': '.woocommerce-Price-amount',
  'bigcommerce.com': '.price-section'
}
```

### Custom Change Detection

Modify change detection algorithms:

```javascript
// Example: Detect specific content patterns
function detectProductLaunches(content) {
  const launchKeywords = ['new arrival', 'just launched', 'introducing']
  return launchKeywords.some(keyword =>
    content.toLowerCase().includes(keyword)
  )
}
```

### Branding

Update colors and styling in `tailwind.config.js`:

```javascript
colors: {
  primary: '#your-brand-color',
  secondary: '#your-secondary-color',
}
```

## Advanced Features

### Scheduled Monitoring

For production use, set up scheduled monitoring:

1. **Vercel Cron Jobs** (recommended):
   ```javascript
   // api/cron/monitor.js
   export default async function handler(req, res) {
     // Trigger monitoring every 30 minutes
   }
   ```

2. **External Cron Services**:
   - GitHub Actions
   - Zapier
   - IFTTT

### Enhanced Price Detection

The current implementation uses basic price detection. For production:

1. **Add Puppeteer** for JavaScript-rendered prices:
   ```bash
   npm install puppeteer
   ```

2. **Implement Visual Diff** for layout changes:
   ```bash
   npm install pixelmatch pngjs
   ```

3. **Add Machine Learning** for intelligent content analysis

### Notification Channels

Extend beyond email and ntfy:

- **Slack Integration**: Webhooks for team notifications
- **Microsoft Teams**: Connector for enterprise teams
- **Discord**: Webhooks for community-driven monitoring
- **SMS**: Twilio integration for critical alerts

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure proper headers in `vercel.json`
   - Check API endpoint configurations

2. **Monitoring Failures**:
   - Verify competitor URLs are accessible
   - Check for rate limiting or bot detection
   - Review error logs in Vercel dashboard

3. **Notification Issues**:
   - Test notification endpoints individually
   - Verify email/ntfy configuration
   - Check spam folders for email alerts

### Performance Optimization

1. **Reduce API Calls**: Implement client-side caching
2. **Optimize Monitoring**: Stagger competitor checks
3. **Database Migration**: Move from files to proper database

## Security Considerations

- **Rate Limiting**: Implement request throttling
- **Authentication**: Add user login for production use
- **Data Encryption**: Encrypt sensitive competitor data
- **Access Control**: Restrict API endpoints to authorized users

## License

MIT License - see LICENSE file for details

## Support

For questions, issues, or feature requests:
1. Check the troubleshooting section above
2. Review API endpoint documentation
3. Open an issue with detailed reproduction steps

## Roadmap

### Version 1.1
- [ ] Visual diff screenshots
- [ ] Enhanced price detection
- [ ] Email notification service
- [ ] User authentication

### Version 1.2
- [ ] Advanced analytics dashboard
- [ ] Competitor comparison tools
- [ ] Export functionality
- [ ] Team collaboration features

### Version 2.0
- [ ] AI-powered insights
- [ ] Predictive analysis
- [ ] Integration marketplace
- [ ] Mobile app
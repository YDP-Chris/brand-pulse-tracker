# 🚨 Brand Pulse Tracker

**Never miss a competitor move again.**

Real-time competitive intelligence dashboard that alerts you the moment your competitors change prices, launch products, or update their websites. Built for D2C brands who need to respond faster than everyone else.

[🚀 **Try It Live**](https://brandpulsetracker.com) | [💬 **Join Community**](https://twitter.com/brandpulse) | [📚 **Documentation**](https://docs.brandpulsetracker.com)

---

## ⚡ The Problem

**You're flying blind in a fast-moving market.**

- Competitors drop prices overnight → You find out from customers asking for matches
- Product launches happen while you sleep → They get first-mover advantage
- Website changes signal strategy shifts → You notice weeks later in quarterly reviews
- Manual checking wastes hours → That should be spent on strategy, not research

**By the time you react, the opportunity is already gone.**

---

## 🎯 The Solution

**Get real-time alerts the moment anything changes.**

### 🚨 Instant Price Alerts
Monitor competitor pricing 24/7. Get notified within minutes of any price changes, with percentage impact and strategic context.

*"Caught Nike's 20% price drop in 3 minutes - adjusted our strategy before they even announced it."*

### 🎯 Product Launch Detection
Automatically spot new product pages, collections, and inventory updates. Know about launches before they announce them.

*"Spotted Lululemon's new collection 3 days before their social announcement."*

### 📊 Website Change Tracking
Detect content updates, homepage changes, and promotional campaigns. See what messaging strategies they're testing.

### 📱 Mobile-First Dashboard
Monitor everything from your phone. Get push notifications, email alerts, or SMS - however you want to stay informed.

---

## 🏃‍♂️ Quick Start

**Set up monitoring in under 2 minutes:**

1. **Add Competitors** → Enter competitor URLs (we handle the rest)
2. **Choose Alerts** → Pick what matters: prices, products, content changes
3. **Get Notified** → Instant alerts via email, push, or SMS
4. **Take Action** → Review insights and adjust your strategy

```bash
# Run locally
npm install
npm run dev
```

```bash
# Deploy to Vercel
vercel --prod
```

---

## 🌟 Why D2C Brands Choose Brand Pulse Tracker

### ⚡ **React Faster Than Everyone Else**
While competitors check manually, you get real-time alerts. Respond to price changes and launches before your competition even notices.

### 💰 **Protect Your Margins**
Stop losing sales to surprise price drops. Get instant alerts when competitors cut prices, so you can adjust immediately.

### 🎯 **Spot Opportunities Early**
See what products competitors are launching and what messaging they're testing. Use insights to inform your roadmap.

### 📈 **Save 10+ Hours Per Week**
Eliminate manual competitor checking. Get comprehensive intelligence delivered automatically.

---

## 📊 Features

### Core Monitoring
- ✅ **Real-time website monitoring** - Content, layout, messaging updates
- ✅ **Smart price tracking** - Automatic alerts with percentage impact
- ✅ **Product launch detection** - New pages, collections, inventory
- ✅ **Mobile-optimized dashboard** - Full access on any device

### Smart Alerts
- ✅ **Multi-channel notifications** - Email, push, SMS, Slack
- ✅ **Severity filtering** - Get only alerts that matter
- ✅ **Custom thresholds** - Set minimum price change percentages
- ✅ **Intelligence summaries** - Weekly/monthly reports

### Analytics & History
- ✅ **30-day change history** - Full timeline of competitor moves
- ✅ **Status indicators** - Real-time monitoring health
- ✅ **Dark mode support** - Easy on eyes for extended use
- ✅ **Team collaboration** - Share intelligence across your team

---

## 🚀 Tech Stack

**Built for reliability and speed:**

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Monitoring**: Real HTTP requests (no mock data)
- **Storage**: Optimized JSON with database migration path
- **Notifications**: Email, Push, SMS, Slack integrations

---

## 💬 What People Are Saying

> *"Brand Pulse Tracker caught a competitor's flash sale 30 minutes after it went live. We adjusted our pricing and saved thousands in margin loss."*
>
> **— Sarah K., Athleisure Brand Founder**

> *"I used to spend Mondays manually checking 8 competitor sites. Now I get a weekly summary with everything that actually matters."*
>
> **— Mike R., E-commerce Marketing Manager**

> *"The product launch alerts are game-changing. We spotted a competitor's new collection 3 days before they announced it on social."*
>
> **— Jessica L., Product Manager**

---

## 📈 Pricing

### **Starter - Free**
- Monitor 3 competitors
- Basic price & content alerts
- Email notifications
- 7-day change history

### **Pro - $29/month**
- Monitor 10 competitors
- Advanced launch detection
- Multi-channel notifications
- 30-day change history
- Priority support

### **Team - $79/month**
- Monitor 25 competitors
- Team collaboration
- Custom alert thresholds
- Weekly intelligence reports
- API access

[🚀 **Start Free Trial**](https://brandpulsetracker.com/signup)

---

## 🛠️ Advanced Setup

### Environment Variables
```bash
# Optional: Email notifications
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Optional: Enhanced monitoring
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### API Endpoints
- `GET /api/competitors` - List monitored competitors
- `POST /api/competitors` - Add new competitor
- `DELETE /api/competitors/[id]` - Remove competitor
- `GET /api/alerts` - Alert history
- `POST /api/monitor` - Manual monitoring trigger

### Custom Integration
```javascript
// Connect to your existing tools
const response = await fetch('/api/competitors', {
  method: 'POST',
  body: JSON.stringify({
    url: 'https://competitor.com',
    name: 'Competitor Name',
    alerts: ['price', 'content']
  })
});
```

---

## 🤝 Community

- [🐦 **Twitter**](https://twitter.com/brandpulse) - Daily tips and insights
- [💬 **Discord**](https://discord.gg/brandpulse) - Connect with other D2C brands
- [📧 **Newsletter**](https://brandpulsetracker.com/newsletter) - Weekly competitive intelligence
- [🐛 **Issues**](https://github.com/brand-pulse/tracker/issues) - Report bugs and request features

---

## 🏁 Ready to Stay Ahead?

**Stop reacting. Start leading.**

Join hundreds of D2C brands using Brand Pulse Tracker to stay ahead of the competition. Set up monitoring for your top 3 competitors in under 2 minutes.

[🚀 **Start Your Free Trial**](https://brandpulsetracker.com/signup)

**No credit card required • 30-day money-back guarantee • Cancel anytime**

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Built with ❤️ for the D2C community.
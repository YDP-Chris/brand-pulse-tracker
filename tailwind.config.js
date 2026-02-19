/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Pulse Tracker Brand Colors
        primary: '#7C3AED',     // Pulse Purple - Innovation, intelligence, premium
        secondary: '#0D9488',   // Signal Teal - Growth, monitoring, real-time activity
        accent: '#EA580C',      // Alert Orange - Urgency, attention, competitive advantage
        alert: '#EA580C',       // Alert Orange (alias for compatibility)
        danger: '#DC2626',      // Danger Red - Critical alerts, errors
        success: '#16A34A',     // Success Green - All clear status
        warning: '#CA8A04',     // Warning Yellow - Minor alerts
        // Brand Neutrals
        charcoal: '#1F2937',    // Dark text, headers
        slate: '#64748B',       // Secondary text, labels
        silver: '#F1F5F9',      // Background, cards (light mode)
        midnight: '#0F172A',    // Dark mode backgrounds
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
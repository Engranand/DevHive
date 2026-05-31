export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        surface: '#161b22',
        surface2: '#1c2330',
        border: '#21262d',
        border2: '#2d3748',
        accent: '#4f8cff',
        accent2: '#6ea8fe',
        muted: '#7d8590',
        text: '#e6edf3',
        text2: '#c9d1d9',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        purple: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
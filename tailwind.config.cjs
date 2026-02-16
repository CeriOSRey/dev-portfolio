module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        accent: '#10b981',
        soft: '#f8fafc',
        muted: '#eef2f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

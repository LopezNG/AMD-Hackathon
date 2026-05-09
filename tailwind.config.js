export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef5ff',
          100: '#d9e9ff',
          500: '#285eaa',
          700: '#173e74',
          800: '#102f5e',
          900: '#0b2144'
        },
        edu: {
          teal: '#13a8a2',
          mint: '#dff8f4',
          sky: '#ebf6ff',
          gold: '#f2b84b',
          rose: '#e86161'
        }
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15, 31, 61, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'subtle-pulse': 'subtle-pulse 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.95)' },
        },
        'glow': {
          'from': {
            'text-shadow': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88',
          },
          'to': {
            'text-shadow': '0 0 20px #00ff88, 0 0 30px #00ff88, 0 0 40px #00ff88',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'subtle-grid': 'linear-gradient(to right, rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,136,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-size': '50px 50px',
      },
    },
  },
  plugins: [],
};
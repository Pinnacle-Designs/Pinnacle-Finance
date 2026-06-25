/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#1B4FD8',
          'primary-dark': '#1539A8',
          secondary: '#0EA5E9',
          surface: '#F1F5F9',
          card: '#FFFFFF',
          muted: '#64748B',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 10px 25px -5px rgb(27 79 216 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        header: '0 1px 0 0 rgb(255 255 255 / 0.05)',
      },
    },
  },
  plugins: [],
};

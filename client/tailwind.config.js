export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 80px rgba(28, 27, 47, 0.18)',
      },
      colors: {
        night: '#0f1224',
        overlay: 'rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};

import animate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },

      // Custom keyframes for modal and confetti
      keyframes: {
        popIn: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },

        confettiFall: {
          '0%': {
            transform: 'translateY(-20px) rotate(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(500px) rotate(360deg)',
            opacity: '0',
          },
        },
      },

      // Animation utilities
      animation: {
        pop: 'popIn 0.3s ease-out',
        confetti: 'confettiFall 2.5s linear',
      },
    },
  },
  plugins: [animate],
};

export default config;

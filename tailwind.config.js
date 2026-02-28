/* TailoRex — Tailwind CDN Configuration */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(195 7% 22%)',
        primary: {
          DEFAULT: 'hsl(358 70% 42%)',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'hsl(210 20% 96%)',
          foreground: 'hsl(195 7% 45%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
        },
        border: 'hsl(210 15% 90%)',
        ring: 'hsl(358 70% 42%)',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
        elevated: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
};

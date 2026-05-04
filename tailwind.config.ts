import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink: '#0a0e1a',
        ink2: '#3d4661',
        ink3: '#8590ad',
        paper: '#f7f6f2',
        border: '#e2e0da',
        border2: '#c8c5bd',
        // PRINCE2 / PeopleCert brand
        p2: {
          navy: '#1B2D5F',
          'navy-deep': '#0F1B3C',
          'navy-light': '#2E4080',
          gold: '#F0B90B',
          'gold-deep': '#C99300',
          'gold-light': '#FFD54A',
          cream: '#F8F4ED',
        },
      },
    },
  },
  plugins: [],
}
export default config

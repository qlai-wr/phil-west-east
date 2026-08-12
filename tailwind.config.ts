import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 基础色 - 淡灰蓝底色
        ivory: '#F0F2F5',
        parchment: '#E4E8ED',
        // 墨色层次
        ink: {
          DEFAULT: '#1A202C',
          light: '#4A5568',
          lighter: '#A0AEC0',
          faint: '#CBD5E0',
        },
        // 西方哲学 - 靛蓝色系 (从帕台农神庙大理石的蓝影中取色)
        western: {
          DEFAULT: '#2B4C7E',
          light: '#5B7FB5',
          lighter: '#A3C4F3',
          faint: '#DCEAFB',
          dark: '#1B3150',
        },
        // 中国哲学 - 朱砂/丹色系 (传统中国书画用色)
        chinese: {
          DEFAULT: '#C53030',
          light: '#E2725B',
          lighter: '#F6AD9A',
          faint: '#FDE8E4',
          dark: '#822727',
        },
        // 强调色 - 古铜金 (学术装饰感)
        gold: {
          DEFAULT: '#B7791F',
          light: '#D69E2E',
          faint: '#FEFCBF',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(26, 32, 44, 0.08), 0 1px 2px rgba(26, 32, 44, 0.04)',
        'card-hover': '0 4px 16px rgba(26, 32, 44, 0.12), 0 2px 4px rgba(26, 32, 44, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config

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
        // 学术风格配色
        ivory: '#FDFBF7',
        parchment: '#F5F1E8',
        ink: '#2D3748',
        'ink-light': '#4A5568',
        'ink-lighter': '#718096',
        accent: {
          western: '#1E40AF', // 西方哲学 - 深蓝色
          chinese: '#DC2626', // 中国哲学 - 朱红色
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

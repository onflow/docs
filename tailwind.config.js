const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  // corePlugins: {
  //   preflight: false,
  // },
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    join(
      __dirname,
      'src/ui/design-system/src/**/!(*.stories|*.spec).{ts,tsx,html}',
    ),
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,tsx,html}'),
  ],
  theme: {
    fontSize: {
      '2xs': ['0.625rem', { lineHeight: '1rem' }],
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.25rem' }],
      '5xl': ['3.5rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    screens: {
      xs: '360px',
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        xs: '1140px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Acumin Pro', ...defaultTheme.fontFamily.sans],
        display: 'Inter',
        mono: 'IBM Plex Mono',
      },
      transitionDuration: {
        2000: '2000ms', // Adding 2000ms duration
      },
      colors: {
        'primary-green': '#00EF8B',
        'primary-blue': '#3B3CFF',
        'primary-purple': '#A269FF',
        'primary-yellow': '#F1E72A',
        'primary-pink': '#F4C6FB',
        'primary-red': '#F67D65',
        'red-error': '#FC4723',
        'green-success': '#05CE7A',
        'blue-hover': '#3031D1',
        'blue-hover-dark': '#A183E0',
        'green-dark': '#00BF6F',
        'blue-dark': '#B795FF',
        'pink-dark': '#F4C6FB',
        'red-error-dark': '#F67D65',
        'green-success-dark': '#7AFFC8',
        'primary-gray': {
          10: '#F2F4F7',
          50: '#F6F7F9',
          100: '#DEE2E9',
          200: '#ABB3BF',
          300: '#69717E',
          400: '#2F353F',
        },
        'accent-light-gray': '#F3F3F3',
        'primary-gray-dark': '#1A1A1A',
        'secondary-yellow': '#FFC700',
      },
      spacing: {
        micro: defaultTheme.spacing['1'],
        xxs: defaultTheme.spacing['2'],
        xs: defaultTheme.spacing['4'],
        s: defaultTheme.spacing['6'],
        m: defaultTheme.spacing['10'],
        xl: defaultTheme.spacing['16'],
        '2xl': defaultTheme.spacing['20'],
        '3xl': '7.5rem',
        '4xl': '12.5rem',
      },
      boxShadow: {
        '2xl': '0px 4px 40px 0px #00000014',
        '2xl-dark-soft': '0px 4px 40px #FFFFFF14',
        '2xl-dark': '0px 4px 40px #FFFFFF22',
        '2xl-dark-strong': '0px 0px 40px #FFFFFF32',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        custom: '60px',
        lg: '1rem',
      },
      backgroundColor: {
        'light-card': '#32343E', // Custom background color for light mode
      },
      backgroundImage: {
        'card-gradient':
          'linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.60) 25%, #32343E 100%)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'unset',
            code: {
              borderRadius: theme('borderRadius.DEFAULT'),
              borderWidth: theme('borderWidth.DEFAULT'),
              borderStyle: 'solid',
              borderColor: theme('colors[primary-gray][100]'),
              backgroundColor: theme('colors[primary-gray][50]'),
              paddingLeft: theme('padding[1]'),
              paddingRight: theme('padding[1]'),
              color: theme('colors[primary-gray][400]'),
              fontWeight: '400',
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
          },
        },
        invert: {
          css: {
            code: {
              color: theme('colors[primary-gray][100]'),
              backgroundColor: theme('colors[primary-gray][400]'),
              borderColor: theme('colors[primary-gray][300]'),
            },
          },
        },
        gray: {
          css: {
            '--tw-prose-bullets': theme('colors[primary-gray][400]'),
            '--tw-prose-invert-bullets': theme('colors[primary-gray][50]'),
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar-hide'),
  ],
};

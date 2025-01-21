export type ColorOption = 'pink' | 'green' | 'blue' | 'purple' | 'teal' | 'black' | 'white';

export const colors: Record<ColorOption, { light: string; dark: string }> = {
  pink: {
    light: 'bg-[#F9A8D4]',
    dark: 'bg-[#DB2777]',
  },
  green: {
    light: 'bg-[#A7F3D0]',
    dark: 'bg-[#059669]',
  },
  blue: {
    light: 'bg-[#93C5FD]',
    dark: 'bg-[#2563EB]',
  },
  purple: {
    light: 'bg-[#D8B4FE]',
    dark: 'bg-[#7C3AED]',
  },
  teal: {
    light: 'bg-[#99F6E4]',
    dark: 'bg-[#065F46]',
  },
  black: {
    light: 'bg-[#374151]',
    dark: 'bg-[#1F2937]',
  },
  white: {
    light: 'bg-white',
    dark: 'bg-gray-100',
  },
};

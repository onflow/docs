export type ColorOption = 'green' | 'blue' | 'purple' | 'teal' | 'black' | 'white' | 'flowgreen';

export const colors: Record<ColorOption, { light: string; dark: string }> = {
  green: {
    light: 'bg-[#59CB8C]',
    dark: 'bg-[#008748]',
  },
  blue: {
    light: 'bg-[#6476E8]',
    dark: 'bg-[#3D3FDF]',
  },
  purple: {
    light: 'bg-[#C25BEF]',
    dark: 'bg-[#9618A5]',
  },
  teal: {
    light: 'bg-[#71C4B3]',
    dark: 'bg-[#018878]',
  },
  black: {
    light: 'bg-[#374151]',
    dark: 'bg-[#1F2937]',
  },
  white: {
    light: 'bg-white',
    dark: 'bg-gray-100',
  },
  flowgreen: {
    light: 'bg-[#01EF8B]',
    dark: 'bg-[#01EF8B]'
  },
};

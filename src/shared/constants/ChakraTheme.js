import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
  colors: {
    gray: {
      900: '#101010',
      800: '#1E293B',
      700: '#272727',
      600: '#4F4F4F',
      500: '#767373',
      450: '#A0AEC0',
      400: '#C0C0C0',
      300: '#ECECEC',
      200: '#F3F3F3',
      100: '#FAFAFA',
    },
    green: {
      50: '#F0FFF4',
      100: '#F0FCF6',
      200: '#E0EBE5',
      300: '#149E46',
      400: '#366145',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#2A4A36',
      900: '#1C4532',
    },
  },
  shadows: {
    green: '3px 3px 0 0 var(--chakra-colors-green-300)',
    white: '3px 3px 0 0 white',
    black: '3px 3px 0 0 black',
  },
  components: {
    Button: {
      baseStyle: {
        boxShadow: 'green',
        borderColor: 'var(--chakra-colors-green-300)',
        borderWidth: '1px',
        p: 'var(--chakra-sizes-7)',
      },
    },
    Heading: {
      baseStyle: {
        textAlign: 'center',
      },
    },
  },
  fonts: {
    heading: 'Space Grotesk',
    body: 'Silka,Noto Sans,Inter,-apple-system,BlinkMacSystemFont,Noto Sans,Arial',
  },
});

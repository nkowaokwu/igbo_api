import { createMultiStyleConfigHelpers, extendTheme } from '@chakra-ui/react';
import { Inter } from 'next/font/google';

export const interComponent = Inter({ subsets: ['latin'] });
export const inter = interComponent.style.fontFamily;

const helpers = createMultiStyleConfigHelpers(['list', 'item']);

const Menu = helpers.defineMultiStyleConfig({
  baseStyle: {
    list: {
      paddingRight: 4,
    },
    item: {
      marginLeft: 2,
      marginRight: 2,
      borderRadius: 'md',
    },
  },
});

export default extendTheme({
  components: {
    Heading: {
      baseStyle: {
        letterSpacing: '-0.05em',
        color: 'gray.900',
        backgroundClip: 'text',
        paddingBottom: '12px',
      },
    },
    Link: {
      baseStyle: {
        textDecoration: 'underline',
        color: 'blue.500',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
    Text: {
      baseStyle: {
        color: 'black',
        fontSize: '18px',
      },
    },
    Menu,
  },
  fonts: {
    heading: inter,
    body: 'Noto Sans,-apple-system,BlinkMacSystemFont,Arial',
  },
});

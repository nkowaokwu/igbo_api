import { extendTheme } from '@chakra-ui/react';
import { Inter } from 'next/font/google';

export const interComponent = Inter({ subsets: ['latin'] });
export const inter = interComponent.style.fontFamily;

export default extendTheme({
  components: {
    Heading: {
      baseStyle: {
        letterSpacing: '-0.05em',
        color: 'gray.900',
        background: 'linear-gradient(180deg,#555,#000)',
        textFillColor: 'transparent',
        backgroundClip: 'text',
        paddingBottom: '12px',
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
    Text: {
      baseStyle: {
        letterSpacing: '-0.05em',
        color: 'black',
        fontSize: '18px',
      },
    },
  },
  fonts: {
    heading: inter,
    body: 'Inter,Noto Sans,Inter,-apple-system,BlinkMacSystemFont,Noto Sans,Arial',
  },
});

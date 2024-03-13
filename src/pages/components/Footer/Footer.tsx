import React from 'react';
import { Box, Heading, Link, ListItem, UnorderedList } from '@chakra-ui/react';
import {
  API_FROM_EMAIL,
  GITHUB_REPO,
  TWITTER,
  INSTAGRAM,
  LINKEDIN,
  YOUTUBE,
  NKOWAOKWU,
  NKOWAOKWU_CHROME,
  APP_URL,
} from '../../../siteConstants';

const categories = [
  {
    title: 'Projects',
    links: [
      {
        label: 'Igbo API',
        href: APP_URL,
      },
      {
        label: 'Nkọwa okwu',
        href: NKOWAOKWU,
      },
      {
        label: 'Chrome Extension',
        href: NKOWAOKWU_CHROME,
      },
    ],
  },
  {
    title: 'About the Igbo API',
    links: [
      {
        label: 'About',
        href: '/about',
      },
      { label: 'GitHub', href: GITHUB_REPO },
      { label: 'Twitter', href: TWITTER },
    ],
  },

  {
    title: 'More',
    links: [
      { label: 'Instagram', href: INSTAGRAM },
      { label: 'LinkedIn', href: LINKEDIN },
      { label: 'YouTube', href: YOUTUBE },
      { label: 'Email', href: `mailto:${API_FROM_EMAIL}` },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Terms of Service',
        href: '/terms',
      },
      {
        label: 'Privacy Policy',
        href: '/privacy',
      },
    ],
  },
];

const Footer = () => (
  <Box className="w-full">
    <Box className="w-full bg-gray-100" style={{ height: '1px' }} />
    <footer className="flex justify-center w-full bg-gradient-to-t py-4">
      <Box
        className="flex flex-col text-left items-center
          justify-center w-10/12 md:w-1/2 space-y-10"
      >
        <Box className="flex flex-row items-start w-full">
          <Link href="/">
            <Heading fontSize="2xl" pb="0" textAlign="left">
              IgboAPI
            </Heading>
          </Link>
        </Box>
        <Box className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {categories.map(({ title, links }) => (
            <Box key={title} className="space-y-2">
              <Heading as="h3" fontSize="md">
                {title}
              </Heading>
              <UnorderedList className="space-y-2" ml={0}>
                {links.map(({ label, href }) => (
                  <ListItem key={label} listStyleType="none">
                    <Link href={href} fontWeight="normal" color="gray.500">
                      {label}
                    </Link>
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          ))}
        </Box>
      </Box>
    </footer>
  </Box>
);

export default Footer;

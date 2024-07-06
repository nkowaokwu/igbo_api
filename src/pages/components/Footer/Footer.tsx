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
  <Box className="flex flex-col justify-center items-center w-full">
    <Box className="w-full bg-gray-100" style={{ height: '1px' }} />
    <footer className="w-9/12 grid grid-cols-1 lg:grid-cols-5 bg-gradient-to-t py-16 space-y-8 lg:space-y-0">
      <Box className="flex flex-row items-start">
        <Link href="/">
          <Heading fontSize="2xl" pb="0" textAlign="left">
            IgboAPI
          </Heading>
        </Link>
      </Box>
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
    </footer>
  </Box>
);

export default Footer;

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
    title: 'Organization',
    links: [
      {
        label: 'About',
        href: '/about',
      },
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
  {
    title: 'Social',
    links: [
      { label: 'GitHub', href: GITHUB_REPO },
      { label: 'Twitter', href: TWITTER },
      { label: 'Instagram', href: INSTAGRAM },
      { label: 'LinkedIn', href: LINKEDIN },
      { label: 'YouTube', href: YOUTUBE },
      { label: 'Email', href: `mailto:${API_FROM_EMAIL}` },
    ],
  },
];

const Footer = () => (
  <Box className="w-full">
    <Box className="w-full bg-gray-100" style={{ height: '1px' }} />
    <footer
      className={`flex flex-col text-center lg:text-left lg:flex-row
          justify-center w-full bg-gradient-to-t py-4`}
    >
      <Box className="flex flex-row items-center justify-center">
        <Box>
          <Box
            className="flex flex-col lg:flex-row justify-center items-center
              lg:items-start my-6 space-y-12 lg:space-y-0 lg:space-x-32"
          >
            {categories.map(({ title, links }) => (
              <Box key={title} className="spacy-y-4">
                <Heading as="h3" mb={2} fontSize="xl">
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
      </Box>
    </footer>
  </Box>
);

export default Footer;

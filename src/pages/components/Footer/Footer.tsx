import React from 'react';
import {
  Box,
  Heading,
  Link,
  ListItem,
  UnorderedList,
  Text,
  VStack,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMail } from 'react-icons/fi';

import Image from 'next/image';
import nkowaokwuLogoWhite from '../../assets/nkowaokwu_white.svg';
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
  SPEECH_TO_TEXT_APP_URL,
} from '../../../siteConstants';

const socialMedia = [
  { label: 'GitHub', href: GITHUB_REPO, icon: <FiGithub color="white" /> },
  { label: 'Twitter', href: TWITTER, icon: <FiTwitter color="white" /> },
  { label: 'Instagram', href: INSTAGRAM, icon: <FiInstagram color="white" /> },
  { label: 'LinkedIn', href: LINKEDIN, icon: <FiLinkedin color="white" /> },
  { label: 'YouTube', href: YOUTUBE, icon: <FiYoutube color="white" /> },
  { label: 'Email', href: `mailto:${API_FROM_EMAIL}`, icon: <FiMail color="white" /> },
];

const categories = [
  {
    title: 'Company',
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
      {
        label: 'IgboSpeech',
        href: SPEECH_TO_TEXT_APP_URL,
      },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'Documentation',
        href: '/docs',
      },
      {
        label: 'Share Feedback',
        href: '#',
      },
      {
        label: 'Feature Request',
        href: '#',
      },
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
  <VStack
    className="flex flex-col justify-center items-center w-full py-12"
    backgroundColor="blue.900"
    mt={12}
    gap={12}
  >
    <footer className="w-11/12 grid grid-cols-1 lg:grid-cols-4 space-y-8 lg:space-y-0">
      <VStack alignItems="start">
        <Link href="/">
          <Image src={nkowaokwuLogoWhite} alt="Nkọwa okwu logo" height={30} />
        </Link>
        <Text color="white">
          Join the growing number of professionals and educators who trust IgboSpeech for their
          transcription needs.
        </Text>
      </VStack>
      {categories.map(({ title, links }) => (
        <Box key={title} className="space-y-2">
          <Heading as="h3" fontSize="xl" color="white">
            {title}
          </Heading>
          <UnorderedList className="space-y-2" ml={0}>
            {links.map(({ label, href }) => (
              <ListItem key={label} listStyleType="none">
                <Link href={href} fontWeight="normal" color="white">
                  {label}
                </Link>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      ))}
    </footer>
    <HStack display="flex" justifyContent="space-between" className="w-11/12">
      <Text color="white" textAlign="left" flex={1}>
        © {new Date().getFullYear()} Nkọwa okwu. All rights reserved.
      </Text>
      {socialMedia.map(({ label, href, icon }) => (
        <Tooltip label={label} key={label}>
          <IconButton
            aria-label={label}
            icon={icon}
            variant="ghost"
            _hover={{ backgroundColor: 'transparent' }}
            _active={{ backgroundColor: 'transparent' }}
            _focus={{ backgroundColor: 'transparent' }}
            onClick={() => {
              window.location.href = href;
            }}
          />
        </Tooltip>
      ))}
    </HStack>
  </VStack>
);

export default Footer;

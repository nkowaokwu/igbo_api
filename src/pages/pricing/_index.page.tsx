import React from 'react';
import { capitalize } from 'lodash';
import { Box, Heading } from '@chakra-ui/react';
import PricingCard from './components/PricingCard';
import { PricingTier } from './types';
import Plan from '../../shared/constants/Plan';

const pricingTiers: PricingTier[] = [
  {
    price: 0,
    title: capitalize(Plan.STARTER),
    description:
      'Built for small teams and independent developers looking to get started developing.',
    callToAction: 'Get started',
    navigation: '/dashboard',
    features: ['first', 'second', 'third', 'fourth'],
  },
  {
    price: 10,
    title: capitalize(Plan.TEAM),
    description: 'Built for startups and larger organizations looking to scale their services.',
    callToAction: 'Sign in to upgrade',
    navigation: '/dashboard',
    features: [
      'Igbo API v2',
      'Resolvable data',
      'Beta access to IgboSpeech',
      'Beta access to Igbo OCR',
    ],
  },
];

const Pricing = () => (
  <Box>
    <Box className="space-y-12 md:pt-64 lg:py-32 mb-12">
      <Heading as="h1" textAlign="center">
        Pricing
      </Heading>
      <Box
        className="flex flex-col lg:flex-row justify-center items-center 
      space-y-8 lg:space-y-0 lg:space-x-14 w-full"
      >
        {pricingTiers.map((pricingTier) => (
          <PricingCard key={pricingTier.title} {...pricingTier} />
        ))}
      </Box>
    </Box>
  </Box>
);

export default Pricing;

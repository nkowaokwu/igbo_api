import React from 'react';
import { capitalize } from 'lodash';
import { Box, Heading } from '@chakra-ui/react';
import PricingCard from './components/PricingCard';
import { PricingTier } from './types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
    features: ['first', 'second', 'third', 'fourth'],
  },
];

const Pricing = () => (
  <Box>
    <Navbar />
    <Box className="space-y-12 md:pt-64 lg:py-32">
      <Heading as="h1" textAlign="center">
        Pricing
      </Heading>
      <Box className="flex flex-row justify-center items-center space-x-14 w-full">
        {pricingTiers.map((pricingTier) => (
          <PricingCard key={pricingTier.title} {...pricingTier} />
        ))}
      </Box>
    </Box>
    <Footer />
  </Box>
);

export default Pricing;

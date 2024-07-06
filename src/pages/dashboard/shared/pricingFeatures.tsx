import React, { ReactElement } from 'react';
import { FiXCircle, FiCheckCircle } from 'react-icons/fi';
import Plan from '../../../shared/constants/Plan';

enum FeatureCategory {
  DATA = 'Data',
  COMPUTE = 'Compute and Variable Costs',
  FEATURES = 'Features',
}

interface PricingFeatureCategory {
  category: FeatureCategory;
  features: PricingFeature[];
}

interface PricingFeature {
  feature: string;
  tiers: { [key in Plan]: ReactElement | string };
}

const pricingFeatures: PricingFeatureCategory[] = [
  {
    category: FeatureCategory.DATA,
    features: [
      // Starter
      {
        feature: 'Daily requests',
        tiers: {
          [Plan.STARTER]: '500',
          [Plan.TEAM]: '2,500',
        },
      },
      {
        feature: '25,000+ words',
        tiers: {
          [Plan.STARTER]: <FiCheckCircle color="green" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      {
        feature: '50,000+ sentences',
        tiers: {
          [Plan.STARTER]: <FiCheckCircle color="green" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      {
        feature: '100+ hours of audio data',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      // Team
      {
        feature: 'Cached verbs and suffixes',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      {
        feature: 'Multiple audio recordings for sentences',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      {
        feature: 'Consistent dialects data structure',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      {
        feature: 'Resolve attached wor stems and related terms',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
    ],
  },
  {
    category: FeatureCategory.FEATURES,
    features: [
      {
        feature: 'Access to the IgboSpeech API',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
      {
        feature: 'Access to the Igbo OCR API',
        tiers: {
          [Plan.STARTER]: <FiXCircle color="red" />,
          [Plan.TEAM]: <FiCheckCircle color="green" />,
        },
      },
    ],
  },
];

export default pricingFeatures;

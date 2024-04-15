import React from 'react';
import { Box, Button, Heading, Text, chakra } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { PricingTier } from '../types';

const PricingCard = ({
  price,
  title,
  description,
  callToAction,
  navigation,
  features,
}: PricingTier) => {
  const router = useRouter();

  const handleCallToAction = () => {
    router.push(navigation);
  };
  return (
    <Box
      className="rounded-lg grid grid-cols-1 gap-6"
      borderWidth="1px"
      borderColor="gray.300"
      p={6}
      width="fit-content"
      maxWidth="320px"
      minHeight="400px"
    >
      <Box>
        <Heading as="h2" fontSize="2xl">
          {title}
        </Heading>
        <Heading fontSize="5xl">
          {`$${price}`}
          <chakra.span fontSize="xl" color="gray.600" letterSpacing="-0.02em">
            / month
          </chakra.span>
        </Heading>
      </Box>
      <Text fontSize="md">{description}</Text>
      <Button onClick={handleCallToAction}>{callToAction}</Button>
      <Box>
        {features.map((feature) => (
          <Box key={feature} className="flex flex-row items-center space-x-2">
            <FiCheckCircle color="green" />
            <Text key={feature}>{feature}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PricingCard;

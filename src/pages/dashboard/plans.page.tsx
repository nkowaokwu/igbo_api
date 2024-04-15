import React from 'react';
import { Box, Heading, Link, Text, chakra } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import DashboardLayout from './layout';
import Plan from '../../shared/constants/Plan';
import { API_FROM_EMAIL } from '../../siteConstants';

const Plans = () => (
  <DashboardLayout>
    {() => (
      <Box>
        <Heading>Plans</Heading>
        <Text>
          Your account is currently on the{' '}
          <chakra.span fontWeight="bold">{capitalize(Plan.STARTER)}</chakra.span> plan. For
          questions about your plan, please{' '}
          <Link href={`mailto:${API_FROM_EMAIL}`} textDecoration="underline">
            contact us
          </Link>
          .
        </Text>
      </Box>
    )}
  </DashboardLayout>
);

export default Plans;

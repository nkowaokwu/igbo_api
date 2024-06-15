import React from 'react';
import { Box, Heading, Link, Text, chakra } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import DashboardLayout from './layout';
import Plan from '../../shared/constants/Plan';
import { API_FROM_EMAIL, SERVER_DOMAIN } from '../siteConstants';

const Plans = () => (
  <DashboardLayout>
    {({ developer }) => (
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
        <form action={`${SERVER_DOMAIN}/stripe/checkout`} method="POST">
          <input type="hidden" name="lookupKey" value="igbo_api_team" />
          <input type="hidden" name="developerId" value={developer.id} />
          {/* TODO: uncomment this when ready to use Stripe */}
          {/* <Button type="submit">Upgrade plan</Button> */}
        </form>
      </Box>
    )}
  </DashboardLayout>
);

export default Plans;

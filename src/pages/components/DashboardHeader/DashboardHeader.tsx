import { ArrowBackIcon, ChevronRightIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardHeader = function Dashboard({ pageTitle }: { pageTitle: string }) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const [apiKey, setApiKey] = useState('');
  const toast = useToast();
  const pageHeaderDisplay = useBreakpointValue({ base: 'block', lg: 'flex' });

  const handleGoBack = () => router.back();

  useEffect(() => {
    const developerApiKey = 'example-api-key'; // TODO: Remove hardcoded value
    setApiKey(developerApiKey);
  }, []);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: t('API key copied'),
      description: t('Your API key has been copied to your clipboard.'),
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Box ml={{ base: 10, lg: 270 }} pt={5} display="flex">
        <Text
          fontSize="lg"
          fontFamily="monospace"
          color="blue.400"
          fontWeight="bold"
          marginRight={3}
          cursor="pointer"
          onClick={handleGoBack}
        >
          <ArrowBackIcon boxSize="1rem" marginRight="5px" />
          {t('Back')}
        </Text>
        |
        <Text fontSize="md" fontFamily="monospace" marginLeft={3}>
          {t('Dashboard')} <ChevronRightIcon /> {t('App one')}
        </Text>
      </Box>
      <Box ml={{ base: 10, lg: 270 }} pt={4} pr={10} display={pageHeaderDisplay} justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          {pageTitle}
        </Text>

        <InputGroup style={{ maxWidth: '300px', margin: '0 auto', justifyContent: 'right', marginRight: 0 }}>
          <Input value={apiKey} background="gray.200" padding={6} readOnly />
          <InputRightElement padding={6} onClick={handleCopyApiKey} cursor="pointer">
            <Tooltip label={t('Copy API key')}>
              <CopyIcon />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
};

export default DashboardHeader;

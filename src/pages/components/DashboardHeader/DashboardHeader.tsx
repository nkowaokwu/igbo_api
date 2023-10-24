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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  pageTitle: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = function Dashboard({ pageTitle }) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const [apiKey, setApiKey] = useState('');
  const toast = useToast();
  const ml = useBreakpointValue({ base: 10, lg: 270 });
  const pageHeaderDisplay = useBreakpointValue({ base: 'block', lg: 'flex' });

  const handleGoBack = () => {
    router.back();
  };

  const handleCopyApiKey = () => {
    setApiKey('example-api-key');
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
    <>
      <Box ml={ml} pt={5} display="flex">
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
      <Box ml={ml} pt={4} pr={10} display={pageHeaderDisplay} justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          {pageTitle}
        </Text>

        <InputGroup style={{ maxWidth: '300px', margin: '0 auto', justifyContent: 'right', marginRight: 0 }}>
          {/* TODO: Remove hardcoded value */}
          <Input value="00y23804y29b3d9048hend" background="gray.200" padding={6} readOnly />
          <InputRightElement padding={6} onClick={handleCopyApiKey} cursor="pointer">
            <Tooltip label={t('Copy API key')}>
              <CopyIcon />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </Box>
    </>
  );
};

export default DashboardHeader;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon, CopyIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import Sidebar from './components/Sidebar';

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const toast = useToast();

  const handleCopyApiKey = () => {
    setApiKey('example-api-key');
    navigator.clipboard.writeText(apiKey);
    toast({
      title: 'API key copied',
      description: 'Your API key has been copied to your clipboard.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('white', 'white')}>
      <Sidebar />
      <Box ml={270} pt={5} display="flex">
        <Text
          fontSize="lg"
          fontFamily="monospace"
          color="#1570FA"
          fontWeight="bold"
          marginRight={3}
          cursor="pointer"
          onClick={handleGoBack}
        >
          <ArrowBackIcon
            __css={{
              fontSize: '1rem',
              marginRight: '5px',
            }}
          />
          {t('Back')}
        </Text>
        |
        <Text fontSize="md" fontFamily="monospace" marginLeft={3}>
          {t('Dashboard')} <ChevronRightIcon /> {t('App one')}
        </Text>
      </Box>
      <Box ml={270} pt={4} pr={10} display="flex" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Dashboard
        </Text>

        <InputGroup style={{ maxWidth: '300px', margin: '0 auto', justifyContent: 'right', marginRight: 0 }}>
          <Input value="00y23804y29b3d9048hend" background="gray.200" padding={6} readOnly />
          <InputRightElement padding={6} onClick={handleCopyApiKey} cursor="pointer">
            <Tooltip label="Copy API key">
              <CopyIcon />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </Box>

      <Box ml={270} mt={70} p="3" maxW={250} background="gray.50" borderRadius={10} border="1px" borderColor="gray.900">
        <Box display="flex" p="2" background="gray.100" justifyContent="space-between">
          <Text fontSize="md" p="2" fontWeight="medium">
            {t('Calls')}
          </Text>

          <Text fontSize="2xl" fontWeight="bold">
            54
          </Text>
        </Box>
        <Text fontSize="md" fontFamily="monospace" marginTop={3}>
          {t('Total daily usage')}
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;

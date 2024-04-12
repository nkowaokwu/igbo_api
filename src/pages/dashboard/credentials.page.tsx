import React, { useState } from 'react';
import { Box, Heading, IconButton, Input, Text, Tooltip } from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiCopy } from 'react-icons/fi';

import DashboardLayout from './layout';
import { Developer } from '../../types';

const Credentials = () => {
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = (apiKey: string) => () => {
    navigator.clipboard.writeText(apiKey);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  return (
    <DashboardLayout>
      {({ developer }: { developer: Developer }) => (
        <>
          <Box mb={4}>
            <Heading as="h1">API Keys</Heading>
            <Text fontSize="sm" color="gray.700" letterSpacing="0">
              All your API Keys.
            </Text>
          </Box>
          <Box>
            <Box className="flex flex-row justify-center">
              <Input
                pointerEvents="none"
                borderColor="gray.100"
                backgroundColor="gray.50"
                defaultValue={developer.apiKey}
                type={isApiKeyVisible ? 'text' : 'password'}
              />
              <Tooltip label={isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}>
                <IconButton
                  variant="ghost"
                  _hover={{ backgroundColor: 'transparent' }}
                  _active={{ backgroundColor: 'transparent' }}
                  _focus={{ backgroundColor: 'transparent' }}
                  icon={isApiKeyVisible ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                  aria-label="Show and hide API Key button"
                />
              </Tooltip>
              <Tooltip label={hasCopied ? 'Copied' : 'Copy'}>
                <IconButton
                  variant="ghost"
                  _hover={{ backgroundColor: 'transparent' }}
                  _active={{ backgroundColor: 'transparent' }}
                  _focus={{ backgroundColor: 'transparent' }}
                  icon={<FiCopy />}
                  onClick={handleCopy(developer.apiKey)}
                  aria-label="Copy API Key button"
                />
              </Tooltip>
            </Box>
          </Box>
        </>
      )}
    </DashboardLayout>
  );
};

export default Credentials;

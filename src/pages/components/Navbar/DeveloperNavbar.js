import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Heading,
  Text,
  useDisclosure,
  DrawerCloseButton,
} from '@chakra-ui/react';
import React from 'react';

function DeveloperNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box className="flex relative lg:fixed items-center justify-between w-full py-5 lg:px-10">
      <Box>
        {' '}
        <a href="/">
          <Heading className="ransition-element text-3xl font-extrabold hover:text-gray-700 text-gray-900 ml-5 lg:ml-0">
            Igbo API
          </Heading>
        </a>
        {' '}
      </Box>
      <Box className=" md:hidden">
        <Button colorScheme="white" className="mr-5 flex-col bg-transparent lg:mr-0" onClick={onOpen}>
          <span className="h-px bg-gray-700 w-10" />
          <span className=" mt-4 h-px bg-gray-700 w-10" />
        </Button>
        {/* Mobile View */}
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerCloseButton />
          <DrawerContent className="py-5 lg:px-10">
            <DrawerCloseButton />
            <DrawerBody>
              <a href="/">
                <Text className="text-xl font-bold py-3">Feature</Text>
              </a>
              <a href="/">
                <Text className="text-xl font-bold py-3">Try it Out</Text>
              </a>
              <a href="/">
                <Text className="text-xl font-bold py-3">About</Text>
              </a>
              <a href="/">
                <Text className="text-xl font-bold py-3">Register API Key</Text>
              </a>
              <a href="/">
                <Text className="text-xl font-bold py-3">Docs</Text>
              </a>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      <Box className="hidden md:flex">
        <a href="/">
          <Text className="text-xl font-bold p-3">Feature</Text>
        </a>
        <a href="/">
          <Text className="text-xl font-bold p-3">Try it Out</Text>
        </a>
        <a href="/">
          <Text className="text-xl font-bold p-3">About</Text>
        </a>
        <a href="/">
          <Text className="text-xl font-bold p-3">Register API Key</Text>
        </a>
        <a href="/">
          <Text className="text-xl font-bold p-3">Docs</Text>
        </a>
      </Box>
    </Box>
  );
}

export default DeveloperNavbar;

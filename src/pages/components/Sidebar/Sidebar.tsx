import React from 'react';
import { Drawer, DrawerContent, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import SidebarContent from './SidebarContent';
import MobileNav from '../Navbar/MobileNav';

const Sidebar: React.FC = function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showSidebar = useBreakpointValue({ base: false, md: true });

  return (
    <>
      {showSidebar ? <SidebarContent onClose={onClose} /> : null}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
    </>
  );
};

export default Sidebar;

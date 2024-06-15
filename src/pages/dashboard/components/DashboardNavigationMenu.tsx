import React, { useState, useEffect } from 'react';
import { Box, Text, ListItem, UnorderedList } from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiUser, FiLock, FiShoppingBag } from 'react-icons/fi';

const navigationOptions = [
  {
    label: 'Home',
    route: '/dashboard',
    icon: FiHome,
  },
  {
    label: 'Credentials',
    route: '/dashboard/credentials',
    icon: FiLock,
  },
  {
    label: 'Profile',
    route: '/dashboard/profile',
    icon: FiUser,
  },
  {
    label: 'Plans',
    route: '/dashboard/plans',
    icon: FiShoppingBag,
  },
];

const getTabPositionsFromIndex = (index: number) => {
  const tab = document.querySelector(`.navigation-option-${index}`);
  if (!tab) return { left: 0, width: 0 };

  const tabPositions = tab.getBoundingClientRect();
  return tabPositions;
};

const DashboardNavigationMenu = () => {
  const [hoveredTabIndex, setHoveredTabIndex] = useState(-1);
  const [navigationHoverSlider, setNavigationHoverSlider] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hoveredTabIndex !== -1 && navigationHoverSlider) {
      const hoveredTabPositions = getTabPositionsFromIndex(hoveredTabIndex);

      navigationHoverSlider.style.opacity = '1';
      navigationHoverSlider.style.left = `${hoveredTabPositions.left - 8}px`;
      navigationHoverSlider.style.width = `${hoveredTabPositions.width}px`;
    } else if (hoveredTabIndex === -1 && navigationHoverSlider) {
      navigationHoverSlider.style.opacity = '0';
    }
  }, [hoveredTabIndex, navigationHoverSlider]);

  return (
    <Box className="w-full">
      <Box className="relative" zIndex={0}>
        <UnorderedList
          listStyleType="none"
          m={0}
          className="flex flex-row items-center relative"
          zIndex={1}
        >
          {navigationOptions.map(({ label, route }, index) => (
            <ListItem
              key={label}
              borderRadius="md"
              _hover={{ cursor: 'pointer', color: 'black' }}
              className={`navigation-option-${index} transition-all flex justify-center p-2`}
              onMouseEnter={() => setHoveredTabIndex(index)}
              onMouseLeave={() => setHoveredTabIndex(-1)}
            >
              <Link href={route} className="flex items-center space-x-2 hover:text-black">
                <Text
                  fontWeight="400"
                  fontSize="sm"
                  letterSpacing="0"
                  color="gray.600"
                  _hover={{ color: 'black' }}
                >
                  {label}
                </Text>
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
        <Box
          ref={setNavigationHoverSlider}
          className="absolute transition-all bg-gray-200 rounded"
          pointerEvents="none"
          height={10}
          top={0}
          zIndex={-1}
        />
      </Box>
    </Box>
  );
};

export default DashboardNavigationMenu;

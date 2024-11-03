import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Link,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { navigationLinks, NavigationType } from '../../../shared/constants/navigationLinks';

const NavigationOptions = () => (
  <UnorderedList
    className="w-full flex flex-row justify-center items-center space-x-6"
    data-test="sub-menu"
  >
    {navigationLinks.map(({ href, label, type, options }) => (
      <ListItem className="transition-element" key={label}>
        {type === NavigationType.LINK ? (
          <Link
            className="cursor-pointer font-normal"
            href={href}
            role="link"
            fontWeight="semibold"
            color="gray.900"
            textDecoration="none"
          >
            {label}
          </Link>
        ) : type === NavigationType.DROPDOWN && options ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              backgroundColor="transparent"
              _hover={{ backgroundColor: 'transparent' }}
              _active={{ backgroundColor: 'transparent' }}
              _focus={{ backgroundColor: 'transparent' }}
              p={0}
            >
              {label}
            </MenuButton>
            <MenuList>
              {options.map(({ title, subtitle, href: optionHref, isExternal, enabled }) =>
                enabled ? (
                  <MenuItem key={title}>
                    <Link
                      className="cursor-pointer font-normal"
                      href={optionHref}
                      role="link"
                      target={isExternal ? '_blank' : ''}
                      color="gray.900"
                      textDecoration="none"
                    >
                      <Box width="full">
                        <Text className="space-x-2" fontSize="md">
                          {title}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {subtitle}
                        </Text>
                      </Box>
                    </Link>
                  </MenuItem>
                ) : null
              )}
            </MenuList>
          </Menu>
        ) : null}
      </ListItem>
    ))}
  </UnorderedList>
);
export default NavigationOptions;

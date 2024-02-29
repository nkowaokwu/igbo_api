import React from 'react';
import { UnorderedList, ListItem, Link } from '@chakra-ui/react';
import { navigationLinks } from '../../../shared/constants/navigationLinks';

const NavigationOptions = () => (
  <UnorderedList
    className="w-full flex flex-row justify-center items-center space-x-3"
    data-test="sub-menu"
  >
    x
    {navigationLinks.map(({ href, label }) => (
      <ListItem className="transition-element" key={label}>
        <Link className="cursor-pointer font-normal" href={href} role="link" fontWeight="semibold">
          {label}
        </Link>
      </ListItem>
    ))}
  </UnorderedList>
);
export default NavigationOptions;

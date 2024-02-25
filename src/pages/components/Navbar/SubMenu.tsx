import React from 'react';
import { UnorderedList, ListItem, Link } from '@chakra-ui/react';

const SubMenu = ({ isVisible, onSelect }: { isVisible: boolean; onSelect: () => void }) => (
  <UnorderedList
    className={`navbar
      ${isVisible ? 'visible opacity-1' : 'hidden opacity-0'}
      ${isVisible ? '' : 'pointer-events-none'}
      space-y-5 lg:space-y-0 lg:space-x-5 transition-all duration-100`}
    data-test="sub-menu"
  >
    <ListItem className="transition-element">
      <Link className="cursor-pointer font-normal" href="#features" onClick={onSelect} fontWeight="semibold">
        Features
      </Link>
    </ListItem>
    <ListItem className="transition-element">
      <Link className="cursor-pointer font-normal" href="/about" type="button" onClick={onSelect} fontWeight="semibold">
        About
      </Link>
    </ListItem>
    <ListItem className="transition-element">
      <Link className="cursor-pointer font-normal" href="/docs" onClick={onSelect} fontWeight="semibold">
        Docs
      </Link>
    </ListItem>
    <ListItem className="transition-element">
      <Link
        className="cursor-pointer font-normal"
        href="/signup"
        role="link"
        type="button"
        onClick={onSelect}
        fontWeight="semibold"
      >
        Get an API Key
      </Link>
    </ListItem>
  </UnorderedList>
);
export default SubMenu;

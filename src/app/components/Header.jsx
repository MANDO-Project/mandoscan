'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@heroui/react';
import AuthControls from './AuthControls';

export const AcmeLogo = () => {
  return (
    <Image
      src="./mando_logo.svg"
      alt="MANDO Logo"
      width="900"
      height="900"
      viewBox="0 0 0 0"
      layout="intrinsic"
    />
  );
};

export default function Header() {
  return (
    <Navbar className="z-10 flex min-h-[80px] w-full flex-col justify-center border-b border-white border-opacity-10 px-20 leading-tight max-md:max-w-full max-md:px-5">
      <NavbarBrand>
        <AcmeLogo />
        <Link color="home" href={'https://mandoscan.com'}>
          Home
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-6 sm:flex" justify="left">
        <NavbarItem>
          <Link color="foreground" href={'https://mandoscan.com/#overview'}>
            Overview
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href={'https://mandoscan.com/#about'}>
            About MANDO
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={'https://mandoscan.com/#how_it_works'}>
            How It Works
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={'https://mandoscan.com/#product'}>
            Products
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={'https://mandoscan.com/#bu_model'}>
            Business Models
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={'https://mandoscan.com/#roadmap'}>
            Roadmap
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={'https://mandoscan.com/#team'}>
            Team
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <AuthControls />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

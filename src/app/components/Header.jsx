"use client"

import * as React from "react";
import Image from 'next/image';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";
import AuthControls from "./AuthControls";

export const AcmeLogo = () => {
  return (
    // <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    //   <path
    //     clipRule="evenodd"
    //     d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
    //     fill="currentColor"
    //     fillRule="evenodd"
    //   />
    // </svg>
    <Image
            src="./mando_logo.svg"
            alt="MANDO Logo"
            // fill='true'
            width="900"
            height="900"
            viewBox="0 0 0 0"
            layout="intrinsic"
          />
  );
};


export default function Header() {
  const navItems = [
    "Overview",
    "About Mando",
    "How It Works",
    "Technology",
    "Roadmap",
    "Team",
    "Mando Tool",
  ];

  return (
    <Navbar className="flex z-10 flex-col justify-center px-20 w-full leading-tight border-b border-white border-opacity-10 min-h-[80px] max-md:px-5 max-md:max-w-full">
      <NavbarBrand>
        <AcmeLogo />
        <Link color="home" href={"https://mandoscan.com"}>
            Home
          </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="left">
        <NavbarItem>
          <Link color="foreground" href={"https://mandoscan.com/#overview"}>
            Overview
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href={"https://mandoscan.com/#about"}>
            About MANDO
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={"https://mandoscan.com/#how_it_works"}>
            How It Works
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={"https://mandoscan.com/#product"}>
            Products
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={"https://mandoscan.com/#bu_model"}>
            Business Models
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={"https://mandoscan.com/#roadmap"}>
            Roadmap
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={"https://mandoscan.com/#team"}>
            Team
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login| </Link>
        </NavbarItem> */}
        <NavbarItem>
          {/* <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button> */}
            <AuthControls />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

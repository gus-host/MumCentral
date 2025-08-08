"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import Divider from "@mui/material/Divider";
import Image from "next/image";
import { MobileNavlinks } from "./NavLinks";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Link href={"/"} className="flex items-center gap-2 h-[61.67px]">
        <Image
          src={"/mumCentralLogo.png"}
          alt="Mum central logo"
          width={40}
          height={20}
        />
        <h1 className="text-[#4464ec] font-bold text-[16px]">MumCentral</h1>
      </Link>
      <Divider />
      <MobileNavlinks />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <GiHamburgerMenu />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

"use client";

import useResponsiveSizes from "@/helper/useResponsiveSizes";
import Image from "next/image";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import Link from "next/link";

export default function Header() {
  const { clientWidth } = useResponsiveSizes();
  return (
    <div className="py-1 px-4 border-b border-b-gray-100 bg-white flex items-center justify-between">
      <Link href={"/"} className="flex items-center gap-2 h-[68.79px]">
        <Image
          src={"/mumCentralLogo.png"}
          alt="Mum central logo"
          width={39}
          height={80}
        />
        <h1 className="text-[#4464ec] font-bold text-[20px]">MumCentral</h1>
      </Link>
      {(clientWidth as number) >= 550 ? <NavLinks /> : <MobileNav />}
    </div>
  );
}

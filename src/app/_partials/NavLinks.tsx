"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BiClinic } from "react-icons/bi";
import { GiGrowth } from "react-icons/gi";
import clsx from "clsx";

export default function NavLinks() {
  const pathName = usePathname();
  return (
    <nav className="">
      <ul className="flex gap-3">
        <li
          className={clsx(
            "text-[14px] border-b-2 p-2 transition hover:border-b-[#4464ec] hover:text-[#4464ec] active:bg-blue-50 cursor-pointer",
            pathName === "/" || pathName.includes("/facilities")
              ? "border-b-[#4464ec]  text-[#4464ec]"
              : "border-b-transparent"
          )}
        >
          <Link href={"/"} className="flex items-center gap-2">
            <BiClinic size={18} />
            <span>Facilities</span>
          </Link>
        </li>
        <li
          className={clsx(
            "text-[14px] border-b-2 p-2 transition hover:border-b-[#4464ec] hover:text-[#4464ec] active:bg-blue-50 cursor-pointer",
            pathName === "/growth"
              ? "border-b-[#4464ec]  text-[#4464ec]"
              : "border-b-transparent"
          )}
        >
          <Link href={"/growth"} className="flex items-center gap-2">
            <GiGrowth size={18} />
            <span>Growth Tracking</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export function MobileNavlinks() {
  const pathName = usePathname();
  return (
    <nav className="">
      <ul className="flex flex-col gap-3">
        <li
          className={clsx(
            "text-[14px] border-b-2 p-2 transition hover:border-b-[#4464ec] hover:text-[#4464ec] active:bg-blue-50 cursor-pointer inline-block w-[60%]",
            pathName === "/" || pathName.includes("/facilities")
              ? "border-b-[#4464ec]  text-[#4464ec]"
              : "border-b-transparent"
          )}
        >
          <Link href={"/"} className="flex items-center gap-2">
            <BiClinic size={18} />
            <span>Facilities</span>
          </Link>
        </li>
        <li
          className={clsx(
            "text-[14px] border-b-2 p-2 transition hover:border-b-[#4464ec] hover:text-[#4464ec] active:bg-blue-50 cursor-pointer inline-block w-[60%]",
            pathName === "/growth"
              ? "border-b-[#4464ec]  text-[#4464ec]"
              : "border-b-transparent"
          )}
        >
          <Link href={"/growth"} className="flex items-center gap-2">
            <GiGrowth size={18} />
            <span>Growth Tracking</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

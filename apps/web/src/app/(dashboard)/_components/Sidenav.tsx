"use client";

import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type SidenavItem = {
  name: string;
  href: string;
};

type SidenavSection = {
  name: string;
  items: SidenavItem[];
};

const sidenavSections: SidenavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        name: "Forsiden",
        href: "/admin",
      },
    ],
  },
  {
    name: "Produkter",
    items: [
      {
        name: "Alle produkter",
        href: "/admin/products",
      },
      {
        name: "Butikker",
        href: "/admin/stores",
      },
    ],
  },
  {
    name: "Disc Golf",
    items: [
      {
        name: "Merker",
        href: "/admin/brands",
      },
      {
        name: "Discer",
        href: "/admin/discs",
      },
      {
        name: "Pro Players",
        href: "/admin/pro-players",
      },
    ],
  },
];
const Sidenav = () => {
  const pathname = usePathname();

  return (
    <div>
      <ul className="menu bg-base-100 w-56 p-2 rounded-box">
        {sidenavSections.map((section) => (
          <React.Fragment key={section.name}>
            <li className="menu-title">
              <span>{section.name}</span>
            </li>
            {section.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx({
                    active: item.href === pathname,
                  })}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidenav;

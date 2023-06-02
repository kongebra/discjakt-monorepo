"use client";

import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import {
  FaCog,
  FaCompactDisc,
  FaHome,
  FaShoppingCart,
  FaStore,
  FaTasks,
  FaUser,
} from "react-icons/fa";
import { IconType } from "react-icons";

type SidenavLinkProps = {
  label: string;
  href: string;
  icon: IconType;
};

const navItems: SidenavLinkProps[] = [
  {
    label: "Forsiden",
    href: "/admin/dashboard",
    icon: FaHome,
  },
  {
    label: "Alle produkter",
    href: "/admin/products",
    icon: FaShoppingCart,
  },
  {
    label: "Butikker",
    href: "/admin/stores",
    icon: FaStore,
  },
  {
    label: "Merker",
    href: "/admin/brands",
    icon: FaStore,
  },
  {
    label: "Discer",
    href: "/admin/discs",
    icon: FaCompactDisc,
  },
  {
    label: "Pro Players",
    href: "/admin/pro-players",
    icon: FaUser,
  },
];

const SidenavLink: React.FC<SidenavLinkProps> = ({
  href,
  label,
  icon: Icon,
}) => {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "text-indigo-200 leading-6 text-sm p-2 rounded-md gap-x-3 flex -mx-2 hover:text-white hover:bg-indigo-700",
        {
          "text-white bg-indigo-700": active,
        }
      )}
    >
      <Icon
        className={clsx(
          "text-indigo-200 flex-shrink-0 w-6 h-6 hover:text-white",
          {
            "text-white": active,
          }
        )}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
};

const Sidenav = () => {
  return (
    <div className="lg:flex-col lg:w-72 lg:flex lg:z-50 lg:inset-y-0 lg:fixed hidden">
      <div className="pb-4 px-6 bg-indigo-600 bg-gradient-to-b from-indigo-600 to-purple-600 overflow-y-auto gap-y-5 flex-col flex flex-grow">
        <div className="flex items-center flex-shrink-0 h-16">
          <span className="text-indigo-100 text-2xl font-bold">DiscJakt</span>
        </div>

        <nav className="flex flex-col flex-1">
          <ul role="list" className="gap-y-7 flex flex-col flex-1">
            {/* Main Menu */}
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <SidenavLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                    />
                  </li>
                ))}
              </ul>
            </li>

            {/* Tasks */}
            <li>
              <div className="text-indigo-200 leading-6 font-semibold text-xs">
                Oppgaver
              </div>
              <ul role="list" className="gap-y-7 flex flex-col flex-1">
                <li>
                  <SidenavLink
                    href="/admin/tasks/product-to-disc"
                    label="Koble produkter"
                    icon={FaTasks}
                  />

                  <SidenavLink
                    href="/admin/tasks/product-categorisation"
                    label="Produkt kategorisering"
                    icon={FaTasks}
                  />
                </li>
              </ul>
            </li>

            {/* Settings */}
            <li className="mt-auto">
              <SidenavLink
                href="/admin/settings"
                label="Settings"
                icon={FaCog}
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidenav;

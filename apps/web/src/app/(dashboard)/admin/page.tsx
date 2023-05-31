import Link from "next/link";
import React from "react";

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
        href: "/admin/discgolf/brands",
      },
      {
        name: "Discer",
        href: "/admin/discgolf/discs",
      },
      {
        name: "Pro Players",
        href: "/admin/discgolf/pro-players",
      },
    ],
  },
];

export default function Page() {
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
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

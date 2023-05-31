import Link from "next/link";
import React from "react";

const navItems = [
  {
    name: "Forsiden",
    href: "/",
  },
  {
    name: "Dashboard",
    href: "/admin",
  },
];

const Navbar = () => {
  return (
    <nav className="navbar bg-primary text-primary-content">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">DiscJakt (Admin)</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

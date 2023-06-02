"use client";

import { Menu } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaCaretDown,
  FaChevronDown,
} from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="lg:px-8 sm:px-6 sm:gap-x-6 shadow-sm px-4 bg-white border-gray-200 border-b gap-x-4 items-center flex flex-shrink-0 h-16 z-40 top-0 sticky">
      <button type="button" className="lg:hidden text-gray-700 p-2.5 -m-2.5">
        <span className="sr-only">Open sidebar</span>
        {/* TODO: Finn en tynnere bars icon */}
        <FaBars className="w-6 h-6" />
      </button>

      <div className="lg:hidden bg-gray-900/10 w-px h-6" aria-hidden="true" />

      <div className="lg:gap-x-6 self-stretch gap-x-4 flex-1 flex">
        <form
          action="#"
          method="GET"
          id="search-form"
          className="flex relative flex-1"
        >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <FaSearch
            className="text-gray-400 w-5 h-full left-0 inset-y-0 absolute pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            id="search-field"
            placeholder="Search..."
            name="search"
            className="sm:text-sm text-gray-900 pr-0 pl-8 py-0 border-0 w-full h-full block focus:ring-0 focus:outline-none"
          />
        </form>

        <div className="lg:gap-x-6 gap-x-4 items-center flex">
          <div className="indicator">
            <div className="indicator-item badge badge-primary">3</div>
            <button
              type="button"
              className="text-gray-400 p-2.5 -m-2.5 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <FaBell className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div
            className="lg:bg-gray-900/10 lg:w-px lg:h-6 lg:block hidden"
            aria-hidden="true"
          />

          <Menu as="div" className="relative">
            <Menu.Button className="p-1.5 flex items-center -m-1.5">
              <span className="sr-only">Open user menu</span>
              <Image
                className="rounded-full w-8 h-8 bg-gray-50"
                src="https://new.sunesport.no/content/uploads/sites/2/2023/05/Opto-Fuse-Im-a-Fuse-300x300.jpg"
                alt="User picture"
                width={32}
                height={32}
              />
              <span className="lg:items-center lg:flex hidden">
                <span
                  className="text-gray-900 leading-6 font-semibold text-sm ml-4"
                  aria-hidden="true"
                >
                  Jonathan Fuse
                </span>
                <FaChevronDown
                  className={clsx("text-gray-400 w-5 h-5 ml-2", {
                    "rotate-90": false,
                  })}
                  aria-hidden="true"
                />
              </span>
            </Menu.Button>

            <Menu.Items
              as="div"
              className="ring-gray-900/5 ring-1 shadow-lg opacity-100 py-2 bg-white rounded-md transform scale-100 w-32 mt-2.5 z-10 absolute"
            >
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={clsx(
                      "text-gray-900 leading-6 text-sm py-1 px-3 block hover:bg-gray-50",
                      { "bg-gray-50": active }
                    )}
                    href="/account-settings"
                  >
                    Your account
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={clsx(
                      "text-gray-900 leading-6 text-sm py-1 px-3 block hover:bg-gray-50",
                      { "bg-gray-50": active }
                    )}
                    href="/account-settings"
                  >
                    Sign out
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

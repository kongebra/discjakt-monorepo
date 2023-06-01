import React from "react";
import Navbar from "./_components/Navbar";
import Sidenav from "./_components/Sidenav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      <div className="flex p-4 gap-4">
        <Sidenav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

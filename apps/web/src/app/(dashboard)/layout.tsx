import React from "react";
import Sidenav from "./_components/Sidenav";
import Topbar from "./_components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidenav />
      <div className="lg:pl-72">
        <Topbar />

        <main className="py-10">
          <div className="lg:px-8 sm:px-6 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

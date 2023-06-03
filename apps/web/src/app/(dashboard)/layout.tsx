import React from "react";
import Sidenav from "./_components/Sidenav";
import Topbar from "./_components/Topbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "Admin") {
  //   return redirect("/");
  // }

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

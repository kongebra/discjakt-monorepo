import React from "react"
import Navbar from "./_components/Navbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "Admin") {
  //   return redirect("/");
  // }

  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
    </div>
  )
}

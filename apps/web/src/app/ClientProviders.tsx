"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

type Props = React.PropsWithChildren<{}>;

const ClientProviders: React.FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientProviders;

"use client";
import { SessionProvider } from "next-auth/react";

import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import { RecoilRoot } from "recoil";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    
      <PrimeReactProvider>
        <RecoilRoot>
        <SessionProvider>
          <div>{children}</div>
        </SessionProvider>
        </RecoilRoot>
      </PrimeReactProvider>
    
  );
};

"use client"
import { SessionProvider } from "next-auth/react";

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
        

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <PrimeReactProvider>
  <SessionProvider>
    <div>
    {children}
    </div>
    </SessionProvider>
    </PrimeReactProvider>
    )
};

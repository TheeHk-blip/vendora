"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface DrawerContextProps {
  openDrawerId: string | null;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("useDrawer must be used within a DrawerProvider");
  return context;
}

export function DrawerProvider({ children}: {children: ReactNode}) {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  const openDrawer = (id: string) => setOpenDrawerId(id);
  const closeDrawer = () => setOpenDrawerId(null);

  return (
    <DrawerContext.Provider
      value={{
        openDrawerId,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}
"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface DrawerContextProps {
  open: Boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("useDrawer must be used within a DrawerProvider");
  return context;
}

export function DrawerProvider({ children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const toggleDrawer = () => setOpen((prev) => !prev);

  return (
    <DrawerContext.Provider
      value={{
        open,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}
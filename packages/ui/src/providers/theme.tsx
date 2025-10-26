"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import type { Attribute } from "next-themes";
import { LightMode, DarkMode } from "@mui/icons-material";

type ThemeName = "light" | "dark" | "system";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  // NextThemes provider must be a client component
  const attribute: Attribute = "class"
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Hook wrapper around next-themes that exposes `mounted` and a safe `toggle`.
 * Use this in your UI components to avoid hydration mismatches.
 */
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggle = useCallback(
    () =>   
      setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    [setTheme],
  );

  return {
    theme: (theme as ThemeName | null) ?? null,
    resolvedTheme: (resolvedTheme as "light" | "dark" | null) ?? null,
    setTheme,
    toggle,
    mounted,
  };
}

/**
 * Simple Toggle component that waits for hydration before rendering the icon
 * (prevents SSR/CSR icon mismatch).
 */
export function ThemeToggle() {
  const { resolvedTheme, toggle, mounted } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="gap-2 rounded-md p-0.5 shadow-sm shadow-black/30 dark:shadow-black dark:bg-zinc-800 cursor-pointer"
      type="button"
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <LightMode sx={{ color: "#25C2FF" }} />
        ) : (
          <DarkMode sx={{ color: "gray" }} />
        )
      ) : (
        <span className="inline-block w-6 h-6" aria-hidden />
      )}
    </button>
  );
}
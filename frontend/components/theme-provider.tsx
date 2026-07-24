"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We extract props this way to ensure compatibility with next-themes types
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

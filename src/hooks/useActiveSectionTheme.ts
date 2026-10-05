"use client";

import { useState } from "react";

export function useActiveSectionTheme(
  _headerHeight = 64,
  _resetKey?: string | null,
): "default" {
  const [activeTheme] = useState<"default">("default");

  return activeTheme;
}

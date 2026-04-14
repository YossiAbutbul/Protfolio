"use client";

import dynamic from "next/dynamic";

import { useReducedMotion, useIsTouch } from "./useReducedMotion";

// Lazy-load the WebGL scene so SSR doesn't touch window / three.
const LiquidCursorScene = dynamic(() => import("./LiquidCursorScene"), { ssr: false });

export default function LiquidCursor() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  if (reduced || touch) return null;
  return <LiquidCursorScene />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { TYPEWRITER_SPEED } from "@/config/story";

/**
 * Reveals `text` one character at a time. Returns the revealed substring and
 * whether it's finished. Resets whenever `text` changes (new story line).
 */
export function useTypewriter(text: string): { shown: string; done: boolean } {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number>(0);

  useEffect(() => {
    setCount(0);
    start.current = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start.current) / 1000;
      const target = Math.min(
        Math.floor(elapsed / TYPEWRITER_SPEED),
        text.length,
      );
      setCount(target);
      if (target < text.length) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [text]);

  return { shown: text.slice(0, count), done: count >= text.length };
}

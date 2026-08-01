"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Which island is open, and where we are in the journey to its landing page.
 *
 * The whole round trip, and who drives each beat:
 *
 *   idle ──select()──▶ approach ──arrive()──▶ unroll ──▶ hold ──▶ wipe ──▶ page
 *     ▲                 (3D: fly in)          └────── curtain timers ──────┘
 *     │                                                                     │
 *     │                                                        requestBack()│
 *   return ◀── roll ◀── unwipe ◀──────────────────────────────────────────┘
 *  (3D: fly out)  └── curtain timers ──┘
 *
 * `approach` and `return` belong to the 3D layer — only the camera knows when
 * it has landed. Everything between belongs to the curtain, which advances on
 * timers matched to its own CSS durations (config/curtain.ts). Landing content
 * is mounted for wipe · page · unwipe, so it is always revealed and hidden
 * behind a fully-drawn curtain.
 *
 * Every transition is guarded on the phase it comes from, so a late timer or a
 * double click is a harmless no-op.
 */
export type SelectionPhase =
  | "idle"
  | "approach"
  | "unroll"
  | "hold"
  | "wipe"
  | "page"
  | "unwipe"
  | "roll"
  | "return";

export interface SelectionState {
  /** Island id, or null when nothing is selected. */
  selectedId: string | null;
  phase: SelectionPhase;
  /** idle → approach. Ignored unless idle, so double-clicks can't stack. */
  select: (id: string) => void;
  /** approach → unroll. Called by the camera when it reaches the island. */
  arrive: () => void;
  /** Guarded step used by the curtain to walk its own beats. */
  advance: (from: SelectionPhase, to: SelectionPhase) => void;
  /** page → unwipe. The back control on the landing page. */
  requestBack: () => void;
  /** return → idle. Called by the camera once it is back on the map. */
  finishReturn: () => void;
}

const SelectionContext = createContext<SelectionState | null>(null);

/**
 * Owns the selection state. Mounted OUTSIDE the R3F canvas — React context does
 * not cross the canvas boundary, so the value is handed to the 3D side as a
 * prop and re-provided in there by <SelectionBridge>. Same pattern the story
 * step already uses (storyContext → CreationStepProvider).
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  // Id and phase live in ONE state object so every transition is a single
  // atomic, pure update — an updater that also called a second setter would
  // double-fire under StrictMode.
  const [sel, setSel] = useState<{
    selectedId: string | null;
    phase: SelectionPhase;
  }>({ selectedId: null, phase: "idle" });

  const select = useCallback((id: string) => {
    setSel((s) =>
      s.phase === "idle" ? { selectedId: id, phase: "approach" } : s,
    );
  }, []);

  const advance = useCallback((from: SelectionPhase, to: SelectionPhase) => {
    setSel((s) => {
      if (s.phase !== from) return s;
      return to === "idle"
        ? { selectedId: null, phase: "idle" }
        : { ...s, phase: to };
    });
  }, []);

  const arrive = useCallback(() => {
    advance("approach", "unroll");
  }, [advance]);

  const requestBack = useCallback(() => {
    advance("page", "unwipe");
  }, [advance]);

  const finishReturn = useCallback(() => {
    advance("return", "idle");
  }, [advance]);

  const value = useMemo<SelectionState>(
    () => ({
      selectedId: sel.selectedId,
      phase: sel.phase,
      select,
      arrive,
      advance,
      requestBack,
      finishReturn,
    }),
    [sel, select, arrive, advance, requestBack, finishReturn],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

/**
 * Re-provides the very same context value inside the R3F canvas, from the prop
 * Experience receives. One context object, provided in both trees, so
 * useSelection() works identically in DOM components and in 3D ones.
 */
export function SelectionBridge({
  value,
  children,
}: {
  value: SelectionState;
  children: ReactNode;
}) {
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): SelectionState {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error(
      "useSelection must be used inside <SelectionProvider> (DOM) or <SelectionBridge> (canvas)",
    );
  }
  return ctx;
}

# Immersive Portfolio

Production-ready foundation for an immersive 3D portfolio built with Next.js 15 (App Router), TypeScript, Tailwind CSS, React Three Fiber, and Drei. Ships an empty, fullscreen WebGL canvas — no animations, UI, or content islands yet.

## Stack

- **Next.js 15.5.20** (App Router, React 19)
- **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS 3**
- **React Three Fiber 9** + **Drei 10**
- **three 0.172**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Architecture

The page is a server component that mounts a server-side composition root
(`Scene`), which wires a client-only R3F `Canvas` (`CanvasWrapper`) around the
scene contents (`Experience`). Only the canvas and scene graph are client code;
everything above stays on the server. Camera and renderer defaults live in
`src/config/scene.ts` and are typed by `src/types/three.ts`.

## Folder structure

```
src/
├── app/                  # App Router: layout, page, global styles
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── three/            # WebGL / R3F components
│   │   ├── CanvasWrapper.tsx   # "use client" — the R3F <Canvas>
│   │   ├── Scene.tsx          # server composition root
│   │   └── Experience.tsx     # empty scene graph (add content here)
│   └── layout/           # future 2D/DOM layout components
├── config/
│   └── scene.ts          # camera + renderer configuration
├── hooks/                # future custom hooks
├── lib/                  # future utilities
└── types/
    └── three.ts          # shared 3D types
public/
├── models/               # .glb / .gltf assets
└── textures/             # image / HDR assets
```

## Where to build next

Add meshes, lights, environments, and camera rigs inside
`src/components/three/Experience.tsx`. Async assets loaded via Drei/`useLoader`
are already covered by the `Suspense` boundary there. GLSL files (`.glsl`,
`.vert`, `.frag`) import as raw strings via the webpack rule in `next.config.mjs`.

# Design direction

## Core idea

The portfolio is an interactive exhibition in space. Each major project is represented by a unique real-time 3D world instead of a card in a long document.

## Journey

1. **Origin portal** — introduces Prakash and the perceive–reason–act philosophy.
2. **VLA Arm** — an articulated robotic manipulator with scanning rings.
3. **Voice Core** — a pulsing conversational core with orbital signals and waveform particles.
4. **Data Orbit** — a procedural data city connected to a central intelligence node.
5. **Open Signal** — a luminous constellation that becomes the contact destination.

## Interaction principles

- The visitor always remains inside one continuous universe.
- Navigation is discrete enough to prevent accidental skipping but transitions remain physically smooth.
- Text stays sparse and secondary to the scene.
- Detailed engineering information is available on demand rather than covering the 3D composition.
- Audio is generated in the browser and begins only after the visitor explicitly enters.

## Rendering

The universe uses a small custom WebGL renderer with procedural geometry. It does not download 3D models or rely on a framework. This keeps the deployment static and lets motion, lighting, particles, project objects, and camera travel share one coherent system.

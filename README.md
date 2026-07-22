# Prakash Mohit — Universe Portfolio

A static, real-time 3D portfolio designed as a navigable universe rather than a conventional scrolling page.

## Experience

- Entry portal and cinematic onboarding
- Continuous travel through five spatial chapters
- Procedural 3D project worlds rendered with WebGL
- Distinct environments for the VLA robotic arm, offline voice system, placement platform, and contact signal
- Wheel, keyboard, route, button, and swipe navigation
- Optional procedural ambient audio and transition sound
- Expandable system architecture panels
- Responsive mobile layout
- Reduced-motion support and WebGL fallback

## Deploy on Cloudflare Pages

### Direct upload

1. Extract the ZIP.
2. Open **Cloudflare Dashboard → Workers & Pages**.
3. Choose **Create → Pages → Upload assets**.
4. Upload the extracted folder.
5. Deploy.

### Git deployment

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`
- Root directory: the folder containing `index.html`

No package installation or build step is required.

## Main files

- `index.html` — semantic interface and project content
- `styles.css` — responsive HUD, portal, transitions, and project panel
- `app.js` — navigation, sound engine, WebGL renderer, procedural worlds
- `_headers` — Cloudflare security headers
- `_redirects` — single-page route fallback

## Customization

The portfolio copy and project metadata are at the beginning of `app.js` in the `worlds` array. Colors can be changed in each world's `accent` value and in the `palette` array used by the renderer.

## Controls

- Mouse wheel / trackpad: travel between worlds
- Arrow keys / Page Up / Page Down / Space: navigate
- Route points: jump directly to a world
- Swipe: navigate on touch devices
- Sound button: enable or disable the ambient soundscape

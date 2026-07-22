const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarse = matchMedia('(pointer: coarse)').matches;

const worlds = [
  {
    slug: 'origin', orbit: '00', kind: 'ORIGIN', accent: '#9deeff',
    kicker: 'AI ENGINEER · EMBODIED INTELLIGENCE',
    title: 'Prakash<br><em>Mohit.</em>',
    plainTitle: 'Prakash Mohit',
    description: 'Building systems that perceive, reason, and act—from local AI pipelines to machines that move in the physical world.',
    tags: ['Embodied AI', 'Local agents', 'Robotics'],
    status: 'AVAILABLE · INDIA',
    panelKicker: 'ENGINEERING PHILOSOPHY',
    summary: 'I do not want to merely use intelligent systems. I want to understand their internal boundaries, build them from first principles, and connect intelligence to real action.',
    flow: ['Perceive the signal', 'Reason about intent', 'Plan an action', 'Build the complete system'],
    decisions: [
      'First principles before black-box convenience.',
      'Complete systems over isolated demos.',
      'Local and inspectable intelligence wherever practical.'
    ],
    next: 'Deepening computer vision, robot motion planning, and Vision–Language–Action research at IIT Madras.'
  },
  {
    slug: 'vla-arm', orbit: '01', kind: 'EMBODIED AI', accent: '#8fdcff',
    kicker: 'VISION → LANGUAGE → PHYSICAL ACTION',
    title: 'VLA<br><em>Robotic Arm.</em>',
    plainTitle: 'Vision–Language–Action Robotic Arm',
    description: 'A robotic system that sees its environment, understands a natural-language task, plans motion, and acts through real hardware.',
    tags: ['Computer vision', 'Inverse kinematics', 'ESP32'],
    status: 'RESEARCH PROTOTYPE · 60%',
    panelKicker: 'EMBODIED AI · ACTIVE BUILD',
    summary: 'A modular embodied AI pipeline that turns a spoken or typed instruction into safe, inspectable physical motion—without hiding perception, planning, and control inside one opaque call.',
    flow: ['Camera perception', 'Vision grounding', 'Language understanding', 'Task planning', 'Inverse kinematics', 'Servo actuation'],
    decisions: [
      'Keep perception, reasoning, planning, and actuation independently testable.',
      'Never allow unconstrained model output to directly control hardware.',
      'Prefer closed-loop visual feedback over open-loop movement.'
    ],
    next: 'Calibrate camera-to-world coordinates, improve object grounding, and close the control loop with visual feedback.'
  },
  {
    slug: 'voice-core', orbit: '02', kind: 'LOCAL VOICE AI', accent: '#ca9dff',
    kicker: 'PRIVATE INTELLIGENCE · ZERO CLOUD DEPENDENCY',
    title: 'Offline<br><em>Voice Core.</em>',
    plainTitle: 'Offline AI Voice Assistant',
    description: 'A private conversational system for listening, reasoning, memory, and speech—running entirely on local hardware.',
    tags: ['Faster Whisper', 'Ollama', 'Piper TTS'],
    status: 'LOCAL PROTOTYPE · 55%',
    panelKicker: 'VOICE AI · LOCAL-FIRST',
    summary: 'A component-based voice assistant where every stage—speech detection, transcription, reasoning, memory, and synthesis—remains visible, replaceable, and locally controlled.',
    flow: ['Microphone', 'Voice activity detection', 'Faster Whisper', 'Local LLM', 'Explicit memory', 'Piper speech synthesis'],
    decisions: [
      'Ordinary conversation should not require an external API.',
      'Optimize the full latency path rather than one benchmark component.',
      'Keep memory understandable and under user control.'
    ],
    next: 'Improve interruption handling, make long-term memory controllable, and reduce end-to-end conversational latency.'
  },
  {
    slug: 'data-orbit', orbit: '03', kind: 'INTELLIGENT SOFTWARE', accent: '#ffd58b',
    kicker: 'STRUCTURED DATA · AUTOMATION · AI SEARCH',
    title: 'Placement<br><em>Data Orbit.</em>',
    plainTitle: 'Placement Intelligence Platform',
    description: 'A practical operations platform connecting structured placement data, browser automation, and AI-assisted discovery.',
    tags: ['Flask', 'SQLite', 'Automation'],
    status: 'ACTIVE DEVELOPMENT · 70%',
    panelKicker: 'FULL-STACK AI · IIT MADRAS',
    summary: 'A system that turns fragmented placement information and repetitive workflows into a structured, searchable, automation-ready operational platform.',
    flow: ['Browser automation', 'Data processing', 'Structured database', 'Flask services', 'AI-assisted search', 'Operational interface'],
    decisions: [
      'The structured database—not the language model—remains the source of truth.',
      'Compose automation from small observable units rather than one fragile script.',
      'Use AI only where it meaningfully improves discovery or workflow speed.'
    ],
    next: 'Add stronger observability, semantic search, and reusable automation modules for proven workflows.'
  },
  {
    slug: 'signal', orbit: '04', kind: 'OPEN CHANNEL', accent: '#dfffc2',
    kicker: 'THE NEXT SYSTEM STARTS WITH A SIGNAL',
    title: 'Build what<br><em>moves next.</em>',
    plainTitle: 'Open channel',
    description: 'I am open to AI engineering, ML, software, intelligent systems, robotics, and autonomous-agent opportunities.',
    tags: ['IIT Madras', 'NASA Top 10', 'Prayagraj'],
    status: 'AVAILABLE FOR OPPORTUNITIES',
    panelKicker: 'CONTACT · COLLABORATION',
    summary: 'Prakash is building toward intelligent systems that bridge software, perception, language, and real-world action.',
    flow: ['Email: hello@prakashmohit.dev', 'GitHub: PrakashMohit', 'LinkedIn: prakash-mohit-a59b71259'],
    decisions: [
      'AI Engineering, ML, and software roles.',
      'Generative AI, robotics, and autonomous-agent collaborations.',
      'Technically ambitious systems with real-world impact.'
    ],
    next: 'Send a signal at hello@prakashmohit.dev.'
  }
];

const cameraKeys = [
  { p: [0.0, 0.15, 8.4], t: [0, 0, 0] },
  { p: [3.35, 0.65, -16.4], t: [0, -0.05, -24] },
  { p: [-3.15, 0.25, -40.1], t: [0, 0, -48] },
  { p: [2.85, 1.55, -64.0], t: [0, -0.05, -72] },
  { p: [0.0, 0.2, -87.7], t: [0, 0, -96] }
];

let entered = false;
let stage = 0;
let travel = 0;
let targetTravel = 0;
let velocity = 0;
let lastTravel = 0;
let lastFrame = performance.now();
let wheelBuffer = 0;
let wheelLockUntil = 0;
let mouseX = 0;
let mouseY = 0;
let mouseRX = 0;
let mouseRY = 0;
let sceneReady = false;
let audio = null;
let soundOn = false;
let touchStart = null;

const loader = $('[data-loader]');
const loaderTrack = $('.loader__track i');
const loaderNumber = $('.loader b');
const gate = $('[data-gate]');
const enterButton = $('[data-enter]');
const experience = $('.experience');
const worldCopy = $('[data-world-copy]');
const routeProgress = $('[data-route-progress]');
const travelHint = $('[data-travel-hint]');
const panel = $('[data-panel]');
const soundButton = $('[data-sound]');
const canvas = $('#universe');

let loadValue = 0;
const loadingTimer = setInterval(() => {
  const ceiling = sceneReady ? 100 : 88;
  loadValue += Math.max(1, Math.ceil((ceiling - loadValue) * .08));
  loadValue = Math.min(ceiling, loadValue);
  loaderTrack.style.width = `${loadValue}%`;
  loaderNumber.textContent = String(loadValue).padStart(2, '0');
  if (sceneReady && loadValue >= 100) {
    clearInterval(loadingTimer);
    setTimeout(() => {
      loader.classList.add('is-complete');
      document.body.classList.remove('is-loading');
      setTimeout(() => loader.hidden = true, 1000);
    }, reducedMotion ? 0 : 180);
  }
}, 55);

function setWorld(next, source = 'navigation') {
  next = clamp(next, 0, worlds.length - 1);
  if (next === stage && source !== 'initial') return;
  const previous = stage;
  stage = next;
  targetTravel = next;
  travelHint.classList.add('is-hidden');
  history.replaceState(null, '', `#${worlds[next].slug}`);
  if (entered && previous !== next) playWhoosh(next > previous ? 1 : -1);

  worldCopy.classList.add('is-leaving');
  worldCopy.classList.remove('is-active');
  setTimeout(() => {
    const world = worlds[next];
    document.documentElement.style.setProperty('--accent', world.accent);
    $('[data-orbit]').textContent = world.orbit;
    $('[data-kind]').textContent = world.kind;
    $('[data-kicker]').textContent = world.kicker;
    $('[data-title]').innerHTML = world.title;
    $('[data-description]').textContent = world.description;
    $('[data-tags]').innerHTML = world.tags.map(tag => `<span>${tag}</span>`).join('');
    $('[data-mobile-index]').textContent = String(next + 1).padStart(2, '0');
    $('[data-status]').textContent = world.status;
    $('[data-open-world] span').textContent = next === 4 ? 'Open channel' : 'Explore this world';
    $$('.route button').forEach((button, index) => button.classList.toggle('is-active', index === next));
    routeProgress.style.height = `${next / (worlds.length - 1) * 100}%`;
    worldCopy.classList.remove('is-leaving');
    worldCopy.classList.add('is-active');
  }, reducedMotion ? 0 : 330);
}

function enterUniverse() {
  if (entered) return;
  entered = true;
  gate.classList.add('is-hidden');
  experience.classList.add('is-active');
  setWorld(stage, 'initial');
  if (!reducedMotion) enableSound(true);
  setTimeout(() => experience.focus?.(), 600);
}

function moveStage(direction) {
  if (!entered || panel.open) return;
  setWorld(stage + direction);
}

enterButton.addEventListener('click', enterUniverse);
$$('[data-go]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  if (!entered) enterUniverse();
  setWorld(Number(button.dataset.go));
}));
$('[data-prev]').addEventListener('click', () => moveStage(-1));
$('[data-next]').addEventListener('click', () => moveStage(1));

window.addEventListener('wheel', event => {
  if (!entered || panel.open) return;
  event.preventDefault();
  const now = performance.now();
  if (now < wheelLockUntil) return;
  wheelBuffer += event.deltaY;
  if (Math.abs(wheelBuffer) > 42) {
    moveStage(Math.sign(wheelBuffer));
    wheelBuffer = 0;
    wheelLockUntil = now + (reducedMotion ? 150 : 760);
  }
}, { passive: false });

window.addEventListener('keydown', event => {
  if (!entered && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); enterUniverse(); return; }
  if (panel.open) return;
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); moveStage(1); }
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); moveStage(-1); }
  if (event.key === 'Home') setWorld(0);
  if (event.key === 'End') setWorld(4);
});

window.addEventListener('touchstart', event => {
  if (!entered || panel.open) return;
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY, time: performance.now() };
}, { passive: true });
window.addEventListener('touchend', event => {
  if (!touchStart || !entered || panel.open) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;
  if (Math.abs(primary) > 42) moveStage(primary < 0 ? 1 : -1);
  touchStart = null;
}, { passive: true });
window.addEventListener('pointermove', event => {
  mouseX = (event.clientX / innerWidth - .5) * 2;
  mouseY = -((event.clientY / innerHeight - .5) * 2);
}, { passive: true });

function fillPanel(world) {
  $('[data-panel-orbit]').textContent = `${world.orbit} / ${world.kind}`;
  $('[data-panel-status]').textContent = world.status;
  $('[data-panel-kicker]').textContent = world.panelKicker;
  $('[data-panel-title]').textContent = world.plainTitle;
  $('[data-panel-summary]').textContent = world.summary;
  $('[data-panel-flow]').innerHTML = world.flow.map(item => `<li>${item}</li>`).join('');
  $('[data-panel-decisions]').innerHTML = world.decisions.map(item => `<li>${item}</li>`).join('');
  $('[data-panel-next]').textContent = world.next;
}
$('[data-open-world]').addEventListener('click', () => {
  fillPanel(worlds[stage]);
  panel.showModal();
});
$$('[data-close-panel]').forEach(button => button.addEventListener('click', () => panel.close()));
panel.addEventListener('cancel', event => { event.preventDefault(); panel.close(); });

function createAudio() {
  if (audio) return audio;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const low = ctx.createOscillator();
  const lowGain = ctx.createGain();
  low.type = 'sine'; low.frequency.value = 42; lowGain.gain.value = .32;
  low.connect(lowGain).connect(master); low.start();

  const high = ctx.createOscillator();
  const highGain = ctx.createGain();
  high.type = 'sine'; high.frequency.value = 83; highGain.gain.value = .08;
  high.connect(highGain).connect(master); high.start();

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  noise.buffer = buffer; noise.loop = true;
  filter.type = 'lowpass'; filter.frequency.value = 480;
  noiseGain.gain.value = .08;
  noise.connect(filter).connect(noiseGain).connect(master); noise.start();

  audio = { ctx, master, low, high };
  return audio;
}

function enableSound(force) {
  const engine = createAudio();
  if (!engine) return;
  soundOn = force ?? !soundOn;
  engine.ctx.resume();
  const now = engine.ctx.currentTime;
  engine.master.gain.cancelScheduledValues(now);
  engine.master.gain.linearRampToValueAtTime(soundOn ? .045 : 0, now + .6);
  soundButton.setAttribute('aria-pressed', String(soundOn));
}
soundButton.addEventListener('click', () => enableSound());

function playWhoosh(direction) {
  if (!soundOn || !audio) return;
  const { ctx, master } = audio;
  const duration = .75;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'bandpass';
  filter.Q.value = .7;
  filter.frequency.setValueAtTime(direction > 0 ? 260 : 760, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(direction > 0 ? 1200 : 180, ctx.currentTime + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(.3, ctx.currentTime + .08);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(master);
  source.start();
}

// Procedural WebGL universe. No external 3D models or runtime dependencies.
let gl;
let meshProgram;
let pointProgram;
let lineProgram;
let rendererReady = false;
let pixelRatio = 1;
let projection = new Float32Array(16);
let view = new Float32Array(16);
let cameraPosition = [0, 0, 8];
const meshes = {};
const stars = {};
const dynamicPoints = {};
const palette = [
  [0.61, 0.93, 1.0],
  [0.45, 0.79, 1.0],
  [0.76, 0.54, 1.0],
  [1.0, 0.74, 0.36],
  [0.77, 1.0, 0.63]
];

const meshVertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform vec3 uCamera;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vDistance;
void main(){
  vec4 world = uModel * vec4(aPosition, 1.0);
  vec4 viewPos = uView * world;
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * aNormal);
  vDistance = length(world.xyz - uCamera);
  gl_Position = uProjection * viewPos;
}`;

const meshFragmentSource = `
precision highp float;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec3 uCamera;
uniform float uEmissive;
uniform float uAlpha;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vDistance;
void main(){
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(uCamera - vWorld);
  vec3 lightA = normalize(vec3(0.5, 0.9, 0.45));
  vec3 lightB = normalize(vec3(-0.75, 0.25, -0.55));
  float diff = max(dot(n, lightA), 0.0);
  float fill = max(dot(n, lightB), 0.0);
  float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
  vec3 halfDir = normalize(lightA + viewDir);
  float spec = pow(max(dot(n, halfDir), 0.0), 54.0);
  vec3 lit = uColor * (0.12 + diff * 0.8 + fill * 0.16);
  lit += vec3(0.82, 0.91, 1.0) * spec * 0.72;
  lit += uAccent * fres * (0.22 + uEmissive * 0.28);
  lit += uColor * uEmissive * (0.72 + 0.16 * sin(uTime * 1.7));
  float fog = smoothstep(21.0, 46.0, vDistance);
  vec3 fogColor = vec3(0.003, 0.007, 0.018);
  gl_FragColor = vec4(mix(lit, fogColor, fog), uAlpha * (1.0 - fog * 0.58));
}`;

const pointVertexSource = `
attribute vec3 aPosition;
attribute float aSeed;
uniform mat4 uProjection;
uniform mat4 uView;
uniform float uPixelRatio;
uniform float uVelocity;
uniform float uSize;
uniform vec3 uCamera;
varying float vAlpha;
varying float vSeed;
void main(){
  vec4 viewPos = uView * vec4(aPosition, 1.0);
  float distanceToCamera = max(1.0, length(aPosition - uCamera));
  float perspective = clamp(58.0 / distanceToCamera, 0.35, 4.5);
  gl_PointSize = (uSize + aSeed * 1.8) * uPixelRatio * perspective * (1.0 + uVelocity * 0.65);
  vAlpha = clamp(1.3 - distanceToCamera / 70.0, 0.08, 1.0);
  vSeed = aSeed;
  gl_Position = uProjection * viewPos;
}`;

const pointFragmentSource = `
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
varying float vSeed;
void main(){
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float core = smoothstep(0.22, 0.0, d);
  float halo = smoothstep(0.5, 0.08, d) * 0.38;
  float alpha = (core + halo) * vAlpha * uOpacity;
  if(alpha < 0.01) discard;
  vec3 color = mix(uColor, vec3(1.0), core * 0.72 + vSeed * 0.08);
  gl_FragColor = vec4(color, alpha);
}`;

const lineVertexSource = `
attribute vec3 aPosition;
uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uCamera;
uniform float uStretch;
varying float vDistance;
void main(){
  vec3 p = aPosition;
  p.z += sign(aPosition.z - uCamera.z) * uStretch;
  vDistance = length(p - uCamera);
  gl_Position = uProjection * uView * vec4(p, 1.0);
}`;

const lineFragmentSource = `
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
varying float vDistance;
void main(){
  float fog = smoothstep(20.0, 70.0, vDistance);
  gl_FragColor = vec4(uColor, uOpacity * (1.0 - fog));
}`;

function shader(type, source) {
  const value = gl.createShader(type);
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(value);
    gl.deleteShader(value);
    throw new Error(message || 'Shader compilation failed');
  }
  return value;
}

function program(vertexSource, fragmentSource) {
  const value = gl.createProgram();
  const vertex = shader(gl.VERTEX_SHADER, vertexSource);
  const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(value, vertex);
  gl.attachShader(value, fragment);
  gl.linkProgram(value);
  if (!gl.getProgramParameter(value, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(value) || 'Program linking failed');
  }
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return value;
}

function createProgramInfo(vertexSource, fragmentSource, attributes, uniformsList) {
  const value = program(vertexSource, fragmentSource);
  const info = { value, attributes: {}, uniforms: {} };
  for (const name of attributes) info.attributes[name] = gl.getAttribLocation(value, name);
  for (const name of uniformsList) info.uniforms[name] = gl.getUniformLocation(value, name);
  return info;
}

function identity() {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}

function multiply(a, b) {
  const out = new Float32Array(16);
  const a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15];
  let b0=b[0],b1=b[1],b2=b[2],b3=b[3];out[0]=b0*a00+b1*a10+b2*a20+b3*a30;out[1]=b0*a01+b1*a11+b2*a21+b3*a31;out[2]=b0*a02+b1*a12+b2*a22+b3*a32;out[3]=b0*a03+b1*a13+b2*a23+b3*a33;
  b0=b[4];b1=b[5];b2=b[6];b3=b[7];out[4]=b0*a00+b1*a10+b2*a20+b3*a30;out[5]=b0*a01+b1*a11+b2*a21+b3*a31;out[6]=b0*a02+b1*a12+b2*a22+b3*a32;out[7]=b0*a03+b1*a13+b2*a23+b3*a33;
  b0=b[8];b1=b[9];b2=b[10];b3=b[11];out[8]=b0*a00+b1*a10+b2*a20+b3*a30;out[9]=b0*a01+b1*a11+b2*a21+b3*a31;out[10]=b0*a02+b1*a12+b2*a22+b3*a32;out[11]=b0*a03+b1*a13+b2*a23+b3*a33;
  b0=b[12];b1=b[13];b2=b[14];b3=b[15];out[12]=b0*a00+b1*a10+b2*a20+b3*a30;out[13]=b0*a01+b1*a11+b2*a21+b3*a31;out[14]=b0*a02+b1*a12+b2*a22+b3*a32;out[15]=b0*a03+b1*a13+b2*a23+b3*a33;
  return out;
}

function translation(x, y, z) {
  const out = identity(); out[12]=x; out[13]=y; out[14]=z; return out;
}
function scaling(x, y, z) {
  const out = identity(); out[0]=x; out[5]=y; out[10]=z; return out;
}
function rotationX(a) {
  const c=Math.cos(a),s=Math.sin(a);return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
}
function rotationY(a) {
  const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
}
function rotationZ(a) {
  const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
}
function modelMatrix(position=[0,0,0], rotation=[0,0,0], scale=[1,1,1]) {
  let m = translation(position[0], position[1], position[2]);
  m = multiply(m, rotationZ(rotation[2] || 0));
  m = multiply(m, rotationY(rotation[1] || 0));
  m = multiply(m, rotationX(rotation[0] || 0));
  return multiply(m, scaling(scale[0], scale[1], scale[2]));
}

function perspectiveMatrix(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0]=f/aspect;out[5]=f;out[10]=(far+near)*nf;out[11]=-1;out[14]=2*far*near*nf;
  return out;
}

function normalize3(v) {
  const l=Math.hypot(v[0],v[1],v[2])||1;return [v[0]/l,v[1]/l,v[2]/l];
}
function cross3(a,b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
function subtract3(a,b) { return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
function add3(a,b) { return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
function scale3(v,s) { return [v[0]*s,v[1]*s,v[2]*s]; }

function lookAtMatrix(eye, center, up=[0,1,0]) {
  const z = normalize3(subtract3(eye, center));
  const x = normalize3(cross3(up, z));
  const y = cross3(z, x);
  const out = identity();
  out[0]=x[0];out[1]=y[0];out[2]=z[0];
  out[4]=x[1];out[5]=y[1];out[6]=z[1];
  out[8]=x[2];out[9]=y[2];out[10]=z[2];
  out[12]=-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]);
  out[13]=-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]);
  out[14]=-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]);
  return out;
}

function basisMatrix(start, end, radius=1) {
  const direction = subtract3(end, start);
  const length = Math.hypot(...direction) || 0.001;
  const y = normalize3(direction);
  const helper = Math.abs(y[1]) > .92 ? [1,0,0] : [0,1,0];
  const x = normalize3(cross3(helper, y));
  const z = normalize3(cross3(y, x));
  const mid = scale3(add3(start, end), .5);
  return new Float32Array([
    x[0]*radius,x[1]*radius,x[2]*radius,0,
    y[0]*length,y[1]*length,y[2]*length,0,
    z[0]*radius,z[1]*radius,z[2]*radius,0,
    mid[0],mid[1],mid[2],1
  ]);
}

function meshFromData(positions, normals, indices) {
  const mesh = { count: indices.length };
  mesh.position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  mesh.normal = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  mesh.index = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return mesh;
}

function createSphere(segments=28, rings=18) {
  const p=[],n=[],idx=[];
  for(let y=0;y<=rings;y++){
    const v=y/rings,phi=v*Math.PI;
    for(let x=0;x<=segments;x++){
      const u=x/segments,theta=u*Math.PI*2;
      const sx=Math.sin(phi)*Math.cos(theta),sy=Math.cos(phi),sz=Math.sin(phi)*Math.sin(theta);
      p.push(sx,sy,sz);n.push(sx,sy,sz);
    }
  }
  for(let y=0;y<rings;y++)for(let x=0;x<segments;x++){
    const a=y*(segments+1)+x,b=a+segments+1;
    idx.push(a,b,a+1,b,b+1,a+1);
  }
  return meshFromData(p,n,idx);
}

function createTorus(major=.75, minor=.12, radial=42, tubular=12) {
  const p=[],n=[],idx=[];
  for(let j=0;j<=tubular;j++){
    const v=j/tubular*Math.PI*2;
    for(let i=0;i<=radial;i++){
      const u=i/radial*Math.PI*2;
      const cx=Math.cos(u),cy=Math.sin(u),cv=Math.cos(v),sv=Math.sin(v);
      p.push((major+minor*cv)*cx,(major+minor*cv)*cy,minor*sv);
      n.push(cv*cx,cv*cy,sv);
    }
  }
  for(let j=0;j<tubular;j++)for(let i=0;i<radial;i++){
    const a=j*(radial+1)+i,b=(j+1)*(radial+1)+i;
    idx.push(a,b,a+1,b,b+1,a+1);
  }
  return meshFromData(p,n,idx);
}

function createCylinder(segments=24) {
  const p=[],n=[],idx=[];
  for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
    p.push(c,-.5,s,c,.5,s);n.push(c,0,s,c,0,s);
  }
  for(let i=0;i<segments;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}
  const baseIndex=p.length/3;
  p.push(0,-.5,0,0,.5,0);n.push(0,-1,0,0,1,0);
  for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
    p.push(c,-.5,s,c,.5,s);n.push(0,-1,0,0,1,0);
  }
  for(let i=0;i<segments;i++){
    const r=baseIndex+2+i*2;
    idx.push(baseIndex,r+2,r,baseIndex+1,r+1,r+3);
  }
  return meshFromData(p,n,idx);
}

function createBox() {
  const p=[
    -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
    1,-1,-1, -1,-1,-1, -1,1,-1, 1,1,-1,
    -1,1,1, 1,1,1, 1,1,-1, -1,1,-1,
    -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1,
    1,-1,1, 1,-1,-1, 1,1,-1, 1,1,1,
    -1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1
  ];
  const n=[
    0,0,1,0,0,1,0,0,1,0,0,1, 0,0,-1,0,0,-1,0,0,-1,0,0,-1,
    0,1,0,0,1,0,0,1,0,0,1,0, 0,-1,0,0,-1,0,0,-1,0,0,-1,0,
    1,0,0,1,0,0,1,0,0,1,0,0, -1,0,0,-1,0,0,-1,0,0,-1,0,0
  ];
  const idx=[];for(let i=0;i<6;i++){const o=i*4;idx.push(o,o+1,o+2,o,o+2,o+3);}
  return meshFromData(p,n,idx);
}

function createPointBuffer(count, positions, seeds) {
  const value = { count };
  value.position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, value.position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  value.seed = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, value.seed);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(seeds), gl.STATIC_DRAW);
  return value;
}

function createUniverseParticles() {
  const positions=[],seeds=[],linePositions=[];
  const count = innerWidth < 700 ? 2400 : 5200;
  let random = 73421;
  const rand=()=>{random=(random*16807)%2147483647;return (random-1)/2147483646;};
  for(let i=0;i<count;i++){
    const z=18-rand()*145;
    const spread=10+rand()*27;
    const x=(rand()*2-1)*spread;
    const y=(rand()*2-1)*spread*.58;
    positions.push(x,y,z);seeds.push(rand());
    if(i<1000){linePositions.push(x,y,z,x,y,z-.7-rand()*1.4);}
  }
  stars.points=createPointBuffer(count,positions,seeds);
  stars.lines={count:linePositions.length/3,buffer:gl.createBuffer()};
  gl.bindBuffer(gl.ARRAY_BUFFER,stars.lines.buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(linePositions),gl.STATIC_DRAW);

  const dustP=[],dustS=[];
  for(let w=0;w<5;w++)for(let i=0;i<(innerWidth<700?110:240);i++){
    const angle=rand()*Math.PI*2,r=2.8+rand()*5.5;
    dustP.push(Math.cos(angle)*r,(rand()*2-1)*3.1,-24*w+Math.sin(angle)*r);
    dustS.push(rand());
  }
  dynamicPoints.dust=createPointBuffer(dustS.length,dustP,dustS);
}

function bindMesh(mesh) {
  const a=meshProgram.attributes;
  gl.bindBuffer(gl.ARRAY_BUFFER,mesh.position);gl.enableVertexAttribArray(a.aPosition);gl.vertexAttribPointer(a.aPosition,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,mesh.normal);gl.enableVertexAttribArray(a.aNormal);gl.vertexAttribPointer(a.aNormal,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.index);
}

function drawMesh(mesh, model, color, accent, emissive=0, alpha=1, additive=false) {
  gl.useProgram(meshProgram.value);
  bindMesh(mesh);
  const u=meshProgram.uniforms;
  gl.uniformMatrix4fv(u.uProjection,false,projection);
  gl.uniformMatrix4fv(u.uView,false,view);
  gl.uniformMatrix4fv(u.uModel,false,model);
  gl.uniform3fv(u.uCamera,cameraPosition);
  gl.uniform3fv(u.uColor,color);
  gl.uniform3fv(u.uAccent,accent);
  gl.uniform1f(u.uEmissive,emissive);
  gl.uniform1f(u.uAlpha,alpha);
  gl.uniform1f(u.uTime,lastFrame*.001);
  if(alpha<1||additive){gl.enable(gl.BLEND);gl.depthMask(false);gl.blendFunc(gl.SRC_ALPHA,additive?gl.ONE:gl.ONE_MINUS_SRC_ALPHA);}else{gl.disable(gl.BLEND);gl.depthMask(true);}
  gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);
  gl.depthMask(true);
}

function drawPoints(buffer, color, opacity=1, size=1.2) {
  gl.useProgram(pointProgram.value);
  const a=pointProgram.attributes,u=pointProgram.uniforms;
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer.position);gl.enableVertexAttribArray(a.aPosition);gl.vertexAttribPointer(a.aPosition,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer.seed);gl.enableVertexAttribArray(a.aSeed);gl.vertexAttribPointer(a.aSeed,1,gl.FLOAT,false,0,0);
  gl.uniformMatrix4fv(u.uProjection,false,projection);gl.uniformMatrix4fv(u.uView,false,view);
  gl.uniform1f(u.uPixelRatio,pixelRatio);gl.uniform1f(u.uVelocity,velocity);gl.uniform1f(u.uSize,size);
  gl.uniform3fv(u.uCamera,cameraPosition);gl.uniform3fv(u.uColor,color);gl.uniform1f(u.uOpacity,opacity);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);
  gl.drawArrays(gl.POINTS,0,buffer.count);
  gl.depthMask(true);
}

function drawWarpLines(accent) {
  if(velocity<.03)return;
  gl.useProgram(lineProgram.value);
  const a=lineProgram.attributes,u=lineProgram.uniforms;
  gl.bindBuffer(gl.ARRAY_BUFFER,stars.lines.buffer);gl.enableVertexAttribArray(a.aPosition);gl.vertexAttribPointer(a.aPosition,3,gl.FLOAT,false,0,0);
  gl.uniformMatrix4fv(u.uProjection,false,projection);gl.uniformMatrix4fv(u.uView,false,view);gl.uniform3fv(u.uCamera,cameraPosition);
  gl.uniform1f(u.uStretch,velocity*4.5);gl.uniform3fv(u.uColor,accent);gl.uniform1f(u.uOpacity,velocity*.38);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);
  gl.drawArrays(gl.LINES,0,stars.lines.count);
  gl.depthMask(true);
}

function drawBeam(start,end,radius,color,accent,emissive=0,alpha=1) {
  drawMesh(meshes.cylinder,basisMatrix(start,end,radius),color,accent,emissive,alpha,emissive>.5);
}

function drawGlowSphere(position,size,color,accent,intensity=.8) {
  drawMesh(meshes.sphere,modelMatrix(position,[0,0,0],[size,size,size]),color,accent,intensity,.18,true);
}

function worldVisible(index){return Math.abs(travel-index)<1.45;}

function renderOrigin(time,accent){
  if(!worldVisible(0))return;
  const z=0,ox=innerWidth<700?0:2.2;
  drawGlowSphere([ox,0,z],1.9,[.05,.16,.22],accent,1.2);
  drawMesh(meshes.sphere,modelMatrix([ox,0,z],[0,0,0],[1.22,1.22,1.22]),[.006,.012,.026],accent,.05,1);
  drawMesh(meshes.torus,modelMatrix([ox,0,z],[0,0,time*.08],[2.62,2.62,2.62]),[.28,.63,.75],accent,1.1,.88,true);
  drawMesh(meshes.torus,modelMatrix([ox,0,z+.1],[.42,.25,-time*.06],[3.18,3.18,3.18]),[.12,.28,.42],accent,.8,.48,true);
  drawMesh(meshes.torus,modelMatrix([ox,0,z-.12],[-.55,.18,time*.045],[2.16,2.16,2.16]),[.2,.55,.7],accent,.65,.42,true);
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2+time*.16,r=3.65;
    const p=[ox+Math.cos(a)*r,Math.sin(a)*r,z+Math.sin(a*2+time)*.24];
    drawGlowSphere(p,.055,[.38,.84,1],accent,1.8);
  }
}

function renderArm(time,accent){
  if(!worldVisible(1))return;
  const z=-24;
  drawGlowSphere([0,.15,z],2.4,[.035,.12,.2],accent,.7);
  drawMesh(meshes.cylinder,modelMatrix([0,-1.62,z],[0,0,0],[1.55,.22,1.55]),[.045,.07,.105],accent,.05,1);
  drawMesh(meshes.torus,modelMatrix([0,-1.38,z],[Math.PI/2,0,time*.05],[2.0,2.0,2.0]),[.18,.48,.7],accent,.9,.45,true);
  const a=[0,-1.35,z],b=[0,-.62,z];
  const c=[.95+.12*Math.sin(time*.55),.12,z+.02];
  const d=[.16,1.05+.08*Math.sin(time*.8),z-.08];
  const e=[-.18,1.48,z-.02];
  const metal=[.12,.16,.22],joint=[.28,.58,.82];
  drawBeam(a,b,.27,metal,accent,.08);drawBeam(b,c,.2,metal,accent,.05);drawBeam(c,d,.17,metal,accent,.05);drawBeam(d,e,.11,metal,accent,.05);
  for(const p of [b,c,d])drawMesh(meshes.sphere,modelMatrix(p,[0,0,0],[.32,.32,.32]),joint,accent,.35,1);
  const f1=add3(e,[-.26,.36,.12]),f2=add3(e,[-.26,.36,-.12]);
  drawBeam(e,f1,.055,joint,accent,.45);drawBeam(e,f2,.055,joint,accent,.45);
  const scanY=-.35+Math.sin(time*.8)*1.45;
  drawMesh(meshes.torus,modelMatrix([0,scanY,z],[Math.PI/2,0,0],[1.85,1.85,1.85]),[.22,.68,.95],accent,1.25,.2,true);
}

function renderVoice(time,accent){
  if(!worldVisible(2))return;
  const z=-48,pulse=1+.04*Math.sin(time*2.4);
  drawGlowSphere([0,0,z],1.65,[.28,.1,.5],accent,1.3);
  drawMesh(meshes.sphere,modelMatrix([0,0,z],[0,time*.12,0],[pulse,pulse,pulse]),[.16,.07,.26],accent,.72,1);
  drawMesh(meshes.torus,modelMatrix([0,0,z],[0,0,time*.16],[2.05,2.05,2.05]),[.45,.18,.68],accent,1,.62,true);
  drawMesh(meshes.torus,modelMatrix([0,0,z],[Math.PI/2,time*.1,.8],[1.72,1.72,1.72]),[.28,.12,.6],accent,.9,.5,true);
  drawMesh(meshes.torus,modelMatrix([0,0,z],[.45,Math.PI/2,-time*.08],[2.35,2.35,2.35]),[.18,.1,.46],accent,.72,.38,true);
  for(let i=-7;i<=7;i++){
    const x=i*.35,y=Math.sin(i*.72+time*2)*(.22+.14*Math.sin(time*.6)),zz=z+.15*Math.cos(i*.5+time);
    drawGlowSphere([x,y,zz],.05+.018*Math.abs(Math.sin(i+time)),[.65,.35,1],accent,1.8);
  }
  for(let i=0;i<2;i++){
    const a=time*(.28+i*.08)+i*Math.PI,r=2.7+i*.25;
    drawGlowSphere([Math.cos(a)*r,Math.sin(a*.7)*.65,z+Math.sin(a)*r],.08,[.75,.52,1],accent,1.4);
  }
}

function renderData(time,accent){
  if(!worldVisible(3))return;
  const z=-72;
  drawGlowSphere([0,.2,z],2.55,[.2,.12,.025],accent,.55);
  drawMesh(meshes.torus,modelMatrix([0,-1.55,z],[Math.PI/2,0,time*.035],[3.5,3.5,3.5]),[.42,.28,.08],accent,.75,.35,true);
  for(let x=-2;x<=2;x++)for(let zz=-2;zz<=2;zz++){
    const seed=Math.abs(Math.sin(x*12.9898+zz*78.233))*43758.5453;
    const h=.25+(seed-Math.floor(seed))*1.65;
    const pos=[x*.82,-1.48+h*.5,z+zz*.82];
    const c=[.12+h*.025,.09+h*.015,.045];
    drawMesh(meshes.box,modelMatrix(pos,[0,0,0],[.26,h*.5,.26]),c,accent,.08,1);
  }
  const core=[0,1.12,z];
  drawGlowSphere(core,.72,[.45,.27,.06],accent,1.6);
  drawMesh(meshes.sphere,modelMatrix(core,[0,time*.2,0],[.42,.42,.42]),[.42,.25,.06],accent,1.1,1);
  const nodes=[[-2,.18,z+1.65],[2.05,-.12,z+1.35],[1.7,.42,z-1.8],[-1.8,-.18,z-1.65]];
  for(const node of nodes){drawBeam(core,node,.018,[.55,.3,.06],accent,1,.62);drawGlowSphere(node,.085,[.72,.42,.08],accent,1.65);}
}

function renderSignal(time,accent){
  if(!worldVisible(4))return;
  const z=-96,pulse=.86+.07*Math.sin(time*1.25);
  drawGlowSphere([0,0,z],1.7,[.25,.42,.13],accent,1.7);
  drawMesh(meshes.sphere,modelMatrix([0,0,z],[0,time*.12,0],[pulse,pulse,pulse]),[.32,.47,.18],accent,1.3,1);
  drawMesh(meshes.torus,modelMatrix([0,0,z],[0,0,time*.07],[2.0,2.0,2.0]),[.35,.52,.22],accent,1,.58,true);
  drawMesh(meshes.torus,modelMatrix([0,0,z],[Math.PI/2,.65,-time*.055],[2.75,2.75,2.75]),[.2,.38,.16],accent,.8,.38,true);
  const pts=[[-2.5,1.4,z+.3],[-1.4,-1.1,z+.8],[.2,1.9,z-.2],[1.6,-1.2,z+.4],[2.7,.8,z-.4],[-.4,-2,z-.2],[1.05,.35,z+1.1]];
  for(let i=0;i<pts.length;i++){drawGlowSphere(pts[i],.065,[.58,.82,.42],accent,1.7);if(i<pts.length-1)drawBeam(pts[i],pts[i+1],.012,[.4,.7,.28],accent,.85,.52);}
}

function initRenderer(){
  const options={alpha:false,antialias:true,powerPreference:'high-performance'};
  gl=canvas.getContext('webgl2',options)||canvas.getContext('webgl',options)||canvas.getContext('experimental-webgl',options);
  if(!gl)throw new Error('WebGL is unavailable');
  meshProgram=createProgramInfo(meshVertexSource,meshFragmentSource,['aPosition','aNormal'],['uProjection','uView','uModel','uCamera','uColor','uAccent','uEmissive','uAlpha','uTime']);
  pointProgram=createProgramInfo(pointVertexSource,pointFragmentSource,['aPosition','aSeed'],['uProjection','uView','uPixelRatio','uVelocity','uSize','uCamera','uColor','uOpacity']);
  lineProgram=createProgramInfo(lineVertexSource,lineFragmentSource,['aPosition'],['uProjection','uView','uCamera','uStretch','uColor','uOpacity']);
  meshes.sphere=createSphere();meshes.torus=createTorus();meshes.cylinder=createCylinder();meshes.box=createBox();
  createUniverseParticles();
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
  rendererReady=true;
}

function resizeRenderer(){
  if(!gl)return;
  const cap=innerWidth<700?.72:Math.min(1.15,devicePixelRatio||1);
  pixelRatio=Math.min(devicePixelRatio||1,cap);
  const width=Math.max(1,Math.round(innerWidth*pixelRatio)),height=Math.max(1,Math.round(innerHeight*pixelRatio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
  projection=perspectiveMatrix((innerWidth<700?58:50)*Math.PI/180,width/height,.08,180);
}

function cameraAt(value){
  const i=clamp(Math.floor(value),0,cameraKeys.length-2);
  const raw=value>=cameraKeys.length-1?1:value-i;
  const f=smooth(clamp(raw,0,1));
  const a=cameraKeys[i],b=cameraKeys[Math.min(i+1,cameraKeys.length-1)];
  const arc=Math.sin(Math.PI*f),side=i%2===0?1:-1;
  const p=a.p.map((v,index)=>mix(v,b.p[index],f));
  const t=a.t.map((v,index)=>mix(v,b.t[index],f));
  p[1]+=arc*1.15;p[0]+=arc*side*.72;
  p[0]+=mouseRX*(innerWidth<700?.08:.24);p[1]+=mouseRY*(innerWidth<700?.05:.14);
  t[0]+=mouseRX*.06;t[1]+=mouseRY*.04;
  return {p,t};
}

function accentAt(value){
  const i=clamp(Math.floor(value),0,palette.length-2),f=smooth(value>=4?1:value-i);
  return palette[i].map((v,index)=>mix(v,palette[Math.min(i+1,palette.length-1)][index],f));
}

function render(now){
  const dt=Math.min(.04,(now-lastFrame)/1000||.016);lastFrame=now;
  const response=reducedMotion?1:1-Math.exp(-dt*2.4);
  travel=mix(travel,targetTravel,response);
  mouseRX=mix(mouseRX,mouseX,1-Math.exp(-dt*3.2));mouseRY=mix(mouseRY,mouseY,1-Math.exp(-dt*3.2));
  velocity=mix(velocity,Math.min(1,Math.abs(travel-lastTravel)/Math.max(dt,.001)*.32),1-Math.exp(-dt*6));lastTravel=travel;
  const cam=cameraAt(travel);cameraPosition=cam.p;
  $('[data-travel]').textContent=(travel*24).toFixed(1).padStart(5,'0');
  $('[data-vector]').textContent=velocity>.08?'IN TRANSIT':'STABLE';
  if(rendererReady){
    resizeRenderer();view=lookAtMatrix(cam.p,cam.t);
    gl.clearColor(.002,.004,.012,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const accent=accentAt(travel);
    drawPoints(stars.points,[.46,.66,.9],.72,1.0);
    drawPoints(dynamicPoints.dust,accent,.28,1.45);
    drawWarpLines(accent);
    renderOrigin(now*.001,accent);renderArm(now*.001,accent);renderVoice(now*.001,accent);renderData(now*.001,accent);renderSignal(now*.001,accent);
  }
  requestAnimationFrame(render);
}

try{
  initRenderer();resizeRenderer();
  $('[data-render]').textContent=gl instanceof WebGL2RenderingContext?'WEBGL2':'WEBGL1';
}catch(error){
  console.error('Universe renderer failed:',error);
  document.documentElement.classList.add('no-webgl');
  $('[data-render]').textContent='FALLBACK';
}

const initialSlug=location.hash.replace('#','');
const initialIndex=worlds.findIndex(world=>world.slug===initialSlug);
if(initialIndex>=0){stage=initialIndex;travel=targetTravel=initialIndex;}
setWorld(stage,'initial');
window.addEventListener('resize',resizeRenderer,{passive:true});
requestAnimationFrame(render);
setTimeout(()=>{sceneReady=true;loadValue=100;},reducedMotion?80:720);

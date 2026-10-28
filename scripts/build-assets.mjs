// scripts/build-assets.mjs
// Autonomous SVG Asset Generator for Editorial Isometric Profile
// Author: Guruvishnu Kajagar

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.resolve(ROOT_DIR, 'assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Editorial Palette
const C = {
  bg: '#F4F1EA',
  ink: '#111111',
  inkMuted: '#555550',
  inkLight: '#888880',
  vermilion: '#FF4D1C',
  vermilionLight: '#FFEAE4',
  vermilionDark: '#D4360A',
  cobalt: '#2B4BFF',
  cobaltLight: '#EBF0FF',
  cobaltDark: '#1E35B8',
  sand: '#E7E1D3',
  sandLight: '#FAF8F5',
  sandDark: '#D8D1C0',
  border: '#111111',
  white: '#FFFFFF',
  supabase: '#3ECF8E',
  supabaseLight: '#E8F8F0',
  supabaseDark: '#249C66',
  render: '#46E3B7',
  renderLight: '#E6FAF4',
  renderDark: '#20A880',
};

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an isometric cube with 30-degree projection.
 * (x, y) is the top vertex of the top face.
 * size: horizontal radius (dx = size * cos(30))
 * height: vertical height of left & right faces
 */
function isoCube({
  x,
  y,
  size = 40,
  height = 30,
  topFill = C.sandLight,
  leftFill = C.sand,
  rightFill = C.sandDark,
  stroke = C.ink,
  strokeWidth = 1.5,
  label = '',
  labelFill = C.ink,
  labelSize = 10,
  animate = null, // { dy: -8, dur: '3.2s', delay: '0s' }
}) {
  const dx = size * 0.866025; // cos(30 deg)
  const dy = size * 0.5;      // sin(30 deg)
  const h = height;

  const topPts = `${x},${y} ${x + dx},${y + dy} ${x},${y + 2 * dy} ${x - dx},${y + dy}`;
  const leftPts = `${x - dx},${y + dy} ${x},${y + 2 * dy} ${x},${y + 2 * dy + h} ${x - dx},${y + dy + h}`;
  const rightPts = `${x},${y + 2 * dy} ${x + dx},${y + dy} ${x + dx},${y + dy + h} ${x},${y + 2 * dy + h}`;

  let labelMarkup = '';
  if (label) {
    // Top face horizontal center is (x, y + dy).
    // Placing text cleanly on the horizontal axis of the top face with crisp legibility:
    labelMarkup = `
      <text x="${x}" y="${y + dy + 0.5}" text-anchor="middle" dominant-baseline="central" fill="${labelFill}" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="${labelSize}" font-weight="700" letter-spacing="0.5">${escapeXml(label)}</text>
    `;
  }

  const cubePolygons = `
    <polygon points="${leftPts}" fill="${leftFill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
    <polygon points="${rightPts}" fill="${rightFill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
    <polygon points="${topPts}" fill="${topFill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
    ${labelMarkup}
  `;

  if (animate) {
    const { dy: animDy = -8, dur = '3.5s', delay = '0s' } = animate;
    return `
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,${animDy}; 0,0" dur="${dur}" begin="${delay}" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
        ${cubePolygons}
      </g>
    `;
  }

  return `<g>${cubePolygons}</g>`;
}

// ---------------------------------------------------------------------------
// 1. HERO.SVG (1200x520)
// ---------------------------------------------------------------------------
function buildHero() {
  const towerCenterX = 925;
  const cubes = [
    // Bottom foundation: PostgreSQL
    isoCube({
      x: towerCenterX, y: 350, size: 58, height: 38,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      label: 'PostgreSQL', labelSize: 10,
      animate: { dy: -5, dur: '4.2s', delay: '0s' }
    }),
    // Lower layer left: Java
    isoCube({
      x: towerCenterX - 85, y: 295, size: 50, height: 34,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      label: 'Java', labelSize: 11,
      animate: { dy: -6, dur: '3.8s', delay: '-0.7s' }
    }),
    // Lower layer right: Python
    isoCube({
      x: towerCenterX + 85, y: 290, size: 50, height: 34,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      label: 'Python', labelSize: 11,
      animate: { dy: -6, dur: '4.0s', delay: '-1.4s' }
    }),
    // Middle pillar: Spring Boot
    isoCube({
      x: towerCenterX, y: 245, size: 52, height: 35,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      label: 'Spring', labelSize: 11,
      animate: { dy: -7, dur: '3.6s', delay: '-2.1s' }
    }),
    // Mid layer left: TypeScript (Cobalt accent)
    isoCube({
      x: towerCenterX - 85, y: 195, size: 52, height: 35,
      topFill: C.cobaltLight, leftFill: C.cobalt, rightFill: C.cobaltDark,
      label: 'TypeScript', labelSize: 10, labelFill: C.cobaltDark,
      animate: { dy: -8, dur: '3.3s', delay: '-1.1s' }
    }),
    // Mid layer right: Three.js
    isoCube({
      x: towerCenterX + 85, y: 190, size: 52, height: 35,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      label: 'Three.js', labelSize: 11,
      animate: { dy: -8, dur: '3.5s', delay: '-2.8s' }
    }),
    // Upper center: Next.js
    isoCube({
      x: towerCenterX, y: 140, size: 54, height: 36,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      label: 'Next.js', labelSize: 11,
      animate: { dy: -9, dur: '3.1s', delay: '-0.4s' }
    }),
    // Crown: React (Vermilion accent)
    isoCube({
      x: towerCenterX, y: 75, size: 56, height: 38,
      topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark,
      label: 'React', labelSize: 13, labelFill: C.vermilionDark,
      animate: { dy: -10, dur: '2.9s', delay: '-1.8s' }
    }),
    // Orbiting decorative mini voxel 1 (left)
    isoCube({
      x: towerCenterX - 180, y: 240, size: 22, height: 16,
      topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark,
      animate: { dy: -12, dur: '2.7s', delay: '-0.3s' }
    }),
    // Orbiting decorative mini voxel 2 (right)
    isoCube({
      x: towerCenterX + 180, y: 265, size: 24, height: 18,
      topFill: C.cobaltLight, leftFill: C.cobalt, rightFill: C.cobaltDark,
      animate: { dy: -11, dur: '3.4s', delay: '-1.9s' }
    }),
    // Orbiting decorative mini voxel 3 (high right)
    isoCube({
      x: towerCenterX + 130, y: 115, size: 20, height: 15,
      topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark,
      animate: { dy: -9, dur: '3.0s', delay: '-2.5s' }
    }),
  ].join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" width="100%" height="100%">
  <!-- Rounded Base Background -->
  <rect width="1200" height="520" rx="20" fill="${C.bg}" stroke="${C.ink}" stroke-width="2"/>

  <!-- Editorial Masthead / Header Band -->
  <g id="masthead">
    <text x="52" y="44" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="2" fill="${C.inkMuted}">GURUVISHNU KAJAGAR — EDITORIAL PROFILE</text>
    <text x="1148" y="44" text-anchor="end" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="2" fill="${C.inkMuted}">VOL. 2026 // PUNE, IN [18.52° N, 73.85° E]</text>
    <line x1="52" y1="58" x2="1148" y2="58" stroke="${C.ink}" stroke-width="1"/>
  </g>

  <!-- Left Content Column -->
  <g id="left-column">
    <!-- Category label -->
    <text x="52" y="105" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="12" font-weight="700" letter-spacing="2" fill="${C.vermilion}">● FRONTEND ENGINEER / FULL-STACK / PUNE, IN</text>

    <!-- Main Headline: Stacked Serif -->
    <text x="50" y="182" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="bold" fill="${C.ink}" letter-spacing="-1">Guruvishnu</text>
    <text x="50" y="258" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="bold" fill="${C.ink}" letter-spacing="-1">Kajagar</text>

    <!-- Value statement (2 lines for clean editorial balance) -->
    <text x="52" y="310" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-style="italic" fill="${C.inkMuted}">Crafting high-precision interfaces, 3D web experiences,</text>
    <text x="52" y="334" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-style="italic" fill="${C.inkMuted}">and resilient distributed systems.</text>

    <text x="52" y="362" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="13.5" fill="${C.inkMuted}">Frontend Developer at CandorWorks · Performance obsessed · Zero runtime waste.</text>

    <!-- Availability Pill -->
    <g transform="translate(52, 396)">
      <rect width="365" height="42" rx="21" fill="${C.sandLight}" stroke="${C.ink}" stroke-width="1.5"/>
      <circle cx="24" cy="21" r="5" fill="${C.vermilion}"/>
      <text x="38" y="25" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="${C.ink}">OPEN TO ROLES · AVAILABLE IMMEDIATELY</text>
    </g>

    <!-- Editorial Badges Strip -->
    <g transform="translate(52, 468)">
      <line x1="0" y1="0" x2="520" y2="0" stroke="${C.sandDark}" stroke-width="1"/>
      <text x="0" y="22" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="600" letter-spacing="1" fill="${C.inkMuted}">CANDORWORKS</text>
      <circle cx="118" cy="18" r="2" fill="${C.inkLight}"/>
      <text x="130" y="22" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="600" letter-spacing="1" fill="${C.inkMuted}">J SPIDERS BEST CODER</text>
      <circle cx="308" cy="18" r="2" fill="${C.inkLight}"/>
      <text x="320" y="22" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="600" letter-spacing="1" fill="${C.inkMuted}">WCAG 2.1 AA</text>
      <circle cx="436" cy="18" r="2" fill="${C.inkLight}"/>
      <text x="448" y="22" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="600" letter-spacing="1" fill="${C.vermilion}">96+ LIGHTHOUSE</text>
    </g>
  </g>

  <!-- Right Isometric Scene -->
  <g id="iso-scene">
    <!-- Subtle Isometric Grid in Background -->
    <g stroke="${C.sand}" stroke-width="1" stroke-dasharray="3 4" opacity="0.65">
      <line x1="${towerCenterX - 200}" y1="460" x2="${towerCenterX + 200}" y2="230"/>
      <line x1="${towerCenterX + 200}" y1="460" x2="${towerCenterX - 200}" y2="230"/>
      <line x1="${towerCenterX - 140}" y1="480" x2="${towerCenterX + 260}" y2="250"/>
      <line x1="${towerCenterX + 140}" y1="480" x2="${towerCenterX - 260}" y2="250"/>
      <line x1="${towerCenterX}" y1="60" x2="${towerCenterX}" y2="470"/>
    </g>

    <!-- Ground Shadow -->
    <ellipse cx="${towerCenterX}" cy="465" rx="185" ry="38" fill="${C.sand}" opacity="0.9"/>
    <ellipse cx="${towerCenterX}" cy="465" rx="125" ry="24" fill="${C.sandDark}" opacity="0.7"/>

    <!-- Cubes Tower -->
    ${cubes}
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// 2. STATS-STRIP.SVG (1200x160)
// ---------------------------------------------------------------------------
function buildStatsStrip() {
  const tiles = [
    {
      num: '[ 01 / EFFICIENCY ]',
      val: '−60%',
      valFill: C.vermilion,
      label: 'API CALLS REDUCED',
      desc: 'debounced search pipeline',
      wavy: true,
      wavyColor: C.vermilion,
    },
    {
      num: '[ 02 / BUNDLE ]',
      val: '−35%',
      valFill: C.ink,
      label: 'BUNDLE SIZE SHRUNK',
      desc: 'route & component code-split',
      wavy: true,
      wavyColor: C.cobalt,
    },
    {
      num: '[ 03 / VELOCITY ]',
      val: '+40%',
      valFill: C.cobalt,
      label: 'DEV ACCELERATION',
      desc: '12+ reusable UI primitives',
      wavy: true,
      wavyColor: C.vermilion,
    },
    {
      num: '[ 04 / QUALITY ]',
      val: '96+',
      valFill: C.ink,
      label: 'LIGHTHOUSE SCORE',
      desc: 'WCAG 2.1 AA compliant',
      wavy: true,
      wavyColor: C.ink,
    },
  ];

  const tileWidth = 300;
  const tileMarkup = tiles.map((t, i) => {
    const x = i * tileWidth;
    return `
      <!-- Tile ${i + 1} -->
      <g transform="translate(${x}, 0)">
        ${i > 0 ? `<line x1="0" y1="18" x2="0" y2="142" stroke="${C.ink}" stroke-width="1" stroke-dasharray="3 3"/>` : ''}
        <text x="32" y="38" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="${C.inkLight}">${escapeXml(t.num)}</text>
        
        <!-- Big Number -->
        <text x="30" y="90" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="bold" fill="${t.valFill}" letter-spacing="-1">${escapeXml(t.val)}</text>

        <!-- Hand-drawn Style Underline -->
        <path d="M 32 98 Q 70 102 110 98 T 165 98" fill="none" stroke="${t.wavyColor}" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Captions -->
        <text x="32" y="122" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="1" fill="${C.ink}">${escapeXml(t.label)}</text>
        <text x="32" y="139" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="11" fill="${C.inkMuted}">${escapeXml(t.desc)}</text>
      </g>
    `;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 160" width="100%" height="100%">
  <rect width="1200" height="160" rx="16" fill="${C.bg}" stroke="${C.ink}" stroke-width="2"/>
  ${tileMarkup}
</svg>`;
}

// ---------------------------------------------------------------------------
// 3. PROJECT CARDS (each 580x260, bento style)
// ---------------------------------------------------------------------------
function buildProjectCard({
  index,
  title,
  tag,
  descLine1,
  descLine2,
  stack,
  metricLabel,
  metricValue,
  accentColor = C.vermilion,
  cubeProps,
}) {
  const stackChips = stack.map((s) => {
    const chipWidth = s.length * 7.5 + 16;
    return { name: s, width: chipWidth };
  });

  let chipX = 28;
  const chipMarkup = stackChips.map((c) => {
    const x = chipX;
    chipX += c.width + 8;
    return `
      <g transform="translate(${x}, 208)">
        <rect width="${c.width}" height="22" rx="4" fill="${C.sand}" stroke="${C.ink}" stroke-width="1"/>
        <text x="${c.width / 2}" y="15" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10" font-weight="600" fill="${C.ink}">${escapeXml(c.name)}</text>
      </g>
    `;
  }).join('\n');

  // Small isometric icon at top left
  const miniIcon = isoCube({
    x: 48,
    y: 30,
    size: 20,
    height: 14,
    topFill: cubeProps.topFill || C.sandLight,
    leftFill: cubeProps.leftFill || C.sand,
    rightFill: cubeProps.rightFill || C.sandDark,
    stroke: C.ink,
    strokeWidth: 1.2,
    label: cubeProps.label || '',
    labelSize: 8,
    labelFill: cubeProps.labelFill || C.ink,
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 260" width="100%" height="100%">
  <!-- Card Background -->
  <rect width="580" height="260" rx="16" fill="${C.bg}" stroke="${C.ink}" stroke-width="2"/>

  <!-- Inner Bento Panel -->
  <rect x="14" y="14" width="552" height="232" rx="12" fill="${C.sandLight}" stroke="${C.sand}" stroke-width="1"/>

  <!-- Top Bar: Mini Icon, Tag, Index -->
  <g transform="translate(0, 0)">
    ${miniIcon}

    <!-- Tag Pill -->
    <g transform="translate(86, 32)">
      <rect width="210" height="22" rx="4" fill="${C.sand}" stroke="${C.sandDark}" stroke-width="1"/>
      <text x="10" y="15" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9.5" font-weight="700" letter-spacing="1" fill="${accentColor}">● ${escapeXml(tag)}</text>
    </g>

    <!-- Index Number -->
    <text x="542" y="47" text-anchor="end" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="1.5" fill="${C.inkLight}">[ ${escapeXml(index)} ]</text>
  </g>

  <!-- Title -->
  <text x="28" y="90" font-family="Georgia, 'Times New Roman', serif" font-size="24" font-weight="bold" fill="${C.ink}">${escapeXml(title)}</text>

  <!-- 2-Line Description -->
  <text x="28" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="12.5" fill="${C.inkMuted}">${escapeXml(descLine1)}</text>
  <text x="28" y="134" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="12.5" fill="${C.inkMuted}">${escapeXml(descLine2)}</text>

  <!-- Key Metric Panel -->
  <g transform="translate(28, 154)">
    <rect width="524" height="34" rx="6" fill="${C.bg}" stroke="${C.ink}" stroke-width="1"/>
    <text x="14" y="21" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9.5" font-weight="700" letter-spacing="1" fill="${C.inkLight}">${escapeXml(metricLabel)}</text>
    <text x="140" y="21" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.8" fill="${accentColor}">${escapeXml(metricValue)}</text>
  </g>

  <!-- Stack Chips -->
  ${chipMarkup}
</svg>`;
}

// ---------------------------------------------------------------------------
// 4. STACK-ISO.SVG (1200x300)
// ---------------------------------------------------------------------------
function buildStackIso() {
  const panelWidth = 360;
  const panelHeight = 215;

  // Panel 1: Frontend & 3D (local coordinates: x = 60, 130, 200, 270)
  const feCubes = [
    isoCube({ x: 65, y: 88, size: 28, height: 22, topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark, label: 'R', labelSize: 12, labelFill: C.vermilionDark }),
    isoCube({ x: 135, y: 88, size: 28, height: 22, topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: 'N', labelSize: 12 }),
    isoCube({ x: 205, y: 88, size: 28, height: 22, topFill: C.cobaltLight, leftFill: C.cobalt, rightFill: C.cobaltDark, label: 'TS', labelSize: 11, labelFill: C.cobaltDark }),
    isoCube({ x: 275, y: 88, size: 28, height: 22, topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: '3D', labelSize: 11 }),
  ].join('\n');

  // Panel 2: Backend & Database (local coordinates)
  const beCubes = [
    isoCube({ x: 65, y: 88, size: 28, height: 22, topFill: C.cobaltLight, leftFill: C.cobalt, rightFill: C.cobaltDark, label: 'FA', labelSize: 11, labelFill: C.cobaltDark }),
    isoCube({ x: 135, y: 88, size: 28, height: 22, topFill: C.supabaseLight, leftFill: C.supabase, rightFill: C.supabaseDark, label: 'SB', labelSize: 11, labelFill: C.supabaseDark }),
    isoCube({ x: 205, y: 88, size: 28, height: 22, topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: 'PG', labelSize: 11 }),
    isoCube({ x: 275, y: 88, size: 28, height: 22, topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark, label: 'RD', labelSize: 11, labelFill: C.vermilionDark }),
  ].join('\n');

  // Panel 3: DevOps & Cloud (local coordinates)
  const devCubes = [
    isoCube({ x: 65, y: 88, size: 28, height: 22, topFill: C.renderLight, leftFill: C.render, rightFill: C.renderDark, label: 'RN', labelSize: 11, labelFill: C.renderDark }),
    isoCube({ x: 135, y: 88, size: 28, height: 22, topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: 'VC', labelSize: 11 }),
    isoCube({ x: 205, y: 88, size: 28, height: 22, topFill: C.cobaltLight, leftFill: C.cobalt, rightFill: C.cobaltDark, label: 'DK', labelSize: 11, labelFill: C.cobaltDark }),
    isoCube({ x: 275, y: 88, size: 28, height: 22, topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark, label: 'GIT', labelSize: 10, labelFill: C.vermilionDark }),
  ].join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="100%" height="100%">
  <rect width="1200" height="300" rx="18" fill="${C.bg}" stroke="${C.ink}" stroke-width="2"/>

  <!-- Header -->
  <g id="stack-header">
    <text x="40" y="38" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="2" fill="${C.inkMuted}">03 / TECHNICAL SPECIFICATION — SYSTEM STACK &amp; CORE PRIMITIVES</text>
    <text x="1160" y="38" text-anchor="end" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="1.5" fill="${C.inkLight}">PRODUCTION-READY ARCHITECTURE</text>
    <line x1="40" y1="50" x2="1160" y2="50" stroke="${C.ink}" stroke-width="1"/>
  </g>

  <!-- Panel 1: Frontend & 3D -->
  <g transform="translate(40, 65)">
    <rect width="${panelWidth}" height="${panelHeight}" rx="12" fill="${C.sandLight}" stroke="${C.sand}" stroke-width="1"/>
    <text x="24" y="30" font-family="Georgia, 'Times New Roman', serif" font-size="16" font-weight="bold" fill="${C.ink}">Frontend &amp; 3D</text>
    <text x="24" y="46" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9.5" font-weight="700" letter-spacing="1" fill="${C.vermilion}">[ 01 / CLIENT LAYER ]</text>
    ${feCubes}
    <!-- Labels below cubes -->
    <text x="24" y="190" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="11.5" font-weight="600" fill="${C.inkMuted}">React 19 · Next.js 14 · TypeScript · Three.js · Tailwind v4 · Vite</text>
  </g>

  <!-- Panel 2: Backend & Database -->
  <g transform="translate(420, 65)">
    <rect width="${panelWidth}" height="${panelHeight}" rx="12" fill="${C.sandLight}" stroke="${C.sand}" stroke-width="1"/>
    <text x="24" y="30" font-family="Georgia, 'Times New Roman', serif" font-size="16" font-weight="bold" fill="${C.ink}">Backend &amp; Database</text>
    <text x="24" y="46" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9.5" font-weight="700" letter-spacing="1" fill="${C.cobalt}">[ 02 / SERVICE &amp; DATA LAYER ]</text>
    ${beCubes}
    <!-- Labels below cubes -->
    <text x="24" y="190" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="11.5" font-weight="600" fill="${C.inkMuted}">FastAPI · Supabase · PostgreSQL · Python · Node.js · SQLAlchemy · Redis</text>
  </g>

  <!-- Panel 3: Cloud & DevOps -->
  <g transform="translate(800, 65)">
    <rect width="${panelWidth}" height="${panelHeight}" rx="12" fill="${C.sandLight}" stroke="${C.sand}" stroke-width="1"/>
    <text x="24" y="30" font-family="Georgia, 'Times New Roman', serif" font-size="16" font-weight="bold" fill="${C.ink}">Cloud &amp; DevOps</text>
    <text x="24" y="46" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9.5" font-weight="700" letter-spacing="1" fill="${C.inkLight}">[ 03 / RUNTIME, CLOUD &amp; CI ]</text>
    ${devCubes}
    <!-- Labels below cubes -->
    <text x="24" y="190" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="11.5" font-weight="600" fill="${C.inkMuted}">Render · Vercel · Docker · GitHub Actions · Git · Linux · Postman</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// 5. ROADMAP.SVG (1200x380)
// ---------------------------------------------------------------------------
function buildRoadmap() {
  const steps = [
    { wk: '01', title: 'Node Core', sub: 'Event loop & TS', active: true },
    { wk: '02', title: 'Postgres', sub: 'Prisma ORM', active: false },
    { wk: '03', title: 'Auth & RBAC', sub: 'JWT & Argon2', active: false },
    { wk: '04', title: 'Validation', sub: 'Zod contracts', active: false },
    { wk: '05', title: 'Testing', sub: 'Vitest & Supertest', active: false },
    { wk: '06', title: 'Adv. SQL', sub: 'ACID & indexing', active: false },
    { wk: '07', title: 'Caching', sub: 'Redis pipelines', active: false },
    { wk: '08', title: 'Storage', sub: 'S3 / presigned', active: false },
    { wk: '09', title: 'Queues', sub: 'BullMQ workers', active: false },
    { wk: '10', title: 'Real-Time', sub: 'Socket.IO rooms', active: false },
    { wk: '11', title: 'Containers', sub: 'Docker compose', active: false },
    { wk: '12', title: 'CI/CD', sub: 'Actions & cloud', active: false },
  ];

  const startX = 65;
  const stepW = 90;
  // Raised ground base so labels have clean whitespace below
  const baseGroundY = 205;

  const stepsMarkup = steps.map((s, i) => {
    const x = startX + i * stepW;
    const stepTopY = baseGroundY - i * 6;
    const stepH = 24 + i * 6;
    const dx = 38 * 0.866025; // ~33
    const dy = 38 * 0.5;      // 19

    const topFill = s.active ? C.vermilionLight : C.sandLight;
    const leftFill = s.active ? C.vermilion : C.sand;
    const rightFill = s.active ? C.vermilionDark : C.sandDark;

    const topPts = `${x},${stepTopY} ${x + dx},${stepTopY + dy} ${x},${stepTopY + 2 * dy} ${x - dx},${stepTopY + dy}`;
    const leftPts = `${x - dx},${stepTopY + dy} ${x},${stepTopY + 2 * dy} ${x},${stepTopY + 2 * dy + stepH} ${x - dx},${stepTopY + dy + stepH}`;
    const rightPts = `${x},${stepTopY + 2 * dy} ${x + dx},${stepTopY + dy} ${x + dx},${stepTopY + dy + stepH} ${x},${stepTopY + 2 * dy + stepH}`;

    return `
      <!-- Step ${s.wk} -->
      <g id="step-${s.wk}">
        <!-- Shadows -->
        <ellipse cx="${x}" cy="${stepTopY + 2 * dy + stepH + 8}" rx="28" ry="6" fill="${C.sand}" opacity="0.7"/>

        <polygon points="${leftPts}" fill="${leftFill}" stroke="${C.ink}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="${rightPts}" fill="${rightFill}" stroke="${C.ink}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="${topPts}" fill="${topFill}" stroke="${C.ink}" stroke-width="1.3" stroke-linejoin="round"/>

        <!-- Top face label: Week number -->
        <text x="${x}" y="${stepTopY + dy + 0.5}" text-anchor="middle" dominant-baseline="central" fill="${s.active ? C.vermilionDark : C.ink}" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700">W${s.wk}</text>

        ${s.active ? `
          <!-- Pulsing Beacon on active week 01 -->
          <g transform="translate(${x}, ${stepTopY - 26})">
            <line x1="0" y1="0" x2="0" y2="22" stroke="${C.vermilion}" stroke-width="2"/>
            <circle cx="0" cy="0" r="6" fill="${C.vermilion}">
              <animate attributeName="r" values="5;7;5" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <rect x="12" y="-14" width="94" height="20" rx="4" fill="${C.ink}" stroke="${C.vermilion}" stroke-width="1"/>
            <text x="18" y="0" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="9" font-weight="700" fill="${C.white}" letter-spacing="1">IN PROGRESS</text>
          </g>
        ` : ''}

        <!-- Text labels below each step with clean clearance -->
        <text x="${x}" y="295" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" fill="${s.active ? C.vermilion : C.ink}">${escapeXml(s.title)}</text>
        <text x="${x}" y="312" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="10" fill="${C.inkMuted}">${escapeXml(s.sub)}</text>
      </g>
    `;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 380" width="100%" height="100%">
  <rect width="1200" height="380" rx="18" fill="${C.bg}" stroke="${C.ink}" stroke-width="2"/>

  <!-- Header -->
  <g id="roadmap-header">
    <text x="44" y="40" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="2" fill="${C.vermilion}">04 / CONTINUOUS RIGOR — 12-WEEK BACKEND MASTERY ROADMAP</text>
    <text x="1156" y="40" text-anchor="end" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="1.5" fill="${C.inkLight}">PUBLIC LOG: GURUVISHNUK/BACKEND-MASTERY</text>
    <line x1="44" y1="52" x2="1156" y2="52" stroke="${C.ink}" stroke-width="1"/>
  </g>

  <!-- Subheading -->
  <text x="44" y="80" font-family="Georgia, 'Times New Roman', serif" font-size="18" font-style="italic" fill="${C.inkMuted}">Transforming full-stack depth from API integration to high-throughput distributed system design.</text>

  <!-- The 12-step staircase -->
  ${stepsMarkup}

  <!-- Bottom progress strip -->
  <g transform="translate(44, 348)">
    <line x1="0" y1="0" x2="1112" y2="0" stroke="${C.sandDark}" stroke-width="1"/>
    <text x="0" y="16" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10" font-weight="700" letter-spacing="1" fill="${C.inkMuted}">PROGRESSION: WEEK 01 / 12 (8% COMPLETE)</text>
    <text x="1112" y="16" text-anchor="end" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10" font-weight="700" letter-spacing="1" fill="${C.vermilion}">STATUS: SHIPPING DAILY</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// 6. CONTACT.SVG (1200x220)
// ---------------------------------------------------------------------------
function buildContact() {
  const envCube = isoCube({
    x: 90,
    y: 75,
    size: 40,
    height: 30,
    topFill: C.vermilionLight,
    leftFill: C.vermilion,
    rightFill: C.vermilionDark,
    label: '@',
    labelSize: 18,
    labelFill: C.vermilionDark,
    animate: { dy: -6, dur: '3.0s', delay: '0s' },
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 220" width="100%" height="100%">
  <rect width="1200" height="220" rx="18" fill="${C.bg}" stroke="${C.ink}" stroke-width="2"/>

  <!-- Left isometric accent -->
  ${envCube}

  <!-- Main Headline & Subline -->
  <g transform="translate(170, 0)">
    <text x="0" y="44" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="2" fill="${C.vermilion}">06 / INITIATE CONTACT — IMMEDIATE AVAILABILITY</text>
    
    <text x="0" y="96" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-weight="bold" fill="${C.ink}" letter-spacing="-0.5">Let's build something worth shipping.</text>

    <text x="0" y="130" font-family="Georgia, 'Times New Roman', serif" font-size="17" font-style="italic" fill="${C.inkMuted}">Open for Frontend and Full-Stack engineering roles.</text>

    <text x="0" y="170" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="1.5" fill="${C.ink}">LOCATIONS: PUNE · BANGALORE · REMOTE</text>
  </g>

  <!-- Right Side Callout Button -->
  <g transform="translate(865, 58)">
    <rect width="285" height="98" rx="12" fill="${C.sandLight}" stroke="${C.ink}" stroke-width="1.5"/>
    <text x="22" y="32" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="1.5" fill="${C.vermilion}">PRIMARY CHANNEL</text>
    <text x="22" y="58" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="13" font-weight="700" fill="${C.ink}">guruvishnu1927@gmail.com</text>
    <text x="22" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" font-size="10.5" fill="${C.inkMuted}">Click to send direct transmission →</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// PROJECT CARDS CONFIGURATION
// ---------------------------------------------------------------------------
const projectConfigs = [
  {
    filename: 'codelab-card.svg',
    index: '01',
    title: 'CodeLab',
    tag: 'FLAGSHIP · EXECUTION ENGINE',
    descLine1: 'Interactive coding platform running untrusted code in hardened micro-sandboxes.',
    descLine2: 'Deployed on Render & Supabase with Auth.js HS256 JWTs and zero cold-start caching.',
    stack: ['Next.js 14', 'FastAPI', 'Supabase', 'Render', 'PostgreSQL', 'Three.js'],
    metricLabel: 'PRODUCTION STACK',
    metricValue: 'RENDER API · SUPABASE DB · VERCEL UI',
    accentColor: C.vermilion,
    cubeProps: { topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark, label: 'CL', labelFill: C.vermilionDark },
  },
  {
    filename: 'portfolio-card.svg',
    index: '02',
    title: '3D Developer Portfolio',
    tag: 'WEBGL · TELEMETRY',
    descLine1: 'Immersive WebGL galaxy with live GitHub API telemetry and solar-orbit skills visualizer.',
    descLine2: 'Features live component inspector, embedded Gemini assistant, and Lenis inertia scrolling.',
    stack: ['React 19', 'R3F', 'TypeScript', 'Tailwind v4', 'Vite'],
    metricLabel: 'PERFORMANCE',
    metricValue: '96+ LIGHTHOUSE · LIVE TELEMETRY',
    accentColor: C.cobalt,
    cubeProps: { topFill: C.cobaltLight, leftFill: C.cobalt, rightFill: C.cobaltDark, label: '3D', labelFill: C.cobaltDark },
  },
  {
    filename: 'alacrity-card.svg',
    index: '03',
    title: 'Alacrity Trade Platform',
    tag: 'PRODUCTION · CANDORWORKS',
    descLine1: 'High-volume international logistics UI connecting Indian exporters to global markets.',
    descLine2: 'Engineered with debounced search pipelines and lazy loading for intensive workloads.',
    stack: ['React', 'Context API', 'Axios', 'REST', 'WCAG 2.1 AA'],
    metricLabel: 'SYSTEM IMPACT',
    metricValue: '−60% API CALLS · −35% BUNDLE SIZE',
    accentColor: C.vermilion,
    cubeProps: { topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: 'AT' },
  },
  {
    filename: 'talent-eval-card.svg',
    index: '04',
    title: 'Talent Evaluation Platform',
    tag: 'PRODUCTION · CANDORWORKS',
    descLine1: 'Full-lifecycle assessment interface backed by Python & PostgreSQL microservices.',
    descLine2: 'Standardized 12+ modular design system components and integrated 5+ REST endpoints.',
    stack: ['React', 'Python', 'PostgreSQL', 'WordPress', 'REST'],
    metricLabel: 'DEV ACCELERATION',
    metricValue: '12+ REUSABLE COMPONENTS · +40% SPEED',
    accentColor: C.cobalt,
    cubeProps: { topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: 'TE' },
  },
  {
    filename: 'evoting-card.svg',
    index: '05',
    title: 'Iris E-Voting System',
    tag: 'SECURITY · BIOMETRICS',
    descLine1: 'Tamper-proof voting system verifying ballots via biometric iris recognition and 2-step auth.',
    descLine2: 'Ensures cryptographic ballot integrity across the complete AES encryption lifecycle.',
    stack: ['Python', 'Django', 'SQLite', 'Biometrics', 'AES'],
    metricLabel: 'BALLOT INTEGRITY',
    metricValue: '100% DUPLICATE-VOTE ELIMINATION',
    accentColor: C.ink,
    cubeProps: { topFill: C.sandLight, leftFill: C.sand, rightFill: C.sandDark, label: 'EV' },
  },
  {
    filename: 'freshbites-card.svg',
    index: '06',
    title: 'FreshBites',
    tag: 'E-COMMERCE · 3D WEB',
    descLine1: 'Food recipe discovery and ready-to-cook ingredient kit platform with interactive 3D models.',
    descLine2: 'Built with fast route transitions, lazy-loaded imagery, and optimized mobile checkout.',
    stack: ['React 18', 'TypeScript', 'Three.js', 'Tailwind v4', 'Vite'],
    metricLabel: 'USER EXPERIENCE',
    metricValue: 'FAST TRANSITIONS · 3D KIT ORDERING',
    accentColor: C.vermilion,
    cubeProps: { topFill: C.vermilionLight, leftFill: C.vermilion, rightFill: C.vermilionDark, label: 'FB', labelFill: C.vermilionDark },
  },
];

// ---------------------------------------------------------------------------
// BUILD EXECUTION
// ---------------------------------------------------------------------------
function main() {
  console.log('--- Generating Refined Editorial Isometric Assets ---');

  const files = [
    { name: 'hero.svg', content: buildHero() },
    { name: 'stats-strip.svg', content: buildStatsStrip() },
    { name: 'stack-iso.svg', content: buildStackIso() },
    { name: 'roadmap.svg', content: buildRoadmap() },
    { name: 'contact.svg', content: buildContact() },
  ];

  for (const cfg of projectConfigs) {
    files.push({
      name: cfg.filename,
      content: buildProjectCard(cfg),
    });
  }

  for (const f of files) {
    const filePath = path.join(ASSETS_DIR, f.name);
    fs.writeFileSync(filePath, f.content.trim(), 'utf-8');
    const stats = fs.statSync(filePath);
    console.log(`✓ ${f.name.padEnd(24)} ${(stats.size / 1024).toFixed(1)} KB`);
  }

  console.log(`\nSuccessfully built ${files.length} SVG assets in ${ASSETS_DIR}`);
}

main();

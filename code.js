/*
 * Lumora Landing Page Generator — Figma plugin
 * ------------------------------------------------------------
 * Builds the complete Lumora landing-page design in the current Figma page:
 *   • Colour styles, text styles and effect styles (shared design tokens)
 *   • Reusable components: Logo, Button (3 variants), Nav Link, Badge,
 *     Icons, Feature Card and Hero Illustration
 *   • "Design System" sheet that documents every style and component
 *   • Desktop (1440) and Mobile (390) landing-page frames built with Auto Layout
 *
 * Run it from the Figma desktop app:
 *   Plugins → Development → Import plugin from manifest… → pick manifest.json
 *   then Plugins → Development → Lumora Landing Page Generator
 */

// ───────────────────────────── Design tokens ─────────────────────────────

const COLORS = [
  // [style name, hex, usage note]
  ['Brand/Tangerine', '#FF6B3D', 'Primary buttons, icons, highlights'],
  ['Brand/Ember', '#D9480F', 'Accent text (overlines, heading highlight)'],
  ['Brand/Tangerine Soft', '#FFE3D8', 'Icon tiles, decorative shapes'],
  ['Brand/Ink', '#1C1A3D', 'Headings, primary text, dark surfaces'],
  ['Brand/Lilac', '#E8E4FF', 'Illustration backdrop, icon tiles'],
  ['Brand/Teal', '#0E9F8E', 'Success / completed states'],
  ['Brand/Teal Soft', '#D5F5F0', 'Icon tiles'],
  ['Neutral/Cream', '#FFF8F1', 'Page background'],
  ['Neutral/White', '#FFFFFF', 'Cards, surfaces'],
  ['Neutral/Slate', '#55536E', 'Body text'],
  ['Neutral/Mist', '#B9B6D3', 'Body text on dark surfaces'],
  ['Neutral/Line', '#ECE4D9', 'Borders and dividers'],
];

// [style name, font role, weight, size, line height, letter spacing %, text case]
const TYPE = [
  ['Display/H1', 'heading', 'Bold', 64, 72, -2],
  ['Heading/H2', 'heading', 'Bold', 44, 52, -1.5],
  ['Heading/H3', 'heading', 'SemiBold', 22, 30, -0.5],
  ['Mobile/H1', 'heading', 'Bold', 40, 48, -1.5],
  ['Mobile/H2', 'heading', 'Bold', 30, 38, -1],
  ['Label/Stat', 'heading', 'Bold', 36, 44, -1],
  ['Body/Large', 'body', 'Regular', 20, 32, 0],
  ['Body/Regular', 'body', 'Regular', 16, 26, 0],
  ['Body/Small', 'body', 'Regular', 14, 22, 0],
  ['Label/Button', 'body', 'SemiBold', 16, 24, 0],
  ['Label/Nav', 'body', 'Medium', 15, 24, 0],
  ['Label/Overline', 'body', 'Bold', 13, 16, 8, 'UPPER'],
];

const EFFECTS = [
  ['Shadow/Card', { y: 12, blur: 32, alpha: 0.07 }],
  ['Shadow/Float', { y: 20, blur: 48, alpha: 0.16 }],
];

const FONT_FAMILIES = {
  heading: ['Space Grotesk', 'Inter'],
  body: ['Inter'],
};

// 24×24 line icons (stroke colours baked in so they read as brand icons)
const ICONS = {
  Calendar: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4.5" width="18" height="16.5" rx="3" stroke="${c}" stroke-width="1.8"/><path d="M3 9.5H21M8 2.5V6.5M16 2.5V6.5M7.5 13.5H10M14 13.5H16.5M7.5 17H10" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  Sparkle: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L13.9 9.1L20 11L13.9 12.9L12 19L10.1 12.9L4 11L10.1 9.1L12 3Z" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M19 17L19.7 19.3L22 20L19.7 20.7L19 23L18.3 20.7L16 20L18.3 19.3L19 17Z" fill="${c}"/></svg>`,
  Focus: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="8" stroke="${c}" stroke-width="1.8"/><path d="M12 9V13L14.5 15.5M9.5 2.5H14.5M19 5L20.5 6.5" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  Check: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${c}"/><path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  Circle: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9.2" stroke="${c}" stroke-width="1.8"/></svg>`,
  Flame: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C16.4 22 19.5 19 19.5 14.8C19.5 10.2 15.8 7.4 14.6 2.5C12.3 4.1 11 6.6 11.4 9.4C10.2 8.7 9.3 7.4 9 6C6.4 8.1 4.5 11.2 4.5 14.8C4.5 19 7.6 22 12 22Z" fill="${c}"/><path d="M12 21C13.9 21 15.2 19.6 15.2 17.8C15.2 15.7 13.4 14.6 12.8 12.5C11.4 13.6 10.6 15 10.8 16.4C10.1 16.1 9.6 15.5 9.4 14.9C8.9 15.8 8.8 16.9 8.8 17.8C8.8 19.6 10.1 21 12 21Z" fill="#FFE3D8"/></svg>`,
  Menu: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H20M4 12H20M4 17H14" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`,
  Arrow: (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M13 6L19 12L13 18" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const ICON_COLORS = {
  Calendar: '#D9480F', Sparkle: '#5B4BDB', Focus: '#0E9F8E', Check: '#0E9F8E',
  Circle: '#B9B6D3', Flame: '#FF6B3D', Menu: '#1C1A3D', Arrow: '#1C1A3D',
};

const LOGO_SVG = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="11" fill="#FF6B3D"/><path d="M22.5 8.5C17.3 8.9 13.2 13.2 13.2 18.5C13.2 23.8 17.3 28.1 22.5 28.5C21.1 29.3 19.4 29.8 17.6 29.8C11.6 29.8 6.8 24.8 6.8 18.6C6.8 12.4 11.6 7.4 17.6 7.4C19.4 7.4 21.1 7.8 22.5 8.5Z" fill="#1C1A3D"/><circle cx="25" cy="13" r="2.6" fill="#1C1A3D"/></svg>`;

const RING_SVG = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="26" stroke="#E8E4FF" stroke-width="8"/><path d="M32 6A26 26 0 1 1 16.72 53.03" stroke="#FF6B3D" stroke-width="8" stroke-linecap="round"/></svg>`;

// ───────────────────────────── State ─────────────────────────────

const S = { c: {}, t: {}, e: {} }; // colour, text and effect styles by name
const K = {}; // components and their property keys

// ───────────────────────────── Helpers ─────────────────────────────

function rgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function normPad(p) {
  if (p == null) return [0, 0, 0, 0];
  if (typeof p === 'number') return [p, p, p, p];
  if (p.length === 2) return [p[0], p[1], p[0], p[1]];
  return p;
}

/** Create a frame (or component) with optional Auto Layout. */
function box(name, dir, o) {
  o = o || {};
  const f = o.component ? figma.createComponent() : figma.createFrame();
  f.name = name;
  f.fills = [];
  f.clipsContent = false;
  if (dir) {
    f.layoutMode = dir;
    f.primaryAxisSizingMode = 'AUTO';
    f.counterAxisSizingMode = 'AUTO';
    f.itemSpacing = o.gap || 0;
    const p = normPad(o.pad);
    f.paddingTop = p[0];
    f.paddingRight = p[1];
    f.paddingBottom = p[2];
    f.paddingLeft = p[3];
    f.primaryAxisAlignItems = o.main || 'MIN';
    f.counterAxisAlignItems = o.cross || 'MIN';
    if (o.wrap) {
      f.layoutWrap = 'WRAP';
      f.counterAxisSpacing = o.rowGap != null ? o.rowGap : o.gap || 0;
    }
  }
  if (o.radius) f.cornerRadius = o.radius;
  return f;
}

/** Append a child to an Auto Layout parent and set its resizing behaviour. */
function add(parent, child, h, v) {
  parent.appendChild(child);
  if (h) child.layoutSizingHorizontal = h;
  if (v) child.layoutSizingVertical = v;
  return child;
}

/** Fix the width of an Auto Layout frame while its height keeps hugging. */
function fixWidth(f, w) {
  f.resize(w, Math.max(f.height, 1));
  if (f.layoutMode === 'VERTICAL') f.counterAxisSizingMode = 'FIXED';
  else if (f.layoutMode === 'HORIZONTAL') f.primaryAxisSizingMode = 'FIXED';
}

async function fill(node, key) {
  await node.setFillStyleIdAsync(S.c[key].id);
}

async function stroke(node, key, weight) {
  await node.setStrokeStyleIdAsync(S.c[key].id);
  node.strokeWeight = weight || 1;
  node.strokeAlign = 'INSIDE';
}

async function shadow(node, key) {
  await node.setEffectStyleIdAsync(S.e[key].id);
}

/** Text node that uses a shared text style and colour style. */
async function txt(content, style, color, o) {
  o = o || {};
  const t = figma.createText();
  await t.setTextStyleIdAsync(S.t[style].id);
  t.characters = content;
  await t.setFillStyleIdAsync(S.c[color].id);
  if (o.align) t.textAlignHorizontal = o.align;
  t.name = o.name || content.split('\n')[0].slice(0, 32);
  return t;
}

function svg(markup, name) {
  const n = figma.createNodeFromSvg(markup);
  n.name = name;
  n.fills = [];
  return n;
}

async function ellipse(size, color, name) {
  const e = figma.createEllipse();
  e.resize(size, size);
  e.name = name || 'Ellipse';
  await fill(e, color);
  return e;
}

async function rect(w, h, color, radius, name) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.cornerRadius = radius || 0;
  r.name = name || 'Rectangle';
  await fill(r, color);
  return r;
}

// ───────────────────────────── Styles ─────────────────────────────

async function resolveFonts() {
  const available = await figma.listAvailableFontsAsync();
  const norm = (s) => s.toLowerCase().replace(/[\s_-]/g, '');
  const pick = (role, weight) => {
    const tries = [weight, 'Bold', 'Regular'];
    for (const fam of FONT_FAMILIES[role]) {
      for (const w of tries) {
        const hit = available.find((f) => f.fontName.family === fam && norm(f.fontName.style) === norm(w));
        if (hit) return hit.fontName;
      }
    }
    return { family: 'Inter', style: 'Regular' };
  };
  const resolved = {};
  const toLoad = [{ family: 'Inter', style: 'Regular' }];
  for (const row of TYPE) {
    const fn = pick(row[1], row[2]);
    resolved[row[0]] = fn;
    toLoad.push(fn);
  }
  for (const fn of toLoad) await figma.loadFontAsync(fn);
  return resolved;
}

async function createStyles() {
  const paints = await figma.getLocalPaintStylesAsync();
  for (const [name, hex, note] of COLORS) {
    let s = paints.find((p) => p.name === name);
    if (!s) s = figma.createPaintStyle();
    s.name = name;
    s.description = `${hex} — ${note}`;
    s.paints = [{ type: 'SOLID', color: rgb(hex) }];
    S.c[name] = s;
  }

  const fonts = await resolveFonts();
  const texts = await figma.getLocalTextStylesAsync();
  for (const [name, , , size, lh, ls, textCase] of TYPE) {
    let s = texts.find((t) => t.name === name);
    if (!s) s = figma.createTextStyle();
    s.name = name;
    s.fontName = fonts[name];
    s.fontSize = size;
    s.lineHeight = { unit: 'PIXELS', value: lh };
    s.letterSpacing = { unit: 'PERCENT', value: ls };
    s.textCase = textCase || 'ORIGINAL';
    s.description = `${fonts[name].family} ${fonts[name].style} · ${size}/${lh}`;
    S.t[name] = s;
  }

  const effects = await figma.getLocalEffectStylesAsync();
  for (const [name, e] of EFFECTS) {
    let s = effects.find((x) => x.name === name);
    if (!s) s = figma.createEffectStyle();
    s.name = name;
    s.effects = [{
      type: 'DROP_SHADOW', color: Object.assign(rgb('#1C1A3D'), { a: e.alpha }),
      offset: { x: 0, y: e.y }, radius: e.blur, spread: 0, visible: true, blendMode: 'NORMAL',
    }];
    S.e[name] = s;
  }
}

// ───────────────────────────── Components ─────────────────────────────

function componentGroup(title) {
  const g = box(title, 'VERTICAL', { gap: 16 });
  return g;
}

async function labelled(parent, title, node) {
  const g = componentGroup(title);
  add(g, await txt(title, 'Label/Overline', 'Neutral/Slate'));
  add(g, node);
  add(parent, g);
  return g;
}

async function buildComponents(host) {
  // Icons ---------------------------------------------------------------
  K.icons = {};
  const iconRow = box('Icons', 'HORIZONTAL', { gap: 20, cross: 'CENTER' });
  for (const name of Object.keys(ICONS)) {
    const c = figma.createComponent();
    c.name = `Icon/${name}`;
    c.fills = [];
    c.resize(24, 24);
    const v = svg(ICONS[name](ICON_COLORS[name]), 'Vector');
    c.appendChild(v);
    v.x = 0;
    v.y = 0;
    v.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    iconRow.appendChild(c);
    K.icons[name] = c;
  }

  // Logo ----------------------------------------------------------------
  const logo = box('Logo', 'HORIZONTAL', { component: true, gap: 10, cross: 'CENTER' });
  add(logo, svg(LOGO_SVG, 'Logo Mark'));
  add(logo, await txt('Lumora', 'Heading/H3', 'Brand/Ink', { name: 'Wordmark' }));
  logo.description = 'Lumora logo — mark + wordmark. Use on light backgrounds.';
  K.logo = logo;

  // Button (3 variants) -------------------------------------------------
  const variants = [
    ['Primary', 'Brand/Tangerine', 'Brand/Ink', null],
    ['Secondary', null, 'Brand/Ink', 'Brand/Ink'],
    ['Dark', 'Brand/Ink', 'Neutral/White', null],
  ];
  const btns = [];
  for (const [type, bg, fg, border] of variants) {
    const b = box(`Type=${type}`, 'HORIZONTAL', {
      component: true, gap: 8, pad: [14, 26], main: 'CENTER', cross: 'CENTER', radius: 999,
    });
    if (bg) await fill(b, bg);
    if (border) await stroke(b, border, 1.5);
    add(b, await txt('Get started', 'Label/Button', fg, { name: 'Label' }));
    host.appendChild(b);
    btns.push(b);
  }
  const btnSet = figma.combineAsVariants(btns, host);
  btnSet.name = 'Button';
  btnSet.layoutMode = 'HORIZONTAL';
  btnSet.primaryAxisSizingMode = 'AUTO';
  btnSet.counterAxisSizingMode = 'AUTO';
  btnSet.itemSpacing = 24;
  btnSet.paddingTop = btnSet.paddingBottom = btnSet.paddingLeft = btnSet.paddingRight = 24;
  btnSet.cornerRadius = 12;
  btnSet.strokes = [{ type: 'SOLID', color: rgb('#9747FF') }];
  btnSet.dashPattern = [6, 4];
  btnSet.description = 'Pill button. Primary = main action, Secondary = alternative action, Dark = header / high-contrast CTA.';
  K.btnLabel = btnSet.addComponentProperty('Label', 'TEXT', 'Get started');
  for (const v of btnSet.children) {
    v.findOne((n) => n.name === 'Label').componentPropertyReferences = { characters: K.btnLabel };
  }
  K.btn = { Primary: btns[0], Secondary: btns[1], Dark: btns[2], set: btnSet };

  // Nav Link ------------------------------------------------------------
  const nav = box('Nav Link', 'HORIZONTAL', { component: true, pad: [8, 2], cross: 'CENTER' });
  const navText = add(nav, await txt('Features', 'Label/Nav', 'Brand/Ink', { name: 'Label' }));
  K.navLabel = nav.addComponentProperty('Label', 'TEXT', 'Features');
  navText.componentPropertyReferences = { characters: K.navLabel };
  nav.description = 'Header navigation link.';
  K.nav = nav;

  // Badge ---------------------------------------------------------------
  const badge = box('Badge', 'HORIZONTAL', { component: true, gap: 10, pad: [6, 16, 6, 6], cross: 'CENTER', radius: 999 });
  await fill(badge, 'Neutral/White');
  await stroke(badge, 'Neutral/Line', 1);
  const pill = box('Pill', 'HORIZONTAL', { pad: [3, 10], radius: 999, cross: 'CENTER' });
  await fill(pill, 'Brand/Tangerine');
  add(pill, await txt('New', 'Label/Overline', 'Brand/Ink', { name: 'Pill Label' }));
  add(badge, pill);
  const badgeText = add(badge, await txt('AI exam planner is here', 'Body/Small', 'Brand/Ink', { name: 'Text' }));
  K.badgeText = badge.addComponentProperty('Text', 'TEXT', 'AI exam planner is here');
  badgeText.componentPropertyReferences = { characters: K.badgeText };
  badge.description = 'Announcement badge for hero sections.';
  K.badge = badge;

  // Feature Card --------------------------------------------------------
  const card = box('Feature Card', 'VERTICAL', { component: true, gap: 20, pad: 32, radius: 24 });
  fixWidth(card, 368);
  await fill(card, 'Neutral/White');
  await stroke(card, 'Neutral/Line', 1);
  await shadow(card, 'Shadow/Card');
  const tile = box('Icon Tile', 'HORIZONTAL', { main: 'CENTER', cross: 'CENTER', radius: 16 });
  tile.resize(56, 56);
  tile.primaryAxisSizingMode = 'FIXED';
  tile.counterAxisSizingMode = 'FIXED';
  await fill(tile, 'Brand/Tangerine Soft');
  const iconInst = K.icons.Calendar.createInstance();
  iconInst.name = 'Icon';
  iconInst.rescale(28 / 24);
  add(tile, iconInst);
  add(card, tile);
  const cTitle = add(card, await txt('Smart Planner', 'Heading/H3', 'Brand/Ink', { name: 'Title' }), 'FILL');
  const cDesc = add(card, await txt('Feature description goes here.', 'Body/Regular', 'Neutral/Slate', { name: 'Description' }), 'FILL');
  const more = box('Link', 'HORIZONTAL', { gap: 6, cross: 'CENTER' });
  add(more, await txt('Learn more', 'Label/Nav', 'Brand/Ink', { name: 'Link Label' }));
  const arrow = K.icons.Arrow.createInstance();
  arrow.rescale(18 / 24);
  add(more, arrow);
  add(card, more);
  K.cardTitle = card.addComponentProperty('Title', 'TEXT', 'Smart Planner');
  K.cardDesc = card.addComponentProperty('Description', 'TEXT', 'Feature description goes here.');
  K.cardIcon = card.addComponentProperty('Icon', 'INSTANCE_SWAP', K.icons.Calendar.id);
  cTitle.componentPropertyReferences = { characters: K.cardTitle };
  cDesc.componentPropertyReferences = { characters: K.cardDesc };
  iconInst.componentPropertyReferences = { mainComponent: K.cardIcon };
  card.description = 'Feature card — swap the icon, edit title + description through component properties.';
  K.card = card;

  // Hero Illustration ---------------------------------------------------
  K.hero = await buildHeroIllustration();

  // Lay the masters out on the Design System sheet
  const grid = box('Components', 'HORIZONTAL', { gap: 56, wrap: true, rowGap: 48 });
  fixWidth(grid, 1272);
  await labelled(grid, 'Logo', logo);
  await labelled(grid, 'Button · 3 variants', btnSet);
  await labelled(grid, 'Nav Link', nav);
  await labelled(grid, 'Badge', badge);
  await labelled(grid, 'Icons', iconRow);
  await labelled(grid, 'Feature Card', card);
  await labelled(grid, 'Hero Illustration', K.hero);
  return grid;
}

async function taskRow(done, title, meta, mins) {
  const row = box(`Task — ${title}`, 'HORIZONTAL', { gap: 12, pad: [12, 14], cross: 'CENTER', radius: 14 });
  await fill(row, 'Neutral/Cream');
  const icon = (done ? K.icons.Check : K.icons.Circle).createInstance();
  icon.rescale(22 / 24);
  add(row, icon);
  const col = box('Text', 'VERTICAL', { gap: 0 });
  add(col, await txt(title, 'Label/Nav', 'Brand/Ink'), 'FILL');
  add(col, await txt(meta, 'Body/Small', 'Neutral/Slate'), 'FILL');
  add(row, col, 'FILL');
  const chip = box('Time', 'HORIZONTAL', { pad: [2, 10], radius: 999 });
  await fill(chip, done ? 'Brand/Teal Soft' : 'Neutral/White');
  add(chip, await txt(mins, 'Body/Small', 'Brand/Ink'));
  add(row, chip);
  return row;
}

async function buildHeroIllustration() {
  const c = figma.createComponent();
  c.name = 'Hero Illustration';
  c.fills = [];
  c.clipsContent = false;
  c.resize(560, 560);
  c.description = 'Product illustration: Lumora "Today\'s plan" app card with floating chips.';

  const blob = await rect(480, 450, 'Brand/Lilac', 48, 'Backdrop');
  blob.x = 50; blob.y = 36;
  c.appendChild(blob);
  const dot = await ellipse(120, 'Brand/Tangerine Soft', 'Decor Circle');
  dot.x = 0; dot.y = 360;
  c.appendChild(dot);
  const ring = figma.createEllipse();
  ring.name = 'Decor Ring';
  ring.resize(72, 72);
  ring.fills = [];
  await stroke(ring, 'Brand/Tangerine', 2);
  ring.x = 474; ring.y = 4;
  c.appendChild(ring);

  // App card
  const card = box('App Card', 'VERTICAL', { gap: 16, pad: 24, radius: 24 });
  fixWidth(card, 384);
  await fill(card, 'Neutral/White');
  await shadow(card, 'Shadow/Float');
  const head = box('Card Header', 'HORIZONTAL', { main: 'SPACE_BETWEEN', cross: 'CENTER' });
  add(head, await txt("Today's plan", 'Heading/H3', 'Brand/Ink'));
  add(head, await txt('Tue, 17 Nov', 'Body/Small', 'Neutral/Slate'));
  add(card, head, 'FILL');

  const prog = box('Progress', 'HORIZONTAL', { gap: 16, pad: 14, cross: 'CENTER', radius: 16 });
  await stroke(prog, 'Neutral/Line', 1);
  const ringBox = figma.createFrame();
  ringBox.name = 'Progress Ring';
  ringBox.fills = [];
  ringBox.resize(64, 64);
  const ringSvg = svg(RING_SVG, 'Ring');
  ringBox.appendChild(ringSvg);
  const pct = await txt('60%', 'Label/Nav', 'Brand/Ink');
  ringBox.appendChild(pct);
  pct.x = Math.round((64 - pct.width) / 2);
  pct.y = Math.round((64 - pct.height) / 2);
  add(prog, ringBox);
  const pCol = box('Progress Text', 'VERTICAL', { gap: 2 });
  add(pCol, await txt('3 of 5 sessions done', 'Label/Button', 'Brand/Ink'), 'FILL');
  add(pCol, await txt("You're 40 min ahead of schedule", 'Body/Small', 'Neutral/Slate'), 'FILL');
  add(prog, pCol, 'FILL');
  add(card, prog, 'FILL');

  const list = box('Tasks', 'VERTICAL', { gap: 10 });
  add(list, await taskRow(true, 'Calculus — Integration', 'Practice set · Chapter 7', '45 min'), 'FILL');
  add(list, await taskRow(false, 'Physics lab report', 'Draft the results section', '30 min'), 'FILL');
  add(list, await taskRow(false, 'Spaced review', '24 flashcards due', '15 min'), 'FILL');
  add(card, list, 'FILL');
  c.appendChild(card);
  card.x = 88; card.y = 72;

  // Floating chips
  const streak = box('Streak Chip', 'HORIZONTAL', { gap: 8, pad: [10, 18, 10, 12], cross: 'CENTER', radius: 999 });
  await fill(streak, 'Neutral/White');
  await shadow(streak, 'Shadow/Float');
  const flame = K.icons.Flame.createInstance();
  add(streak, flame);
  add(streak, await txt('12-day streak', 'Label/Nav', 'Brand/Ink'));
  c.appendChild(streak);
  streak.x = 350; streak.y = 28;

  const tip = box('AI Tip Chip', 'HORIZONTAL', { gap: 12, pad: [14, 20, 14, 16], cross: 'CENTER', radius: 18 });
  await fill(tip, 'Brand/Ink');
  await shadow(tip, 'Shadow/Float');
  const sp = box('Tip Icon', 'HORIZONTAL', { main: 'CENTER', cross: 'CENTER', radius: 10 });
  sp.resize(36, 36);
  sp.primaryAxisSizingMode = 'FIXED';
  sp.counterAxisSizingMode = 'FIXED';
  await fill(sp, 'Brand/Tangerine');
  const spIcon = K.icons.Sparkle.createInstance();
  add(sp, spIcon);
  add(tip, sp);
  const tipCol = box('Tip Text', 'VERTICAL', { gap: 2 });
  add(tipCol, await txt('AI tip', 'Label/Overline', 'Neutral/Mist'));
  add(tipCol, await txt('Review Physics before 6 PM', 'Body/Small', 'Neutral/White'));
  add(tip, tipCol);
  c.appendChild(tip);
  tip.x = 18; tip.y = 492;

  return c;
}

// Instance helpers ------------------------------------------------------

function button(type, label) {
  const i = K.btn[type].createInstance();
  i.setProperties({ [K.btnLabel]: label });
  i.name = `Button / ${type}`;
  return i;
}

function navLink(label) {
  const i = K.nav.createInstance();
  i.setProperties({ [K.navLabel]: label });
  i.name = `Nav Link / ${label}`;
  return i;
}

async function featureCard(icon, tileColor, title, desc) {
  const i = K.card.createInstance();
  i.setProperties({ [K.cardTitle]: title, [K.cardDesc]: desc, [K.cardIcon]: K.icons[icon].id });
  i.name = `Feature Card / ${title}`;
  const tile = i.findOne((n) => n.name === 'Icon Tile');
  if (tile) await tile.setFillStyleIdAsync(S.c[tileColor].id);
  return i;
}

// ───────────────────────────── Content ─────────────────────────────

const COPY = {
  nav: ['Features', 'How it works', 'Pricing', 'Campuses'],
  badge: 'AI exam planner is here',
  h1: 'Study smarter,\nnot longer.',
  h1Highlight: 'not longer.',
  lead: 'Lumora turns your syllabus into a day-by-day study plan, builds flashcards from your notes and keeps you focused, so you finish the semester ahead instead of cramming.',
  proof: 'Loved by 40,000+ students on 120 campuses',
  stats: [['40k+', 'Students planning with Lumora'], ['2.1×', 'More study sessions completed'], ['4.8/5', 'Average app-store rating'], ['120', 'Partner campuses']],
  features: [
    ['Calendar', 'Brand/Tangerine Soft', 'Smart Planner', 'Upload your syllabus once. Lumora maps every deadline and spreads the work into realistic daily sessions.'],
    ['Sparkle', 'Brand/Lilac', 'AI Flashcards', 'Turn lecture notes and PDFs into spaced-repetition flashcards in seconds, ready for your next review.'],
    ['Focus', 'Brand/Teal Soft', 'Focus Mode', 'Timed deep-work sessions with gentle nudges, streaks and a distraction blocker that actually helps.'],
  ],
  steps: [
    ['01', 'Add your courses', 'Import a syllabus or connect your college calendar. Lumora finds every exam, lab and deadline.'],
    ['02', 'Get your plan', 'The AI builds a balanced weekly plan around your classes, job shifts and sleep, then adjusts as life happens.'],
    ['03', 'Show up and learn', 'Follow today’s sessions, review smart flashcards and watch your progress and streaks grow.'],
  ],
  ctaH: 'Your best semester starts tonight.',
  ctaP: 'Join 40,000 students who plan less and learn more. Free for your first 30 days.',
  footerCols: [
    ['Product', ['Features', 'Pricing', 'For campuses', 'Changelog']],
    ['Company', ['About', 'Careers', 'Blog', 'Press kit']],
    ['Support', ['Help centre', 'Contact', 'Privacy', 'Terms']],
  ],
};

async function sectionHeading(parent, overline, title, sub, mobile) {
  const w = box('Section Heading', 'VERTICAL', { gap: 16, cross: 'CENTER' });
  add(w, await txt(overline, 'Label/Overline', 'Brand/Ember', { align: 'CENTER' }));
  add(w, await txt(title, mobile ? 'Mobile/H2' : 'Heading/H2', 'Brand/Ink', { align: 'CENTER' }), 'FILL');
  if (sub) add(w, await txt(sub, mobile ? 'Body/Regular' : 'Body/Large', 'Neutral/Slate', { align: 'CENTER' }), 'FILL');
  if (mobile) add(parent, w, 'FILL');
  else { parent.appendChild(w); fixWidth(w, 760); }
  return w;
}

async function avatars() {
  const a = box('Avatars', 'HORIZONTAL', { gap: -10, cross: 'CENTER' });
  for (const col of ['Brand/Tangerine', 'Brand/Lilac', 'Brand/Teal', 'Brand/Ink']) {
    const e = await ellipse(34, col, 'Avatar');
    await stroke(e, 'Neutral/Cream', 3);
    add(a, e);
  }
  return a;
}

async function heroText(parent, mobile) {
  const col = box('Hero Content', 'VERTICAL', { gap: mobile ? 22 : 28 });
  const b = K.badge.createInstance();
  b.setProperties({ [K.badgeText]: COPY.badge });
  add(col, b);
  const h1 = await txt(COPY.h1, mobile ? 'Mobile/H1' : 'Display/H1', 'Brand/Ink', { name: 'Heading' });
  const start = COPY.h1.indexOf(COPY.h1Highlight);
  await h1.setRangeFillStyleIdAsync(start, start + COPY.h1Highlight.length, S.c['Brand/Ember'].id);
  add(col, h1, 'FILL');
  add(col, await txt(COPY.lead, mobile ? 'Body/Regular' : 'Body/Large', 'Neutral/Slate', { name: 'Description' }), 'FILL');
  const ctas = box('Hero Buttons', mobile ? 'VERTICAL' : 'HORIZONTAL', { gap: mobile ? 12 : 16 });
  if (mobile) {
    add(ctas, button('Primary', 'Start for free'), 'FILL');
    add(ctas, button('Secondary', 'Watch 2-min demo'), 'FILL');
    add(col, ctas, 'FILL');
  } else {
    add(ctas, button('Primary', 'Start for free'));
    add(ctas, button('Secondary', 'Watch 2-min demo'));
    add(col, ctas);
  }
  const proof = box('Social Proof', 'HORIZONTAL', { gap: 14, cross: 'CENTER' });
  add(proof, await avatars());
  add(proof, await txt(COPY.proof, 'Body/Small', 'Neutral/Slate'), mobile ? 'FILL' : null);
  add(col, proof, mobile ? 'FILL' : null);
  add(parent, col, 'FILL');
  return col;
}

async function stats(parent, mobile) {
  const card = box('Stats', 'HORIZONTAL', mobile
    ? { gap: 24, pad: 24, wrap: true, rowGap: 24, radius: 20 }
    : { pad: [32, 48], main: 'SPACE_BETWEEN', radius: 24 });
  await fill(card, 'Neutral/White');
  await stroke(card, 'Neutral/Line', 1);
  add(parent, card, 'FILL');
  for (const [v, l] of COPY.stats) {
    const s = box(`Stat / ${v}`, 'VERTICAL', { gap: 4 });
    add(s, await txt(v, 'Label/Stat', 'Brand/Ink'));
    add(s, await txt(l, 'Body/Small', 'Neutral/Slate'), mobile ? 'FILL' : null);
    card.appendChild(s);
    if (mobile) fixWidth(s, 129);
  }
  return card;
}

async function steps(parent, mobile) {
  const row = box('Steps', mobile ? 'VERTICAL' : 'HORIZONTAL', { gap: mobile ? 28 : 32 });
  for (const [n, t, d] of COPY.steps) {
    const s = box(`Step ${n}`, 'VERTICAL', { gap: 14 });
    const num = box('Number', 'HORIZONTAL', { main: 'CENTER', cross: 'CENTER', radius: 999 });
    num.resize(48, 48);
    num.primaryAxisSizingMode = 'FIXED';
    num.counterAxisSizingMode = 'FIXED';
    await fill(num, 'Brand/Ink');
    add(num, await txt(n, 'Label/Button', 'Neutral/White'));
    add(s, num);
    add(s, await txt(t, 'Heading/H3', 'Brand/Ink'), 'FILL');
    add(s, await txt(d, 'Body/Regular', 'Neutral/Slate'), 'FILL');
    add(row, s, 'FILL');
  }
  add(parent, row, 'FILL');
}

async function cta(parent, mobile) {
  const band = box('CTA Card', 'VERTICAL', { gap: 24, pad: mobile ? [48, 24] : [72, 64], cross: 'CENTER', radius: mobile ? 24 : 32 });
  await fill(band, 'Brand/Ink');
  add(band, await txt(COPY.ctaH, mobile ? 'Mobile/H2' : 'Heading/H2', 'Neutral/White', { align: 'CENTER' }), 'FILL');
  const p = await txt(COPY.ctaP, mobile ? 'Body/Regular' : 'Body/Large', 'Neutral/Mist', { align: 'CENTER' });
  if (mobile) add(band, p, 'FILL');
  else { band.appendChild(p); p.resize(620, p.height); p.textAutoResize = 'HEIGHT'; }
  add(band, button('Primary', 'Create my study plan'), mobile ? 'FILL' : null);
  add(band, await txt('No credit card · Cancel anytime', 'Body/Small', 'Neutral/Mist', { align: 'CENTER' }));
  add(parent, band, 'FILL');
}

async function footer(root, mobile) {
  const f = box('Footer', 'VERTICAL', { gap: mobile ? 32 : 48, pad: mobile ? [48, 20, 28, 20] : [64, 120, 32, 120] });
  await fill(f, 'Neutral/White');
  await stroke(f, 'Neutral/Line', 1);
  f.strokeTopWeight = 1; f.strokeBottomWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0;
  add(root, f, 'FILL');

  const top = box('Footer Top', mobile ? 'VERTICAL' : 'HORIZONTAL', { gap: 40, main: mobile ? 'MIN' : 'SPACE_BETWEEN' });
  add(f, top, 'FILL');
  const brand = box('Brand', 'VERTICAL', { gap: 16 });
  add(brand, K.logo.createInstance());
  add(brand, await txt('The AI study companion that helps college students plan less, focus more and finish the semester strong.', 'Body/Small', 'Neutral/Slate'), 'FILL');
  if (mobile) add(top, brand, 'FILL');
  else { top.appendChild(brand); fixWidth(brand, 320); }

  const cols = box('Link Columns', 'HORIZONTAL', { gap: mobile ? 32 : 80, wrap: mobile, rowGap: 24 });
  for (const [h, links] of COPY.footerCols) {
    const c = box(`Column / ${h}`, 'VERTICAL', { gap: 12 });
    add(c, await txt(h, 'Label/Overline', 'Brand/Ink'));
    for (const l of links) add(c, await txt(l, 'Body/Small', 'Neutral/Slate'));
    add(cols, c);
  }
  add(top, cols, mobile ? 'FILL' : null);

  const bottom = box('Footer Bottom', mobile ? 'VERTICAL' : 'HORIZONTAL', { gap: 8, pad: [24, 0, 0, 0], main: mobile ? 'MIN' : 'SPACE_BETWEEN' });
  await stroke(bottom, 'Neutral/Line', 1);
  bottom.strokeTopWeight = 1; bottom.strokeBottomWeight = 0; bottom.strokeLeftWeight = 0; bottom.strokeRightWeight = 0;
  add(bottom, await txt('© 2026 Lumora Learning — a fictional product made for a UI/UX course project.', 'Body/Small', 'Neutral/Slate'), mobile ? 'FILL' : null);
  add(bottom, await txt('Instagram · LinkedIn · YouTube', 'Body/Small', 'Neutral/Slate'));
  add(f, bottom, 'FILL');
}

// ───────────────────────────── Pages ─────────────────────────────

async function buildDesktop() {
  const root = box('Lumora — Desktop 1440', 'VERTICAL', {});
  fixWidth(root, 1440);
  await fill(root, 'Neutral/Cream');
  root.clipsContent = true;

  // Header
  const header = box('Header', 'HORIZONTAL', { pad: [20, 120], main: 'SPACE_BETWEEN', cross: 'CENTER' });
  await stroke(header, 'Neutral/Line', 1);
  header.strokeTopWeight = 0; header.strokeLeftWeight = 0; header.strokeRightWeight = 0; header.strokeBottomWeight = 1;
  add(root, header, 'FILL');
  add(header, K.logo.createInstance());
  const nav = box('Navigation', 'HORIZONTAL', { gap: 36, cross: 'CENTER' });
  for (const l of COPY.nav) add(nav, navLink(l));
  add(header, nav);
  const actions = box('Header Actions', 'HORIZONTAL', { gap: 20, cross: 'CENTER' });
  add(actions, navLink('Log in'));
  add(actions, button('Dark', 'Get started free'));
  add(header, actions);

  // Hero
  const hero = box('Hero', 'HORIZONTAL', { gap: 64, pad: [80, 120, 88, 120], cross: 'CENTER' });
  add(root, hero, 'FILL');
  await heroText(hero, false);
  add(hero, K.hero.createInstance());

  // Stats
  const statWrap = box('Stats Section', 'VERTICAL', { pad: [0, 120] });
  add(root, statWrap, 'FILL');
  await stats(statWrap, false);

  // Features
  const feat = box('Features', 'VERTICAL', { gap: 56, pad: [112, 120, 48, 120], cross: 'CENTER' });
  add(root, feat, 'FILL');
  await sectionHeading(feat, 'Features', 'Everything you need to ace the semester', 'One calm place for your plan, your notes and your focus — built around how students actually study.');
  const cards = box('Feature Cards', 'HORIZONTAL', { gap: 32 });
  add(feat, cards, 'FILL');
  for (const [icon, color, t, d] of COPY.features) add(cards, await featureCard(icon, color, t, d), 'FILL', 'FILL');

  // How it works
  const how = box('How It Works', 'VERTICAL', { gap: 56, pad: [96, 120, 48, 120], cross: 'CENTER' });
  add(root, how, 'FILL');
  await sectionHeading(how, 'How it works', 'From syllabus to straight A’s in three steps', null);
  await steps(how, false);

  // CTA
  const ctaWrap = box('CTA', 'VERTICAL', { pad: [64, 120, 112, 120] });
  add(root, ctaWrap, 'FILL');
  await cta(ctaWrap, false);

  await footer(root, false);
  return root;
}

async function buildMobile() {
  const root = box('Lumora — Mobile 390', 'VERTICAL', {});
  fixWidth(root, 390);
  await fill(root, 'Neutral/Cream');
  root.clipsContent = true;

  const header = box('Header', 'HORIZONTAL', { pad: [16, 20], main: 'SPACE_BETWEEN', cross: 'CENTER' });
  await stroke(header, 'Neutral/Line', 1);
  header.strokeTopWeight = 0; header.strokeLeftWeight = 0; header.strokeRightWeight = 0; header.strokeBottomWeight = 1;
  add(root, header, 'FILL');
  add(header, K.logo.createInstance());
  const menu = K.icons.Menu.createInstance();
  menu.name = 'Menu';
  menu.rescale(28 / 24);
  add(header, menu);

  const hero = box('Hero', 'VERTICAL', { gap: 40, pad: [40, 20, 48, 20] });
  add(root, hero, 'FILL');
  await heroText(hero, true);
  const ill = K.hero.createInstance();
  ill.rescale(350 / 560);
  add(hero, ill);

  const statWrap = box('Stats Section', 'VERTICAL', { pad: [0, 20] });
  add(root, statWrap, 'FILL');
  await stats(statWrap, true);

  const feat = box('Features', 'VERTICAL', { gap: 32, pad: [64, 20, 32, 20], cross: 'CENTER' });
  add(root, feat, 'FILL');
  await sectionHeading(feat, 'Features', 'Everything you need to ace the semester', 'One calm place for your plan, your notes and your focus.', true);
  const cards = box('Feature Cards', 'VERTICAL', { gap: 20 });
  add(feat, cards, 'FILL');
  for (const [icon, color, t, d] of COPY.features) add(cards, await featureCard(icon, color, t, d), 'FILL');

  const how = box('How It Works', 'VERTICAL', { gap: 32, pad: [56, 20, 32, 20], cross: 'CENTER' });
  add(root, how, 'FILL');
  await sectionHeading(how, 'How it works', 'From syllabus to straight A’s in three steps', null, true);
  await steps(how, true);

  const ctaWrap = box('CTA', 'VERTICAL', { pad: [40, 20, 64, 20] });
  add(root, ctaWrap, 'FILL');
  await cta(ctaWrap, true);

  await footer(root, true);
  return root;
}

async function buildStyleSheet(componentsGrid) {
  const ds = box('Lumora — Design System', 'VERTICAL', { gap: 56, pad: 64 });
  await fill(ds, 'Neutral/White');
  ds.cornerRadius = 24;

  const head = box('Title', 'VERTICAL', { gap: 12 });
  add(head, await txt('Lumora Design System', 'Display/H1', 'Brand/Ink'));
  add(head, await txt('Shared colour, type and effect styles plus the reusable components used across the landing page.', 'Body/Large', 'Neutral/Slate'));
  add(ds, head);

  // Colours
  const colSec = box('Colour Styles', 'VERTICAL', { gap: 20 });
  add(colSec, await txt('Colour styles', 'Heading/H3', 'Brand/Ink'));
  const sw = box('Swatches', 'HORIZONTAL', { gap: 20, wrap: true, rowGap: 24 });
  fixWidth(sw, 1272);
  for (const [name, hex] of COLORS) {
    const s = box(`Swatch / ${name}`, 'VERTICAL', { gap: 8 });
    const chip = await rect(190, 96, name, 16, 'Chip');
    await stroke(chip, 'Neutral/Line', 1);
    add(s, chip);
    add(s, await txt(name, 'Label/Nav', 'Brand/Ink'));
    add(s, await txt(hex, 'Body/Small', 'Neutral/Slate'));
    add(sw, s);
  }
  add(colSec, sw);
  add(ds, colSec);

  // Typography
  const typeSec = box('Text Styles', 'VERTICAL', { gap: 18 });
  add(typeSec, await txt('Text styles', 'Heading/H3', 'Brand/Ink'));
  for (const [name, , , size, lh] of TYPE) {
    const row = box(`Type / ${name}`, 'HORIZONTAL', { gap: 32, cross: 'CENTER' });
    const meta = await txt(`${name}\n${S.t[name].fontName.family} ${S.t[name].fontName.style} · ${size}/${lh}`, 'Body/Small', 'Neutral/Slate');
    row.appendChild(meta);
    meta.resize(280, meta.height);
    meta.textAutoResize = 'HEIGHT';
    add(row, await txt(name.startsWith('Label/Overline') ? 'Section overline' : 'Study smarter, not longer', name, 'Brand/Ink'));
    add(typeSec, row);
  }
  add(ds, typeSec);

  // Effects
  const fxSec = box('Effect Styles', 'VERTICAL', { gap: 20 });
  add(fxSec, await txt('Effect styles', 'Heading/H3', 'Brand/Ink'));
  const fxRow = box('Effects', 'HORIZONTAL', { gap: 32, pad: [8, 8, 40, 8] });
  for (const [name] of EFFECTS) {
    const f = box(name, 'VERTICAL', { pad: 24, radius: 20, main: 'CENTER' });
    f.resize(240, 120);
    f.primaryAxisSizingMode = 'FIXED';
    f.counterAxisSizingMode = 'FIXED';
    await fill(f, 'Neutral/White');
    await shadow(f, name);
    add(f, await txt(name, 'Label/Nav', 'Brand/Ink'));
    add(fxRow, f);
  }
  add(fxSec, fxRow);
  add(ds, fxSec);

  // Components
  const compSec = box('Components Section', 'VERTICAL', { gap: 24 });
  add(compSec, await txt('Components', 'Heading/H3', 'Brand/Ink'));
  add(compSec, componentsGrid);
  add(ds, compSec);
  return ds;
}

// ───────────────────────────── Main ─────────────────────────────

async function main() {
  figma.notify('Building Lumora landing page…', { timeout: 2500 });
  figma.currentPage.name = 'Lumora Landing Page';
  await createStyles();

  // Components are created inside a temporary host, then moved to the sheet.
  const host = figma.createFrame();
  host.name = 'tmp';
  const grid = await buildComponents(host);
  const ds = await buildStyleSheet(grid);
  host.remove();

  const desktop = await buildDesktop();
  const mobile = await buildMobile();

  ds.x = 0; ds.y = 0;
  desktop.x = ds.width + 200; desktop.y = 0;
  mobile.x = desktop.x + desktop.width + 160; mobile.y = 0;

  figma.currentPage.selection = [desktop, mobile];
  figma.viewport.scrollAndZoomIntoView([ds, desktop, mobile]);
  figma.closePlugin('✅ Lumora landing page created: styles, components, desktop + mobile frames.');
}

main().catch((err) => {
  console.error(err);
  figma.closePlugin('❌ Something went wrong: ' + (err && err.message ? err.message : err));
});

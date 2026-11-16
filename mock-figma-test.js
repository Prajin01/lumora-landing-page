// Smoke test: runs figma-plugin/code.js against a strict mock of the Figma Plugin API.
// Catches typos, wrong call order (fonts not loaded, FILL outside Auto Layout,
// unknown component properties) before running the plugin in Figma.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let idSeq = 0;
const loaded = new Set();
const fk = (f) => `${f.family}|${f.style}`;
const errors = [];
const nodes = [];
const AVAILABLE = ['Regular', 'Medium', 'Semi Bold', 'Bold'].map((s) => ({ fontName: { family: 'Inter', style: s } }))
  .concat(['Regular', 'Medium', 'SemiBold', 'Bold'].map((s) => ({ fontName: { family: 'Space Grotesk', style: s } })));

function assert(c, msg) { if (!c) { const e = new Error(msg); errors.push(e); throw e; } }

function makeNode(type, extra) {
  const n = {
    id: `${++idSeq}:0`, type, name: type, children: [], parent: null, x: 0, y: 0, width: 100, height: 100,
    layoutMode: 'NONE', fills: [], strokes: [], effects: [],
    appendChild(c) {
      assert(c && c.id, 'appendChild: bad child');
      if (c.parent) c.parent.children = c.parent.children.filter((k) => k !== c);
      c.parent = this; this.children.push(c);
    },
    resize(w, h) { assert(w > 0 && h > 0, `resize ${this.name}: ${w}x${h}`); this.width = w; this.height = h; },
    rescale(s) { assert(s > 0, 'rescale'); this.width *= s; this.height *= s; },
    remove() { if (this.parent) this.parent.children = this.parent.children.filter((k) => k !== this); this.removed = true; },
    findOne(fn) { for (const c of this.children) { if (fn(c)) return c; const r = c.findOne && c.findOne(fn); if (r) return r; } return null; },
    async setFillStyleIdAsync(id) { assert(styles.has(id), 'fill style id'); this.fillStyleId = id; },
    async setStrokeStyleIdAsync(id) { assert(styles.has(id), 'stroke style id'); this.strokeStyleId = id; },
    async setEffectStyleIdAsync(id) { assert(styles.has(id), 'effect style id'); this.effectStyleId = id; },
  };
  let lsh = 'FIXED', lsv = 'FIXED';
  Object.defineProperty(n, 'layoutSizingHorizontal', {
    get: () => lsh,
    set(v) { checkSizing(n, v); lsh = v; },
  });
  Object.defineProperty(n, 'layoutSizingVertical', {
    get: () => lsv,
    set(v) { checkSizing(n, v); lsv = v; },
  });
  Object.assign(n, extra || {});
  if (figmaObj && figmaObj.currentPage && type !== 'PAGE') figmaObj.currentPage.appendChild(n);
  nodes.push(n);
  return n;
}
function checkSizing(n, v) {
  assert(['FIXED', 'HUG', 'FILL'].includes(v), `bad sizing ${v}`);
  if (v === 'FILL') assert(n.parent && n.parent.layoutMode && n.parent.layoutMode !== 'NONE', `FILL on "${n.name}" whose parent "${n.parent && n.parent.name}" has no Auto Layout`);
  if (v === 'HUG') assert(n.type === 'TEXT' || (n.layoutMode && n.layoutMode !== 'NONE'), `HUG on non-autolayout ${n.name}`);
}

const styles = new Map();
function makeStyle(type) {
  const s = { id: `S:${++idSeq}`, type, name: '' };
  if (type === 'TEXT') {
    let fn;
    Object.defineProperty(s, 'fontName', { get: () => fn, set(v) { assert(loaded.has(fk(v)), `text style font not loaded ${fk(v)}`); fn = v; } });
  }
  styles.set(s.id, s);
  return s;
}

function textNode() {
  const n = makeNode('TEXT', { fontName: { family: 'Inter', style: 'Regular' }, textAutoResize: 'WIDTH_AND_HEIGHT' });
  let chars = '';
  Object.defineProperty(n, 'characters', {
    get: () => chars,
    set(v) { assert(loaded.has(fk(n.fontName)), `characters set before font loaded: ${fk(n.fontName)}`); chars = v; n.width = v.length * 8; },
  });
  n.setTextStyleIdAsync = async (id) => { assert(styles.has(id), 'text style id'); n.fontName = styles.get(id).fontName; n.textStyleId = id; };
  n.setRangeFillStyleIdAsync = async (a, b, id) => { assert(styles.has(id) && a >= 0 && b <= chars.length && a < b, `range fill ${a}-${b}/${chars.length}`); };
  return n;
}

function componentNode() {
  const c = makeNode('COMPONENT');
  c.props = {};
  c.addComponentProperty = function (name, type, def) {
    if (type === 'INSTANCE_SWAP') assert(nodes.some((x) => x.id === def && x.type === 'COMPONENT'), 'swap default must be component id');
    const key = `${name}#${idSeq}:0`; this.props[key] = type; return key;
  };
  c.createInstance = function () {
    const main = this;
    const inst = makeNode('INSTANCE', { mainComponent: main });
    inst.children = cloneKids(main.children, inst);
    inst.setProperties = (o) => {
      const defs = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent.props : main.props;
      for (const k of Object.keys(o)) assert(defs[k], `unknown component property ${k} on ${main.name}`);
    };
    return inst;
  };
  return c;
}
function cloneKids(kids, parent) {
  return kids.map((k) => {
    const c = Object.assign(Object.create(Object.getPrototypeOf(k)), k);
    c.parent = parent; c.children = cloneKids(k.children || [], c);
    c.findOne = k.findOne; c.setFillStyleIdAsync = k.setFillStyleIdAsync;
    return c;
  });
}

let figmaObj = null;
const page = makeNode('PAGE');
page.selection = [];
figmaObj = {
  currentPage: page,
  notify: () => {},
  closePlugin: (m) => { console.log('closePlugin:', m); figmaObj.closed = m; },
  listAvailableFontsAsync: async () => AVAILABLE,
  loadFontAsync: async (f) => { assert(AVAILABLE.some((a) => fk(a.fontName) === fk(f)), `font not available ${fk(f)}`); loaded.add(fk(f)); },
  getLocalPaintStylesAsync: async () => [],
  getLocalTextStylesAsync: async () => [],
  getLocalEffectStylesAsync: async () => [],
  createPaintStyle: () => makeStyle('PAINT'),
  createTextStyle: () => makeStyle('TEXT'),
  createEffectStyle: () => makeStyle('EFFECT'),
  createFrame: () => makeNode('FRAME'),
  createRectangle: () => makeNode('RECTANGLE'),
  createEllipse: () => makeNode('ELLIPSE'),
  createText: textNode,
  createComponent: componentNode,
  createNodeFromSvg: (s) => { assert(/^<svg[\s\S]*<\/svg>$/.test(s), 'bad svg'); return makeNode('FRAME'); },
  combineAsVariants: (comps, parent) => {
    assert(comps.every((c) => c.type === 'COMPONENT'), 'combine non-components');
    const set = makeNode('COMPONENT_SET');
    set.props = {};
    set.addComponentProperty = (name) => { const k = `${name}#${idSeq}:0`; set.props[k] = 'TEXT'; return k; };
    parent.appendChild(set);
    comps.forEach((c) => set.appendChild(c));
    return set;
  },
  viewport: { scrollAndZoomIntoView: () => {} },
};

const code = fs.readFileSync(path.join(__dirname, '../figma-plugin/code.js'), 'utf8');
vm.runInNewContext(code, { figma: figmaObj, console, setTimeout });
setTimeout(() => {
  const count = (t) => nodes.filter((n) => n.type === t && !n.removed).length;
  console.log(`styles: ${styles.size}, components: ${count('COMPONENT')}, instances: ${count('INSTANCE')}, frames: ${count('FRAME')}, texts: ${count('TEXT')}`);
  if (errors.length || !figmaObj.closed || figmaObj.closed.startsWith('❌')) { console.error('FAILED', errors.map((e) => e.message)); process.exit(1); }
  console.log('PASS');
}, 500);

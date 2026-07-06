/*
  Mint Duck Race Arena - Circuit Edition
  Ghi chu: comment trong code dung tieng Viet khong dau de anh de sua sau nay.
*/

'use strict';

const GAME_CONFIG = {
  minPlayers: 2,
  maxPlayers: 12,
  defaultDuration: 30,
  minDuration: 15,
  maxDuration: 90,
  eventMinGap: 2.7,
  eventMaxGap: 4.6,
  commentMinVisibleMs: 2200,
  bubbleMinTime: 1.9,
  visualMinTime: 2.1,
  racerEventCooldown: 4.0,
  tieRate: 0.15,
  maxTieWinners: 2,
  endAfterFirstFinish: true,
  jumpProgressMin: 0.12,
  jumpProgressMax: 0.82,
  jumpTriggerWindow: 0.005,
  jumpMinGain: 0.014,
  jumpMaxGain: 0.052,
  trailLife: 0.55,
  trackBoxPadding: 24,
  runCycleFrames: 8,
  jumpVisualDuration: 0.48,
  jumpArcMinPx: 14,
  jumpArcMaxPx: 28
};

const SAMPLE_NAMES = {
  3: ['Khải', 'Lan', 'Tùng'],
  5: ['Khải', 'Lan', 'Tùng', 'Minh', 'Vy'],
  8: ['Khải', 'Lan', 'Tùng', 'Minh', 'Vy', 'Huy', 'An', 'Bình']
};

const CHARACTER_DATA = Array.from({ length: 16 }, (_, i) => {
  const id = `nv${String(i + 1).padStart(2, '0')}`;
  return {
    id,
    label: `NV ${String(i + 1).padStart(2, '0')}`,
    thumb: `assets/animals/${id}/thumb.png`,
    frames: [1, 2, 3, 4].map((frame) => `assets/animals/${id}/frame${frame}.png`)
  };
});


const DUCK_PALETTES = [
  { body: '#FFD84A', wing: '#F2BC18', beak: '#F28C1B', band: '#EF4444', outline: '#8C4E11' },
  { body: '#FFF8E7', wing: '#E5DED1', beak: '#F49B22', band: '#14B8A6', outline: '#6E6255' },
  { body: '#B8793C', wing: '#8B5A2B', beak: '#E0892D', band: '#60A5FA', outline: '#5F3D1E' },
  { body: '#7FD14A', wing: '#56A82D', beak: '#ED9A23', band: '#FACC15', outline: '#35631E' },
  { body: '#69A8FF', wing: '#4388EA', beak: '#F59D28', band: '#1D4ED8', outline: '#214A7A' },
  { body: '#FFA4D1', wing: '#F176B5', beak: '#F78F24', band: '#FB7185', outline: '#8A3A66' },
  { body: '#393E46', wing: '#1E2127', beak: '#F4A124', band: '#A855F7', outline: '#111317' },
  { body: '#FFAA45', wing: '#F2821D', beak: '#D96B10', band: '#F97316', outline: '#8A420C' },
  { body: '#D7C3A0', wing: '#B69569', beak: '#F4971C', band: '#22C55E', outline: '#6E5535' },
  { body: '#A6F3D0', wing: '#72D8B2', beak: '#F2A028', band: '#0EA5E9', outline: '#317461' },
  { body: '#FDE68A', wing: '#F5CF58', beak: '#E88D14', band: '#DC2626', outline: '#8A6311' },
  { body: '#C4B5FD', wing: '#A78BFA', beak: '#F49D27', band: '#7C3AED', outline: '#5B46A0' },
  { body: '#F9A8D4', wing: '#EC4899', beak: '#F39A21', band: '#BE185D', outline: '#84385C' },
  { body: '#86EFAC', wing: '#4ADE80', beak: '#F59E0B', band: '#16A34A', outline: '#3A7A4F' },
  { body: '#D1D5DB', wing: '#9CA3AF', beak: '#F59E0B', band: '#334155', outline: '#56606D' },
  { body: '#FDBA74', wing: '#FB923C', beak: '#EA7B16', band: '#0F766E', outline: '#93511F' }
];

const MAP_DATA = [
  {
    id: 'mint-corkscrew',
    name: 'Mint Corkscrew',
    description: 'Nhiều cua gắt, nhìn giống map drift mini. Dễ có kịch tính ở giữa chặng.',
    bgA: '#CAEBD8',
    bgB: '#E6FFF6',
    accent: '#8BCBAE',
    points: [[0.10,0.62],[0.15,0.33],[0.31,0.22],[0.51,0.30],[0.68,0.18],[0.86,0.31],[0.79,0.50],[0.62,0.57],[0.68,0.77],[0.86,0.83],[0.58,0.86],[0.38,0.70],[0.23,0.82],[0.10,0.72]]
  },
  {
    id: 'grand-s-bay',
    name: 'Grand S Bay',
    description: 'Dáng chữ S mềm, đoạn cuối quét rộng nên dễ xuất hiện bứt tốc.',
    bgA: '#D7F4E3',
    bgB: '#F3FFFA',
    accent: '#7FCDB3',
    points: [[0.12,0.74],[0.18,0.50],[0.30,0.25],[0.50,0.22],[0.66,0.38],[0.81,0.27],[0.88,0.42],[0.76,0.58],[0.60,0.63],[0.50,0.52],[0.34,0.60],[0.22,0.84]]
  },
  {
    id: 'twin-hairpin',
    name: 'Twin Hairpin',
    description: 'Hai hairpin liên tiếp, block và bump thường vui hơn ở map này.',
    bgA: '#D4F2DF',
    bgB: '#ECFFF6',
    accent: '#9ED0AF',
    points: [[0.15,0.77],[0.14,0.36],[0.30,0.18],[0.48,0.24],[0.52,0.46],[0.39,0.62],[0.33,0.80],[0.55,0.85],[0.82,0.70],[0.86,0.42],[0.72,0.19],[0.57,0.28],[0.63,0.58],[0.80,0.86]]
  },
  {
    id: 'island-serpent',
    name: 'Island Serpent',
    description: 'Map vòng quanh hồ cỏ, nhiều đoạn lượn như rắn nên nhìn sinh động.',
    bgA: '#D7F7E5',
    bgB: '#F3FFFA',
    accent: '#74C09D',
    points: [[0.08,0.66],[0.17,0.42],[0.33,0.32],[0.50,0.40],[0.65,0.24],[0.81,0.32],[0.91,0.52],[0.80,0.68],[0.62,0.73],[0.49,0.62],[0.36,0.78],[0.19,0.84],[0.09,0.78]]
  },
  {
    id: 'switchback-park',
    name: 'Switchback Park',
    description: 'Đường đổi hướng liên tục, cảm giác như track sân tập mô hình.',
    bgA: '#D4EFD7',
    bgB: '#F2FFF8',
    accent: '#8CD1B7',
    points: [[0.11,0.73],[0.21,0.25],[0.39,0.18],[0.48,0.38],[0.35,0.58],[0.48,0.72],[0.68,0.62],[0.82,0.29],[0.89,0.52],[0.79,0.82],[0.57,0.83],[0.43,0.64],[0.23,0.84]]
  },
  {
    id: 'lotus-loop',
    name: 'Lotus Loop',
    description: 'Nhìn mềm và tròn hơn, phù hợp khi anh muốn một map đẹp, dễ nhìn.',
    bgA: '#DDF9EA',
    bgB: '#F4FFFB',
    accent: '#9AD6BE',
    points: [[0.10,0.58],[0.16,0.30],[0.34,0.18],[0.56,0.20],[0.76,0.28],[0.88,0.48],[0.82,0.72],[0.64,0.82],[0.48,0.68],[0.34,0.80],[0.18,0.74]]
  },
  {
    id: 'harbor-ribbon',
    name: 'Harbor Ribbon',
    description: 'Một dải đường kéo dài, đoạn thẳng vừa phải để slipstream phát huy tác dụng.',
    bgA: '#D4F1DE',
    bgB: '#EEFFF7',
    accent: '#84C7AD',
    points: [[0.12,0.76],[0.10,0.52],[0.21,0.28],[0.45,0.22],[0.67,0.34],[0.88,0.24],[0.90,0.46],[0.76,0.58],[0.57,0.56],[0.48,0.74],[0.68,0.84],[0.87,0.76],[0.64,0.89],[0.34,0.84],[0.18,0.86]]
  },
  {
    id: 'dragon-ess',
    name: 'Dragon ESS',
    description: 'Đoạn giữa lượn mạnh kiểu ESS, rất hợp với các bùa gió và lốc.',
    bgA: '#D6F5DF',
    bgB: '#F2FFFA',
    accent: '#8CCAA6',
    points: [[0.12,0.68],[0.18,0.36],[0.33,0.22],[0.46,0.32],[0.56,0.52],[0.69,0.42],[0.83,0.24],[0.90,0.38],[0.83,0.58],[0.70,0.72],[0.53,0.63],[0.35,0.74],[0.21,0.86]]
  },
  {
    id: 'canyon-sprint',
    name: 'Canyon Sprint',
    description: 'Có một đoạn thoáng và một đoạn ép cua gắt nên nhịp đua lên xuống rất vui.',
    bgA: '#D5F0DB',
    bgB: '#F1FFF8',
    accent: '#7BB997',
    points: [[0.12,0.78],[0.10,0.48],[0.21,0.22],[0.41,0.18],[0.66,0.20],[0.85,0.32],[0.89,0.55],[0.78,0.78],[0.56,0.84],[0.37,0.68],[0.26,0.52],[0.18,0.72]]
  },
  {
    id: 'marina-zigzag',
    name: 'Marina Zigzag',
    description: 'Map dích dắc rõ rệt, nhìn khác hẳn oval nên bớt đơn điệu.',
    bgA: '#D7F7E7',
    bgB: '#F4FFFA',
    accent: '#8FD6B7',
    points: [[0.11,0.66],[0.18,0.28],[0.34,0.22],[0.44,0.42],[0.31,0.55],[0.44,0.69],[0.63,0.63],[0.83,0.26],[0.90,0.50],[0.80,0.78],[0.60,0.84],[0.51,0.70],[0.39,0.84],[0.20,0.82]]
  }
];

const EVENT_COMMENTS = {
  headwind: '{name} gặp gió ngược, tốc độ giảm thấy rõ!',
  tailwind: '{name} gặp gió xuôi, nhịp chạy đang nhẹ hơn!',
  stumble: '{name} vấp phải đá và khựng lại một nhịp!',
  slideTurn: '{name} gặp lốc xoáy ở cua, bị lệch nhịp chạy!',
  block: '{name} bị chắn đường vì nhóm phía trước quá sát!',
  bump: '{name} va chạm nhẹ, tốc độ bị hụt một chút!',
  jumpSuccess: '{name} bật qua bệ nhảy và bay xa thêm một đoạn!',
  jumpFail: '{name} đạp bệ nhảy lỗi nhịp, bị chậm lại!',
  slipstream: '{name} đang đu bám người phía trước để lấy đà!',
  finalSprint: '{name} đang bứt tốc ở những giây cuối!'
};

const EVENT_BUBBLES = {
  headwind: 'Gió ngược!',
  tailwind: 'Gió xuôi!',
  stumble: 'Vấp đá!',
  slideTurn: 'Lốc xoáy!',
  block: 'Bị chắn!',
  bump: 'Va chạm!',
  jumpSuccess: 'Bật nhảy!',
  jumpFail: 'Lỗi nhịp!',
  slipstream: 'Đu bám!',
  finalSprint: 'Bứt tốc!'
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const round1 = (value) => Math.round(value * 10) / 10;
const lerp = (a, b, t) => a + (b - a) * t;

function normalizeAngle(angle) {
  let a = Number.isFinite(angle) ? angle : 0;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function lerpAngle(from, to, t) {
  const start = Number.isFinite(from) ? from : to;
  const end = Number.isFinite(to) ? to : 0;
  return start + normalizeAngle(end - start) * clamp(t, 0, 1);
}

function easeOutCubic(t) {
  const x = clamp(Number.isFinite(t) ? t : 0, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

function formatComment(type, racer) {
  return EVENT_COMMENTS[type].replace('{name}', racer.name);
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function parseNames(raw) {
  const names = raw
    .split('\n')
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, GAME_CONFIG.maxPlayers);
  return Array.from(new Set(names));
}

function weightedPick(weightedItems) {
  const valid = weightedItems.filter((item) => item && item.weight > 0 && item.value);
  const total = valid.reduce((sum, item) => sum + item.weight, 0);
  if (!valid.length || total <= 0) return null;
  let cursor = Math.random() * total;
  for (const item of valid) {
    cursor -= item.weight;
    if (cursor <= 0) return item.value;
  }
  return valid[valid.length - 1].value;
}

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
  };
}

function buildClosedSpline(points, stepsPerSegment = 32) {
  const out = [];
  for (let i = 0; i < points.length; i += 1) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    for (let step = 0; step < stepsPerSegment; step += 1) {
      const t = step / stepsPerSegment;
      out.push(catmullRom(p0, p1, p2, p3, t));
    }
  }
  return out;
}

function buildTrackGeometry(width, height, laneCount, map) {
  const pad = GAME_CONFIG.trackBoxPadding;
  const boxW = width - pad * 2;
  const boxH = height - pad * 2;
  const pathPoints = map.points.map(([px, py]) => ({ x: pad + px * boxW, y: pad + py * boxH }));
  const samples = buildClosedSpline(pathPoints, 34);

  let totalLength = 0;
  const enriched = samples.map((point, index) => {
    const prev = samples[(index - 1 + samples.length) % samples.length];
    const next = samples[(index + 1) % samples.length];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    const nx = -ty;
    const ny = tx;
    return { ...point, tx, ty, nx, ny, dist: 0 };
  });

  for (let i = 1; i < enriched.length; i += 1) {
    totalLength += Math.hypot(enriched[i].x - enriched[i - 1].x, enriched[i].y - enriched[i - 1].y);
    enriched[i].dist = totalLength;
  }
  totalLength += Math.hypot(enriched[0].x - enriched[enriched.length - 1].x, enriched[0].y - enriched[enriched.length - 1].y);

  const trackWidth = clamp(150 - laneCount * 4.2, 92, 140);
  const laneWidth = trackWidth / laneCount;

  return {
    samples: enriched,
    totalLength,
    trackWidth,
    laneWidth,
    lanes: laneCount,
    startProgress: 0,
    laneLabelProgress: 0.01
  };
}

function sampleTrack(track, progress) {
  const p = ((progress % 1) + 1) % 1;
  const target = p * track.totalLength;
  const lastIndex = track.samples.length - 1;
  const lastSample = track.samples[lastIndex];

  if (target >= lastSample.dist) {
    const first = track.samples[0];
    const span = Math.max(1e-6, track.totalLength - lastSample.dist);
    const t = clamp((target - lastSample.dist) / span, 0, 1);
    return {
      x: lerp(lastSample.x, first.x, t),
      y: lerp(lastSample.y, first.y, t),
      tx: lerp(lastSample.tx, first.tx, t),
      ty: lerp(lastSample.ty, first.ty, t),
      nx: lerp(lastSample.nx, first.nx, t),
      ny: lerp(lastSample.ny, first.ny, t)
    };
  }

  let left = 0;
  let right = lastIndex;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (track.samples[mid].dist < target) left = mid + 1;
    else right = mid;
  }
  const curr = track.samples[left];
  const prev = track.samples[(left - 1 + track.samples.length) % track.samples.length];
  const prevDist = left === 0 ? 0 : prev.dist;
  const span = Math.max(1e-6, curr.dist - prevDist);
  const t = clamp((target - prevDist) / span, 0, 1);
  return {
    x: lerp(prev.x, curr.x, t),
    y: lerp(prev.y, curr.y, t),
    tx: lerp(prev.tx, curr.tx, t),
    ty: lerp(prev.ty, curr.ty, t),
    nx: lerp(prev.nx, curr.nx, t),
    ny: lerp(prev.ny, curr.ny, t)
  };
}

function getLanePoint(track, laneIndex, progress, extraShift = 0) {
  const baseProgress = progress + extraShift;
  const base = sampleTrack(track, baseProgress);
  const laneT = (laneIndex + 0.5) / track.lanes;
  const offset = -track.trackWidth / 2 + laneT * track.trackWidth;
  const x = base.x + base.nx * offset;
  const y = base.y + base.ny * offset;
  const angle = Math.atan2(base.ty, base.tx);
  const back = sampleTrack(track, baseProgress - 0.003);
  const ahead = sampleTrack(track, baseProgress + 0.003);
  const turn = normalizeAngle(Math.atan2(ahead.ty, ahead.tx) - Math.atan2(back.ty, back.tx));
  return { x, y, angle, turn, nx: base.nx, ny: base.ny, tx: base.tx, ty: base.ty };
}

function traceOffsetPath(ctx, track, offset) {
  const first = track.samples[0];
  ctx.beginPath();
  ctx.moveTo(first.x + first.nx * offset, first.y + first.ny * offset);
  for (let i = 1; i < track.samples.length; i += 1) {
    const p = track.samples[i];
    ctx.lineTo(p.x + p.nx * offset, p.y + p.ny * offset);
  }
  ctx.closePath();
}

class RaceEngine {
  constructor({ names, duration, map, characters, onEvent, onFinish }) {
    this.duration = duration;
    this.map = map;
    this.onEvent = onEvent;
    this.onFinish = onFinish;
    this.elapsed = 0;
    this.running = false;
    this.finished = false;
    this.nextEventAt = rand(GAME_CONFIG.eventMinGap, GAME_CONFIG.eventMaxGap);
    this.lastEventRacerId = null;
    this.visualEvents = [];
    this.tieMode = false;
    this.tieIds = [];
    this.racers = this.createRacers(names, characters);
    this.assignFairFinishTimes();
    this.assignFairJumpPads();
  }

  createRacers(names, characters) {
    return names.map((name, index) => ({
      id: `racer-${index}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      index,
      lane: index,
      name,
      character: characters[index],
      stats: {
        baseSpeed: rand(0.90, 1.10),
        burst: rand(0.45, 1.00),
        stability: rand(0.45, 1.00),
        luck: rand(0.42, 1.00),
        courage: rand(0.38, 1.00)
      },
      progress: 0,
      targetFinishTime: this.duration,
      finishedAt: null,
      eventCooldownUntil: 0,
      eventCount: 0,
      hardPauseUntil: 0,
      effects: [],
      bubble: null,
      lastPosition: null,
      trail: [],
      laneOffset: rand(-0.002, 0.002),
      jumpPad: null,
      eventHistory: [],
      renderAngle: 0,
      bodyLean: 0,
      runCyclePhase: rand(0, GAME_CONFIG.runCycleFrames - 0.001),
      displayProgress: 0,
      displayLift: 0,
      jumpAnim: null
    }));
  }

  assignFairFinishTimes() {
    const ranked = this.racers
      .map((racer) => {
        const s = racer.stats;
        const score = s.baseSpeed * 0.38 + s.burst * 0.22 + s.stability * 0.15 + s.luck * 0.15 + s.courage * 0.10 + rand(-0.075, 0.075);
        return { racer, score };
      })
      .sort((a, b) => b.score - a.score);

    this.tieMode = this.racers.length >= 3 && Math.random() < GAME_CONFIG.tieRate;
    const winnerTime = this.duration * rand(0.88, 0.96);

    ranked.forEach((entry, rankIndex) => {
      const spread = rankIndex === 0 ? 0 : rand(0.024, 0.068) * rankIndex;
      const skillAdjust = clamp((ranked[0].score - entry.score) * 0.10, 0, 0.14);
      const naturalNoise = rand(0, 0.035);
      const raw = winnerTime + this.duration * (spread + skillAdjust + naturalNoise);
      entry.racer.targetFinishTime = clamp(raw, winnerTime, this.duration * 1.45);
    });

    if (this.tieMode && ranked[1]) {
      const tieTime = winnerTime;
      ranked[0].racer.targetFinishTime = tieTime;
      ranked[1].racer.targetFinishTime = tieTime + rand(-0.035, 0.035);
      this.tieIds = [ranked[0].racer.id, ranked[1].racer.id];
    }
  }

  assignFairJumpPads() {
    const count = this.racers.length;
    const slots = shuffle(this.racers.map((_, index) => index));
    this.racers.forEach((racer, order) => {
      const base = GAME_CONFIG.jumpProgressMin + ((slots[order] + 0.5) / count) * (GAME_CONFIG.jumpProgressMax - GAME_CONFIG.jumpProgressMin);
      const jitter = rand(-0.03, 0.03);
      racer.jumpPad = {
        progress: clamp(base + jitter, GAME_CONFIG.jumpProgressMin, GAME_CONFIG.jumpProgressMax),
        used: false,
        activeUntil: 0,
        result: 'ready'
      };
    });
  }

  start() { this.running = true; this.finished = false; }
  stop() { this.running = false; }
  getRaceFactor() { return clamp(this.elapsed / this.duration, 0, 1.4); }

  getRanking() {
    return this.racers.slice().sort((a, b) => {
      if (a.finishedAt !== null && b.finishedAt !== null) return a.finishedAt - b.finishedAt;
      if (a.finishedAt !== null) return -1;
      if (b.finishedAt !== null) return 1;
      return b.progress - a.progress;
    });
  }

  update(dt) {
    if (!this.running || this.finished) return;
    this.elapsed += dt;
    this.visualEvents = this.visualEvents.filter((event) => event.until > this.elapsed);
    this.updateRacers(dt);
    this.checkJumpPadCollisions();
    this.handleScheduledEvent();
    this.checkFinish();
    this.updateVisualState(dt);
  }

  updateVisualState(dt) {
    for (const racer of this.racers) {
      if (!Number.isFinite(racer.displayProgress)) racer.displayProgress = racer.progress;
      const paused = racer.hardPauseUntil > this.elapsed;
      const sprinting = racer.effects.some((effect) => ['finalSprint', 'tailwind', 'jumpSuccess', 'slipstream'].includes(effect.type) && effect.until > this.elapsed);
      const fps = paused ? 0 : (sprinting ? 10 : 7.2);
      racer.runCyclePhase = ((Number.isFinite(racer.runCyclePhase) ? racer.runCyclePhase : 0) + dt * fps) % GAME_CONFIG.runCycleFrames;

      if (racer.jumpAnim) {
        const anim = racer.jumpAnim;
        const t = clamp((this.elapsed - anim.start) / (anim.end - anim.start), 0, 1);
        racer.displayProgress = anim.from + (anim.to - anim.from) * easeOutCubic(t);
        racer.displayLift = Math.sin(t * Math.PI) * anim.arcHeight;
        if (t >= 1) {
          racer.displayProgress = anim.to;
          racer.displayLift = 0;
          racer.jumpAnim = null;
        }
      } else {
        racer.displayProgress = lerp(racer.displayProgress, racer.progress, racer.finishedAt !== null ? 0.34 : 0.24);
        racer.displayLift = lerp(racer.displayLift || 0, 0, 0.28);
      }
    }
  }

  updateRacers(dt) {
    const ranking = this.getRanking();
    const leaderProgress = ranking[0]?.progress || 0;
    const raceFactor = this.getRaceFactor();

    for (const racer of this.racers) {
      if (racer.finishedAt !== null) continue;
      racer.effects = racer.effects.filter((effect) => effect.until > this.elapsed);
      if (racer.hardPauseUntil > this.elapsed) continue;

      const effectMult = racer.effects.reduce((mult, effect) => mult * effect.multiplier, 1);
      const gapFromLeader = Math.max(0, leaderProgress - racer.progress);
      const isLeader = ranking[0]?.id === racer.id;
      let rubber = 1;
      if (!isLeader && gapFromLeader > 0.09 && raceFactor < 0.82) rubber += clamp(gapFromLeader * 0.24, 0, 0.07);
      if (isLeader && leaderProgress > 0.23 && raceFactor < 0.7) rubber -= 0.018;

      const finalPush = raceFactor > 0.8 ? 1 + racer.stats.burst * 0.03 : 1;
      const idealProgress = this.elapsed / racer.targetFinishTime;
      const pacingDiff = idealProgress - racer.progress;
      const pacingCorrection = clamp(pacingDiff * 0.46, -0.020, 0.034);
      const baseRate = 1 / racer.targetFinishTime;
      const variation = 1 + Math.sin((this.elapsed * 1.55) + racer.index * 0.9) * 0.01 + rand(-0.005, 0.005);

      let delta = dt * baseRate * racer.stats.baseSpeed * effectMult * rubber * finalPush * variation;
      delta += dt * pacingCorrection;
      const softCapBeforeFinish = this.elapsed < racer.targetFinishTime ? 0.996 : 1.03;
      racer.progress = clamp(racer.progress + delta, 0, softCapBeforeFinish);

      if (this.elapsed >= racer.targetFinishTime && racer.progress < 1) {
        racer.progress = Math.min(1, racer.progress + dt * 0.72);
      }
    }
  }

  checkJumpPadCollisions() {
    for (const racer of this.racers) {
      const pad = racer.jumpPad;
      if (!pad || pad.used || racer.finishedAt !== null) continue;
      const crossed = racer.progress >= pad.progress - GAME_CONFIG.jumpTriggerWindow;
      if (!crossed) continue;

      pad.used = true;
      pad.activeUntil = this.elapsed + GAME_CONFIG.visualMinTime;
      const successChance = clamp(0.45 + racer.stats.courage * 0.18 + racer.stats.luck * 0.24 + racer.stats.stability * 0.13, 0.38, 0.88);
      const success = Math.random() < successChance;
      const jumpPower = clamp(GAME_CONFIG.jumpMinGain + (racer.stats.burst * 0.020 + racer.stats.courage * 0.014 + racer.stats.luck * 0.010), GAME_CONFIG.jumpMinGain, GAME_CONFIG.jumpMaxGain);

      if (success) {
        pad.result = 'success';
        const fromProgress = Number.isFinite(racer.displayProgress) ? racer.displayProgress : racer.progress;
        const toProgress = Math.min(0.996, racer.progress + jumpPower);
        racer.progress = toProgress;
        racer.jumpAnim = {
          from: fromProgress,
          to: toProgress,
          start: this.elapsed,
          end: this.elapsed + GAME_CONFIG.jumpVisualDuration,
          arcHeight: clamp(14 + jumpPower * 420, GAME_CONFIG.jumpArcMinPx, GAME_CONFIG.jumpArcMaxPx)
        };
        this.addEffect(racer, 'jumpSuccess', 1.04 + racer.stats.burst * 0.05, 1.35);
        this.applyEvent('jumpSuccess', racer, { ignoreCooldown: true, noExtraEffect: true });
      } else {
        pad.result = 'fail';
        racer.hardPauseUntil = Math.max(racer.hardPauseUntil, this.elapsed + 0.55);
        racer.displayLift = Math.max(racer.displayLift || 0, 6);
        this.addEffect(racer, 'jumpFail', 0.72, 1.45);
        this.applyEvent('jumpFail', racer, { ignoreCooldown: true, noExtraEffect: true });
      }
    }
  }

  handleScheduledEvent() {
    if (this.elapsed < this.nextEventAt) return;
    if (this.elapsed > this.duration + 2) return;
    const event = this.pickEvent();
    if (event) this.applyEvent(event.type, event.racer, event.extra);
    this.nextEventAt = this.elapsed + rand(GAME_CONFIG.eventMinGap, GAME_CONFIG.eventMaxGap);
  }

  fairnessWeight(racer) {
    return 1 / (1 + racer.eventCount * 0.38);
  }

  pickEvent() {
    const raceFactor = this.getRaceFactor();
    const active = this.racers.filter((r) => r.finishedAt === null && r.eventCooldownUntil <= this.elapsed);
    if (!active.length) return null;

    const fairActive = active.filter((r) => r.id !== this.lastEventRacerId);
    const pool = fairActive.length ? fairActive : active;
    const closePair = this.findClosePair(pool);
    const slipstreamTarget = this.findSlipstreamTarget(pool);
    const curveTarget = this.findCurveCandidate(pool);

    const choices = [];
    choices.push({ value: { type: 'headwind', racer: this.pickVulnerableRacer(pool) }, weight: 0.8 });
    choices.push({ value: { type: 'tailwind', racer: this.pickGoodEventRacer(pool) }, weight: 0.95 });
    choices.push({ value: { type: 'stumble', racer: this.pickStumbleRacer(pool) }, weight: 0.72 });
    choices.push({ value: { type: 'slideTurn', racer: curveTarget }, weight: curveTarget ? 0.64 : 0 });
    choices.push({ value: { type: 'block', racer: closePair?.behind, extra: closePair }, weight: closePair ? 0.72 : 0 });
    choices.push({ value: { type: 'bump', racer: closePair?.behind, extra: closePair }, weight: closePair ? 0.56 : 0 });
    choices.push({ value: { type: 'slipstream', racer: slipstreamTarget }, weight: slipstreamTarget ? 0.7 : 0 });
    choices.push({ value: { type: 'finalSprint', racer: this.pickFinalSprinter(pool) }, weight: raceFactor > 0.8 ? 1.95 : 0.05 });

    const picked = weightedPick(choices);
    if (!picked || !picked.racer) return null;
    return picked;
  }

  pickVulnerableRacer(active) {
    const ranking = this.getRanking();
    const items = active.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const badLuck = 1.1 - racer.stats.luck;
      const lowStable = 1.15 - racer.stats.stability;
      const leaderPressure = rankIndex <= 1 ? 0.18 : 0;
      return { value: racer, weight: (0.3 + badLuck * 0.48 + lowStable * 0.42 + leaderPressure) * this.fairnessWeight(racer) };
    });
    return weightedPick(items) || pick(active);
  }

  pickGoodEventRacer(active) {
    const ranking = this.getRanking();
    const leader = ranking[0];
    const items = active.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const trailingBoost = rankIndex >= Math.ceil(active.length / 2) ? 0.20 : 0;
      const leaderPenalty = racer.id === leader.id && this.getRaceFactor() < 0.78 ? -0.20 : 0;
      return { value: racer, weight: (0.25 + racer.stats.luck * 0.28 + racer.stats.burst * 0.22 + trailingBoost + leaderPenalty) * this.fairnessWeight(racer) };
    });
    return weightedPick(items) || pick(active);
  }

  pickStumbleRacer(active) {
    const items = active.map((racer) => ({
      value: racer,
      weight: (0.16 + (1 - racer.stats.stability) * 1.2 + (1 - racer.stats.luck) * 0.28) * this.fairnessWeight(racer)
    }));
    return weightedPick(items) || pick(active);
  }

  pickFinalSprinter(active) {
    const ranking = this.getRanking();
    const items = active.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const canFlip = rankIndex >= 1 && rankIndex <= 4 ? 0.24 : 0;
      return { value: racer, weight: (0.25 + racer.stats.burst * 0.78 + racer.stats.luck * 0.22 + canFlip) * this.fairnessWeight(racer) };
    });
    return weightedPick(items) || pick(active);
  }

  findClosePair(pool = this.racers) {
    const ids = new Set(pool.map((r) => r.id));
    const active = this.racers.filter((r) => r.finishedAt === null);
    let best = null;
    for (const behind of active) {
      if (!ids.has(behind.id)) continue;
      for (const front of active) {
        if (behind.id === front.id) continue;
        const gap = front.progress - behind.progress;
        const laneGap = Math.abs(front.lane - behind.lane);
        if (gap > 0 && gap < 0.022 && laneGap <= 2) {
          const score = (0.022 - gap) + (2 - laneGap) * 0.002;
          if (!best || score > best.score) best = { behind, front, score };
        }
      }
    }
    return best;
  }

  findSlipstreamTarget(pool = this.racers) {
    const pair = this.findClosePair(pool);
    if (!pair) return null;
    if (Math.random() < 0.20 + pair.behind.stats.luck * 0.28) return pair.behind;
    return null;
  }

  findCurveCandidate(pool = this.racers) {
    const inCurve = pool.filter((r) => r.finishedAt === null && this.isInCurve(r.progress));
    if (!inCurve.length) return null;
    const items = inCurve.map((racer) => ({ value: racer, weight: (0.15 + (1 - racer.stats.stability) * 0.85 + (1 - racer.stats.luck) * 0.20) * this.fairnessWeight(racer) }));
    return weightedPick(items);
  }

  isInCurve(progress) {
    const p = progress % 1;
    return (p > 0.08 && p < 0.30) || (p > 0.42 && p < 0.62) || (p > 0.76 && p < 0.90);
  }

  applyEvent(type, racer, extra = null) {
    if (!racer || racer.finishedAt !== null) return;
    const ignoreCooldown = Boolean(extra?.ignoreCooldown);
    const noExtraEffect = Boolean(extra?.noExtraEffect);
    if (!ignoreCooldown && racer.eventCooldownUntil > this.elapsed) return;

    racer.eventCooldownUntil = this.elapsed + GAME_CONFIG.racerEventCooldown;
    racer.eventCount += 1;
    racer.eventHistory.push({ type, at: this.elapsed });
    this.lastEventRacerId = racer.id;

    if (!noExtraEffect) {
      switch (type) {
        case 'headwind':
          this.addEffect(racer, 'headwind', 0.78, 2.0);
          break;
        case 'tailwind':
          this.addEffect(racer, 'tailwind', 1.06 + racer.stats.luck * 0.025, 2.05);
          break;
        case 'stumble':
          racer.hardPauseUntil = Math.max(racer.hardPauseUntil, this.elapsed + 1.0);
          this.addEffect(racer, 'stumble', 0.62, 1.65);
          break;
        case 'slideTurn':
          this.addEffect(racer, 'slideTurn', 0.70 + racer.stats.stability * 0.12, 1.8);
          break;
        case 'block':
          this.addEffect(racer, 'block', 0.78, 1.7);
          if (extra?.front) this.addEffect(extra.front, 'pressure', 0.96, 1.1);
          break;
        case 'bump':
          this.addEffect(racer, 'bump', 0.84, 1.4);
          if (extra?.front) this.addEffect(extra.front, 'bump', 0.92, 1.2);
          break;
        case 'slipstream':
          this.addEffect(racer, 'slipstream', 1.08 + racer.stats.luck * 0.02, 1.7);
          break;
        case 'finalSprint':
          this.addEffect(racer, 'finalSprint', 1.10 + racer.stats.burst * 0.12, 2.3);
          break;
        default:
          break;
      }
    }

    this.showBubble(racer, type);
    this.createVisualEvent(type, racer);
    this.onEvent?.({ type, racer, comment: formatComment(type, racer) });
  }

  addEffect(racer, type, multiplier, duration) {
    racer.effects.push({ type, multiplier, until: this.elapsed + Math.max(GAME_CONFIG.bubbleMinTime, duration) });
  }

  showBubble(racer, type) {
    racer.bubble = { text: EVENT_BUBBLES[type] || type, type, until: this.elapsed + Math.max(GAME_CONFIG.bubbleMinTime, 2.0) };
  }

  createVisualEvent(type, racer) {
    let visualType = null;
    if (type === 'headwind') visualType = 'wind';
    if (type === 'tailwind') visualType = 'windBoost';
    if (type === 'slideTurn') visualType = 'tornado';
    if (type === 'stumble') visualType = 'rock';
    if (type === 'block' || type === 'bump') visualType = 'impact';
    if (type === 'jumpSuccess' || type === 'jumpFail') visualType = 'jumpBurst';
    if (type === 'finalSprint' || type === 'slipstream') visualType = 'speed';
    if (!visualType) return;

    this.visualEvents.push({
      type: visualType,
      lane: racer.lane,
      progress: racer.progress,
      racerId: racer.id,
      createdAt: this.elapsed,
      until: this.elapsed + GAME_CONFIG.visualMinTime,
      success: type === 'jumpSuccess',
      boost: type === 'tailwind'
    });
  }

  checkFinish() {
    const newlyFinished = [];
    for (const racer of this.racers) {
      if (racer.finishedAt === null && racer.progress >= 1) {
        racer.progress = 1;
        racer.finishedAt = this.elapsed;
        newlyFinished.push(racer);
      }
    }

    const hasWinner = newlyFinished.length > 0;
    const timeExpired = this.elapsed >= this.duration + 0.1;

    if (hasWinner && GAME_CONFIG.endAfterFirstFinish) {
      if (this.tieMode) {
        const tieRacers = this.racers.filter((r) => this.tieIds.includes(r.id));
        const waitingTie = tieRacers.some((r) => r.finishedAt === null && this.elapsed < r.targetFinishTime + 0.35);
        if (waitingTie) return;
      }
      this.finished = true;
      this.running = false;
      this.onFinish?.(this.getResults());
      return;
    }

    if (timeExpired) {
      const ranking = this.getRanking();
      if (ranking[0] && ranking[0].finishedAt === null) {
        ranking[0].progress = 1;
        ranking[0].finishedAt = this.elapsed;
      }
      this.finished = true;
      this.running = false;
      this.onFinish?.(this.getResults());
    }
  }

  getResults() {
    return this.getRanking().map((racer) => ({
      id: racer.id,
      name: racer.name,
      character: racer.character,
      progress: racer.progress,
      finishedAt: racer.finishedAt
    }));
  }
}

class GameApp {
  constructor() {
    this.dom = {
      playerNames: qs('#playerNames'),
      mapSelect: qs('#mapSelect'),
      durationRange: qs('#raceDuration'),
      durationNumber: qs('#durationNumber'),
      durationLabel: qs('#durationLabel'),
      startBtn: qs('#startBtn'),
      replayBtn: qs('#replayBtn'),
      randomMapBtn: qs('#randomMapBtn'),
      resetBtn: qs('#resetBtn'),
      timerText: qs('#timerText'),
      raceTitle: qs('#raceTitle'),
      raceMeta: qs('#raceMeta'),
      rankingList: qs('#rankingList'),
      ticker: qs('#commentaryTicker'),
      canvas: qs('#raceCanvas'),
      resultOverlay: qs('#resultOverlay'),
      podium: qs('#podium'),
      closeResultBtn: qs('#closeResultBtn'),
      playAgainBigBtn: qs('#playAgainBigBtn'),
      toggleCustomizerBtn: qs('#toggleCustomizerBtn'),
      characterCustomizer: qs('#characterCustomizer'),
      globalCharacterSelect: qs('#globalCharacterSelect'),
      applyAllCharactersBtn: qs('#applyAllCharactersBtn'),
      setAllAutoBtn: qs('#setAllAutoBtn'),
      playerCharacterRows: qs('#playerCharacterRows'),
      characterGallery: qs('#characterGallery')
    };

    this.ctx = this.dom.canvas.getContext('2d');
    this.engine = null;
    this.lastFrameTime = 0;
    this.animationId = 0;
    this.rankingSignature = '';
    this.commentQueue = [];
    this.lastCommentAt = 0;
    this.commentTimer = null;
    this.confetti = [];
    this.trackGeometry = null;
    this.playerSelections = [];
    this.imageCache = new Map();
    this.customizerOpen = false;

    this.init();
  }

  init() {
    this.populateMaps();
    this.populateGlobalCharacterSelect();
    this.populateCharacterGallery();
    this.bindEvents();
    this.preloadCharacterImages();
    this.syncDuration(GAME_CONFIG.defaultDuration);
    this.preparePreview();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animationId = requestAnimationFrame((time) => this.loop(time));
  }

  preloadCharacterImages() {
    CHARACTER_DATA.forEach((character) => {
      [character.thumb, ...character.frames].forEach((path) => {
        const img = new Image();
        img.src = path;
        this.imageCache.set(path, img);
      });
    });
  }

  populateMaps() {
    this.dom.mapSelect.innerHTML = MAP_DATA.map((map) => `<option value="${map.id}">${map.name}</option>`).join('');
  }

  populateGlobalCharacterSelect() {
    const options = ['<option value="auto">Tự động ngẫu nhiên</option>']
      .concat(CHARACTER_DATA.map((character) => `<option value="${character.id}">${character.label}</option>`));
    this.dom.globalCharacterSelect.innerHTML = options.join('');
  }

  populateCharacterGallery() {
    this.dom.characterGallery.innerHTML = CHARACTER_DATA.map((character) => `
      <div class="character-card">
        <img src="${character.thumb}" alt="${character.label}">
        <strong>${character.label}</strong>
        <span>${character.id.toUpperCase()}</span>
      </div>
    `).join('');
  }

  bindEvents() {
    qsa('[data-sample]').forEach((button) => {
      button.addEventListener('click', () => {
        const count = Number(button.dataset.sample);
        this.dom.playerNames.value = SAMPLE_NAMES[count].join('\n');
        this.preparePreview();
      });
    });

    this.dom.durationRange.addEventListener('input', () => this.syncDuration(Number(this.dom.durationRange.value)));
    this.dom.durationNumber.addEventListener('input', () => this.syncDuration(Number(this.dom.durationNumber.value)));
    this.dom.mapSelect.addEventListener('change', () => this.preparePreview());
    this.dom.playerNames.addEventListener('input', () => this.preparePreview());

    this.dom.startBtn.addEventListener('click', () => this.startRace());
    this.dom.replayBtn.addEventListener('click', () => this.startRace());
    this.dom.playAgainBigBtn.addEventListener('click', () => { this.hideResults(); this.startRace(); });
    this.dom.closeResultBtn.addEventListener('click', () => this.hideResults());
    this.dom.randomMapBtn.addEventListener('click', () => {
      const current = this.dom.mapSelect.value;
      const options = MAP_DATA.filter((map) => map.id !== current);
      this.dom.mapSelect.value = pick(options).id;
      this.preparePreview();
    });
    this.dom.resetBtn.addEventListener('click', () => {
      this.dom.playerNames.value = '';
      this.playerSelections = [];
      this.resetRaceState();
      this.drawEmptyState();
      this.syncCharacterRows([]);
    });

    this.dom.toggleCustomizerBtn.addEventListener('click', () => {
      this.customizerOpen = !this.customizerOpen;
      this.dom.characterCustomizer.hidden = !this.customizerOpen;
      this.dom.toggleCustomizerBtn.textContent = this.customizerOpen ? 'Ẩn tùy chỉnh nhân vật' : 'Tùy chỉnh nhân vật';
    });

    this.dom.applyAllCharactersBtn.addEventListener('click', () => {
      const value = this.dom.globalCharacterSelect.value;
      const names = parseNames(this.dom.playerNames.value);
      this.playerSelections = names.map(() => value);
      this.syncCharacterRows(names);
      this.preparePreview();
    });

    this.dom.setAllAutoBtn.addEventListener('click', () => {
      const names = parseNames(this.dom.playerNames.value);
      this.playerSelections = names.map(() => 'auto');
      this.syncCharacterRows(names);
      this.preparePreview();
    });
  }

  syncDuration(value) {
    const duration = clamp(Number.isFinite(value) ? value : GAME_CONFIG.defaultDuration, GAME_CONFIG.minDuration, GAME_CONFIG.maxDuration);
    this.dom.durationRange.value = duration;
    this.dom.durationNumber.value = duration;
    this.dom.durationLabel.textContent = `${duration} giây`;
    this.dom.timerText.textContent = `${duration.toFixed(1)}s`;
    if (!this.engine?.running) this.preparePreview();
  }

  getSelectedMap() {
    return MAP_DATA.find((map) => map.id === this.dom.mapSelect.value) || MAP_DATA[0];
  }

  getDuration() {
    return clamp(Number(this.dom.durationRange.value), GAME_CONFIG.minDuration, GAME_CONFIG.maxDuration);
  }

  ensureCharacterSelections(names) {
    const old = this.playerSelections.slice();
    this.playerSelections = names.map((_, index) => old[index] || 'auto');
  }

  getCharacterById(id) {
    return CHARACTER_DATA.find((item) => item.id === id) || CHARACTER_DATA[0];
  }

  resolveAssignments(names) {
    this.ensureCharacterSelections(names);
    const resolved = new Array(names.length);
    const used = new Set();

    this.playerSelections.forEach((selectedId, index) => {
      if (selectedId && selectedId !== 'auto') {
        resolved[index] = this.getCharacterById(selectedId);
        used.add(selectedId);
      }
    });

    const pool = shuffle(CHARACTER_DATA.filter((character) => !used.has(character.id)));
    let cursor = 0;
    for (let i = 0; i < names.length; i += 1) {
      if (resolved[i]) continue;
      if (cursor < pool.length) {
        resolved[i] = pool[cursor];
        cursor += 1;
      } else {
        resolved[i] = CHARACTER_DATA[(i + cursor) % CHARACTER_DATA.length];
      }
    }
    return resolved;
  }

  syncCharacterRows(names) {
    this.ensureCharacterSelections(names);
    const previewAssignments = this.resolveAssignments(names);
    this.dom.playerCharacterRows.innerHTML = names.map((name, index) => {
      const current = this.playerSelections[index] || 'auto';
      const preview = previewAssignments[index];
      const options = ['<option value="auto">Tự động ngẫu nhiên</option>']
        .concat(CHARACTER_DATA.map((character) => `<option value="${character.id}" ${current === character.id ? 'selected' : ''}>${character.label}</option>`))
        .join('');
      return `
        <div class="player-char-row" data-row-index="${index}">
          <div class="player-char-thumb"><img src="${preview.thumb}" alt="${preview.label}"></div>
          <div class="player-char-meta">
            <strong>${this.escapeHtml(name)}</strong>
            <span>${current === 'auto' ? `Tự động → ${preview.label}` : `Đang chọn → ${preview.label}`}</span>
          </div>
          <select data-character-select="${index}">${options}</select>
        </div>
      `;
    }).join('');

    qsa('[data-character-select]').forEach((select) => {
      select.addEventListener('change', () => {
        const index = Number(select.dataset.characterSelect);
        this.playerSelections[index] = select.value;
        this.syncCharacterRows(parseNames(this.dom.playerNames.value));
        this.preparePreview();
      });
    });
  }

  preparePreview() {
    const names = parseNames(this.dom.playerNames.value);
    const map = this.getSelectedMap();
    this.dom.raceTitle.textContent = map.name;
    this.dom.raceMeta.textContent = map.description;
    this.syncCharacterRows(names);

    if (this.engine?.running) return;
    if (names.length >= GAME_CONFIG.minPlayers) {
      const characters = this.resolveAssignments(names);
      this.engine = new RaceEngine({
        names,
        duration: this.getDuration(),
        map,
        characters,
        onEvent: (event) => this.handleEngineEvent(event),
        onFinish: (results) => this.finishRace(results)
      });
      this.renderRanking();
      this.drawRace();
    } else {
      this.engine = null;
      this.dom.rankingList.innerHTML = '';
      this.drawEmptyState();
    }
  }

  startRace() {
    const names = parseNames(this.dom.playerNames.value);
    if (names.length < GAME_CONFIG.minPlayers) {
      this.showComment(`Cần tối thiểu ${GAME_CONFIG.minPlayers} người chơi.`);
      return;
    }
    if (names.length > GAME_CONFIG.maxPlayers) {
      this.showComment(`Tối đa ${GAME_CONFIG.maxPlayers} người chơi.`);
      return;
    }

    this.hideResults();
    this.commentQueue = [];
    this.confetti = [];
    const map = this.getSelectedMap();
    const duration = this.getDuration();
    const characters = this.resolveAssignments(names);

    this.engine = new RaceEngine({
      names,
      duration,
      map,
      characters,
      onEvent: (event) => this.handleEngineEvent(event),
      onFinish: (results) => this.finishRace(results)
    });
    this.engine.start();
    this.lastFrameTime = performance.now();
    this.rankingSignature = '';
    this.dom.startBtn.disabled = true;
    this.dom.replayBtn.disabled = true;
    this.dom.timerText.textContent = `${duration.toFixed(1)}s`;
    this.showComment('Cuộc đua bắt đầu! Ai chạm vạch đích trước sẽ được tính hạng cao hơn.');
    this.renderRanking(true);
  }

  resetRaceState() {
    if (this.engine) this.engine.stop();
    this.engine = null;
    this.confetti = [];
    this.rankingSignature = '';
    this.dom.startBtn.disabled = false;
    this.dom.replayBtn.disabled = true;
    this.dom.timerText.textContent = `${this.getDuration().toFixed(1)}s`;
    this.dom.rankingList.innerHTML = '';
    this.showComment('Danh sách đã reset. Nhập tên người chơi mới để bắt đầu.');
  }

  handleEngineEvent(event) {
    this.enqueueComment(event.comment);
  }

  enqueueComment(comment) {
    this.commentQueue.push(comment);
    this.drainCommentQueue();
  }

  drainCommentQueue() {
    const now = performance.now();
    const wait = GAME_CONFIG.commentMinVisibleMs - (now - this.lastCommentAt);
    if (wait > 0) {
      if (!this.commentTimer) {
        this.commentTimer = setTimeout(() => {
          this.commentTimer = null;
          this.drainCommentQueue();
        }, wait);
      }
      return;
    }
    const next = this.commentQueue.shift();
    if (!next) return;
    this.showComment(next);
    if (this.commentQueue.length) this.drainCommentQueue();
  }

  showComment(text) {
    this.lastCommentAt = performance.now();
    this.dom.ticker.innerHTML = `<span>${this.escapeHtml(text)}</span>`;
  }

  escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  finishRace(results) {
    this.dom.startBtn.disabled = false;
    this.dom.replayBtn.disabled = false;
    const groups = this.buildResultGroups(results);
    const firstGroup = groups[0];
    if (firstGroup?.items.length === 2 && firstGroup.items.every((item) => item.finishedAt !== null)) {
      this.showComment(`${firstGroup.items[0].name} và ${firstGroup.items[1].name} cùng chạm vạch đích ở Hạng 1!`);
    } else if (firstGroup?.items[0]?.finishedAt !== null) {
      this.showComment(`${firstGroup.items[0].name} là người chạm vạch đích đầu tiên!`);
    } else {
      this.showComment('Hết giờ! Hạng được tính theo ai chạm đích hoặc tiến gần vạch đích nhất.');
    }
    this.spawnConfetti();
    this.showResults(groups.slice(0, 3));
  }

  buildResultGroups(results) {
    const groups = [];
    for (const item of results) {
      const last = groups[groups.length - 1];
      const canTieFirst = groups.length === 1 && last && last.items.length < GAME_CONFIG.maxTieWinners;
      const closeFinish = last && item.finishedAt !== null && last.items[0].finishedAt !== null && Math.abs(item.finishedAt - last.items[0].finishedAt) <= 0.16;
      if (canTieFirst && closeFinish) {
        last.items.push(item);
      } else {
        groups.push({ rank: groups.length + 1, items: [item] });
      }
      if (groups.length >= 3 && groups[groups.length - 1].items.length >= 1) continue;
    }
    return groups.slice(0, 3).map((group, index) => ({ ...group, rank: index + 1 }));
  }

  showResults(groups) {
    this.dom.podium.innerHTML = groups.map((group) => {
      const names = group.items.map((item) => this.escapeHtml(item.name)).join(', ');
      const progressLabel = group.items.map((item) => {
        if (item.finishedAt !== null) return `${round1(item.finishedAt)}s`;
        return `${Math.round(item.progress * 100)}% chặng đua`;
      }).join(' · ');
      const characterNames = group.items.map((item) => item.character.label).join(', ');
      return `
        <div class="podium-item">
          <div class="podium-rank">${group.rank}</div>
          <div class="podium-name">
            <strong>Hạng ${group.rank}: ${names}</strong>
            <span>${group.items.length > 1 ? 'Đồng hạng đầu' : characterNames}</span>
          </div>
          <div class="podium-time">${progressLabel}</div>
        </div>
      `;
    }).join('');
    this.dom.resultOverlay.hidden = false;
  }

  hideResults() { this.dom.resultOverlay.hidden = true; }

  renderRanking(force = false) {
    if (!this.engine) return;
    const ranking = this.engine.getRanking();
    const signature = ranking.map((racer) => racer.id).join('|');
    const changed = force || signature !== this.rankingSignature;
    this.rankingSignature = signature;

    this.dom.rankingList.innerHTML = ranking.map((racer, index) => {
      const progressPercent = Math.round(racer.progress * 100);
      const finishText = racer.finishedAt !== null ? `${round1(racer.finishedAt)}s` : `${progressPercent}%`;
      return `
        <li class="rank-item ${changed ? 'rank-jump' : ''}">
          <div class="rank-no">${index + 1}</div>
          <div class="rank-name">
            <strong>${this.escapeHtml(racer.name)}</strong>
            <span>${racer.character.label} · Làn ${racer.lane + 1}</span>
          </div>
          <div class="rank-progress">${finishText}</div>
        </li>
      `;
    }).join('');
  }

  resizeCanvas() {
    const canvas = this.dom.canvas;
    const frame = canvas.parentElement;
    const rect = frame.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const width = Math.max(720, Math.floor(rect.width));
    const height = Math.max(420, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas.dataset.cssWidth = width;
    canvas.dataset.cssHeight = height;
    this.drawRace();
  }

  loop(time) {
    const dt = Math.min(0.05, (time - this.lastFrameTime) / 1000 || 0);
    this.lastFrameTime = time;

    if (this.engine?.running) {
      this.engine.update(dt);
      const remaining = Math.max(0, this.engine.duration - this.engine.elapsed);
      this.dom.timerText.textContent = `${remaining.toFixed(1)}s`;
      this.renderRanking();
    }

    this.updateConfetti(dt);
    this.drawRace();
    this.animationId = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  getCanvasSize() {
    return { width: Number(this.dom.canvas.dataset.cssWidth || this.dom.canvas.width), height: Number(this.dom.canvas.dataset.cssHeight || this.dom.canvas.height) };
  }

  drawEmptyState() {
    const { width, height } = this.getCanvasSize();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    this.drawMapBackground(ctx, width, height, MAP_DATA[0]);
    ctx.fillStyle = '#12372A';
    ctx.font = '900 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nhập ít nhất 2 người chơi để dựng đường đua', width / 2, height / 2 - 8);
    ctx.fillStyle = '#4B635B';
    ctx.font = '700 16px system-ui, sans-serif';
    ctx.fillText('Mỗi người có một làn riêng và có thể tùy chỉnh nhân vật.', width / 2, height / 2 + 24);
  }

  drawRace() {
    const { width, height } = this.getCanvasSize();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const laneCount = this.engine?.racers.length || Math.max(GAME_CONFIG.minPlayers, parseNames(this.dom.playerNames.value).length || 6);
    const map = this.engine?.map || this.getSelectedMap();
    this.drawMapBackground(ctx, width, height, map);
    this.trackGeometry = buildTrackGeometry(width, height, laneCount, map);
    this.drawCircuitTrack(ctx, this.trackGeometry, map);
    this.drawDirectionSigns(ctx, this.trackGeometry);

    if (this.engine) {
      this.drawJumpPads(ctx, this.engine.racers, this.trackGeometry);
      this.drawVisualEvents(ctx, this.engine.visualEvents, this.trackGeometry);
      this.drawRacers(ctx, this.engine.racers, this.trackGeometry);
    }

    this.drawConfetti(ctx);
  }

  drawMapBackground(ctx, width, height, map) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, map.bgA);
    grad.addColorStop(1, map.bgB);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 16; i += 1) {
      ctx.beginPath();
      ctx.arc((i * 137 + 40) % width, (i * 89 + 35) % height, 6 + (i % 4) * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(104, 157, 127, 0.12)';
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 71 + 30) % width;
      const y = (i * 51 + 120) % height;
      ctx.beginPath();
      ctx.ellipse(x, y, 12 + (i % 3) * 7, 8 + (i % 4) * 3, Math.PI / 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCircuitTrack(ctx, track, map) {
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Bong nen cua track.
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = track.trackWidth + 30;
    this.traceCenterline(ctx, track);
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#ADB0B6';
    ctx.lineWidth = track.trackWidth + 16;
    this.traceCenterline(ctx, track);
    ctx.stroke();

    ctx.strokeStyle = '#55585E';
    ctx.lineWidth = track.trackWidth;
    this.traceCenterline(ctx, track);
    ctx.stroke();

    // Edge curbs.
    const edgeOffset = track.trackWidth / 2;
    this.strokeOffsetLine(ctx, track, edgeOffset, '#FFFFFF', 10);
    this.strokeOffsetLine(ctx, track, -edgeOffset, '#FFFFFF', 10);
    this.strokeOffsetDashed(ctx, track, edgeOffset, ['#D94B4B', '#FFFFFF'], 7, 18, 12);
    this.strokeOffsetDashed(ctx, track, -edgeOffset, ['#D94B4B', '#FFFFFF'], 7, 18, 12);

    // Lane lines.
    for (let i = 1; i < track.lanes; i += 1) {
      const offset = -track.trackWidth / 2 + (track.trackWidth / track.lanes) * i;
      this.strokeOffsetDashed(ctx, track, offset, [ 'rgba(255,255,255,0.86)' ], 2, 16, 14);
    }

    // Start / finish line.
    this.drawFinishLine(ctx, track);

    // Lane labels near start.
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    track.laneWidth = track.trackWidth / track.lanes;
    for (let lane = 0; lane < track.lanes; lane += 1) {
      const p = getLanePoint(track, lane, 0.012);
      ctx.fillText(String(lane + 1), p.x - p.nx * 16, p.y - p.ny * 16);
    }
    ctx.restore();
  }

  traceCenterline(ctx, track) {
    const first = track.samples[0];
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < track.samples.length; i += 1) {
      const p = track.samples[i];
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
  }

  strokeOffsetLine(ctx, track, offset, color, width) {
    traceOffsetPath(ctx, track, offset);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  strokeOffsetDashed(ctx, track, offset, colors, width, dashA, dashB) {
    ctx.save();
    ctx.setLineDash([dashA, dashB]);
    ctx.lineDashOffset = 0;
    colors.forEach((color, index) => {
      traceOffsetPath(ctx, track, offset);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineDashOffset = index * dashA;
      ctx.stroke();
    });
    ctx.restore();
  }

  drawFinishLine(ctx, track) {
    const base = sampleTrack(track, 0);
    const n = { x: base.nx, y: base.ny };
    const width = track.trackWidth + 8;
    const x1 = base.x + n.x * (width / 2);
    const y1 = base.y + n.y * (width / 2);
    const x2 = base.x - n.x * (width / 2);
    const y2 = base.y - n.y * (width / 2);

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }


  drawDirectionSigns(ctx, track) {
    const signSpecs = [
      { progress: 0.08, side: 1 },
      { progress: 0.27, side: -1 },
      { progress: 0.46, side: 1 },
      { progress: 0.66, side: -1 },
      { progress: 0.84, side: 1 }
    ];
    signSpecs.forEach((spec) => {
      const base = sampleTrack(track, spec.progress);
      const next = sampleTrack(track, spec.progress + 0.012);
      const offset = track.trackWidth / 2 + 34;
      const x = base.x + base.nx * offset * spec.side;
      const y = base.y + base.ny * offset * spec.side;

      // Tinh huong mui ten theo chieu tien cua cuoc dua,
      // khong lat nguoc theo vi tri bien bao hai ben le nua.
      const dx = next.x - base.x;
      const dy = next.y - base.y;
      const angle = Math.atan2(dy, dx);
      this.drawRoadsideArrow(ctx, x, y, angle);
    });
  }

  drawRoadsideArrow(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#1785D8';
    this.roundRect(ctx, -23, -12, 46, 24, 8);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-10, -4);
    ctx.lineTo(4, -4);
    ctx.lineTo(4, -8);
    ctx.lineTo(16, 0);
    ctx.lineTo(4, 8);
    ctx.lineTo(4, 4);
    ctx.lineTo(-10, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1067A8';
    ctx.fillRect(-18, 12, 5, 12);
    ctx.fillRect(13, 12, 5, 12);
    ctx.restore();
  }

  drawJumpPads(ctx, racers, track) {
    const now = this.engine?.elapsed || 0;
    for (const racer of racers) {
      if (!racer.jumpPad) continue;
      const p = getLanePoint(track, racer.lane, racer.jumpPad.progress);
      const active = racer.jumpPad.activeUntil > now;
      this.drawRamp(ctx, p.x, p.y, p.angle, active, racer.jumpPad.result);
    }
  }

  drawRamp(ctx, x, y, angle, active, result) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = active ? 18 : 7;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = result === 'fail' ? '#3651B5' : '#4259D4';
    ctx.beginPath();
    ctx.moveTo(-18, 11);
    ctx.lineTo(20, 6);
    ctx.lineTo(16, -9);
    ctx.lineTo(-22, -4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D8F3FF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = active ? '#FACC15' : '#98E8FF';
    ctx.lineWidth = 2;
    for (let i = -10; i <= 10; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 9);
      ctx.bezierCurveTo(i - 3, 1, i + 4, -2, i, -8);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawVisualEvents(ctx, events, track) {
    const now = this.engine?.elapsed || 0;
    for (const event of events) {
      const p = getLanePoint(track, event.lane, event.progress);
      const age = now - event.createdAt;
      const remaining = event.until - now;
      const alpha = clamp(Math.min(age / 0.22, remaining / 0.35), 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      if (event.type === 'tornado') this.drawTornado(ctx, p.x, p.y, age);
      if (event.type === 'wind') this.drawWind(ctx, p.x, p.y, age, false);
      if (event.type === 'windBoost') this.drawWind(ctx, p.x, p.y, age, true);
      if (event.type === 'rock') this.drawRock(ctx, p.x + 8, p.y + 3);
      if (event.type === 'jumpBurst') this.drawJumpBurst(ctx, p.x, p.y, age, event.success);
      if (event.type === 'speed') this.drawSpeedBurst(ctx, p.x, p.y, age);
      if (event.type === 'impact') this.drawImpact(ctx, p.x, p.y, age);
      ctx.restore();
    }
  }

  drawTornado(ctx, x, y, age) {
    ctx.save();
    ctx.translate(x, y - 12);
    ctx.rotate(age * 2.2);
    const grad = ctx.createLinearGradient(0, -28, 0, 26);
    grad.addColorStop(0, 'rgba(160,232,255,0.95)');
    grad.addColorStop(1, 'rgba(45,148,191,0.9)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 5; i += 1) {
      const yy = -25 + i * 11;
      const rx = 24 - i * 3;
      ctx.beginPath();
      ctx.ellipse(0, yy, rx, 5, 0, 0, Math.PI * 1.65);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(87,201,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(-20, -24);
    ctx.quadraticCurveTo(10, -2, -3, 28);
    ctx.quadraticCurveTo(28, -2, 20, -26);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawWind(ctx, x, y, age, boost) {
    ctx.save();
    ctx.translate(x - 34, y - 10);
    ctx.strokeStyle = boost ? '#FFF9B0' : '#E6FCFF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i += 1) {
      const offset = ((age * 38 + i * 18) % 42) - 20;
      ctx.beginPath();
      ctx.moveTo(offset, i * 9);
      ctx.bezierCurveTo(offset + 20, i * 9 - 8, offset + 38, i * 9 + 8, offset + 62, i * 9);
      ctx.stroke();
    }
    ctx.strokeStyle = boost ? '#FACC15' : '#45E0E0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, -6);
    ctx.bezierCurveTo(28, -18, 45, -3, 66, -10);
    ctx.stroke();
    ctx.restore();
  }

  drawRock(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#8B8174';
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.lineTo(-10, -10);
    ctx.lineTo(5, -15);
    ctx.lineTo(18, -5);
    ctx.lineTo(14, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#F4E8D2';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  drawJumpBurst(ctx, x, y, age, success) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = success ? '#FACC15' : '#FB7185';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = i * Math.PI / 4 + age * 0.8;
      const r1 = 12;
      const r2 = 22 + Math.sin(age * 8 + i) * 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawSpeedBurst(ctx, x, y, age) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-34 - i * 8 - age * 20, -10 + i * 5);
      ctx.lineTo(-10 - i * 3, -8 + i * 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawImpact(ctx, x, y, age) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#FFF5A8';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i += 1) {
      const a = i * Math.PI / 3 + age * 0.6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6);
      ctx.lineTo(Math.cos(a) * 20, Math.sin(a) * 20);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawRacers(ctx, racers, track) {
    const now = this.engine?.elapsed || 0;
    for (const racer of racers) {
      const renderProgress = Number.isFinite(racer.displayProgress) ? racer.displayProgress : racer.progress;
      const p = getLanePoint(track, racer.lane, renderProgress + racer.laneOffset);
      racer.lastPosition = p;
      racer.trail.push({
        x: p.x,
        y: p.y,
        at: now,
        sprint: this.hasEffect(racer, 'finalSprint') || this.hasEffect(racer, 'tailwind') || this.hasEffect(racer, 'jumpSuccess') || this.hasEffect(racer, 'slipstream')
      });
      racer.trail = racer.trail.filter((point) => now - point.at < GAME_CONFIG.trailLife);
      this.drawTrail(ctx, racer, now);
    }

    for (const racer of racers) {
      const p = racer.lastPosition;
      this.drawRacerSprite(ctx, racer, p, now);
      if (racer.bubble && racer.bubble.until > now) {
        this.drawBubble(ctx, racer.bubble.text, p.x, p.y - 52, racer.bubble.until - now);
      }
    }
  }

  hasEffect(racer, type) {
    return racer.effects.some((effect) => effect.type === type && effect.until > this.engine.elapsed);
  }

  drawTrail(ctx, racer, now) {
    const trail = racer.trail.filter((point) => point.sprint);
    if (!trail.length) return;
    ctx.save();
    for (const point of trail) {
      const age = now - point.at;
      const alpha = clamp(0.38 - age * 0.62, 0, 0.34);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.ellipse(point.x, point.y, 16 + age * 12, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawRacerSprite(ctx, racer, p, now) {
    const drawBox = clamp(232 - this.engine.racers.length * 4.4, 144, 184);
    const paused = racer.hardPauseUntil > this.engine.elapsed;
    const wobble = this.hasEffect(racer, 'slideTurn') || this.hasEffect(racer, 'bump') || paused;

    const targetAngle = Number.isFinite(p.angle) ? p.angle : 0;
    if (!Number.isFinite(racer.renderAngle)) racer.renderAngle = targetAngle;
    racer.renderAngle = lerpAngle(racer.renderAngle, targetAngle, paused ? 0.16 : 0.24);

    const targetLean = clamp((p.turn || 0) * 4.2, -0.24, 0.24);
    racer.bodyLean = lerp(racer.bodyLean || 0, targetLean, paused ? 0.10 : 0.18);

    const cyclePhase = Number.isFinite(racer.runCyclePhase) ? racer.runCyclePhase : 0;
    const frameIndex = paused ? 0 : (Math.floor(cyclePhase / 2) % 4);
    const safeFrameIndex = Number.isFinite(frameIndex) ? frameIndex : 0;
    const framePath = racer.character.frames[safeFrameIndex] || racer.character.frames[0];
    const img = this.imageCache.get(framePath);
    const bob = paused ? 0 : Math.sin((cyclePhase / GAME_CONFIG.runCycleFrames) * Math.PI * 2) * 1.8;
    const stride = paused ? 1 : 1 + Math.sin((cyclePhase / GAME_CONFIG.runCycleFrames) * Math.PI * 2) * 0.035;

    ctx.save();
    ctx.translate(p.x, p.y - (racer.displayLift || 0));
    ctx.rotate(racer.renderAngle + racer.bodyLean + (wobble ? Math.sin(this.engine.elapsed * 16 + racer.index) * 0.08 : 0));
    ctx.scale(stride, paused ? 0.96 : (1 - Math.abs(racer.bodyLean) * 0.08));
    if (paused) ctx.scale(1.04, 0.94);

    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(0, drawBox * 0.35 + (racer.displayLift || 0) * 0.08, drawBox * 0.28, drawBox * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    if (img && img.complete) {
      ctx.drawImage(img, -drawBox / 2, -drawBox / 2 - 6 + bob, drawBox, drawBox);
    } else {
      const size = clamp(62 - this.engine.racers.length * 0.56, 36, 48);
      this.drawFullDuck(ctx, racer, size, safeFrameIndex, now);
    }
    ctx.restore();

    ctx.save();
    ctx.font = '800 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const label = racer.name.length > 8 ? `${racer.name.slice(0, 8)}…` : racer.name;
    const textWidth = ctx.measureText(label).width;
    const labelY = p.y + drawBox * 0.31 - (racer.displayLift || 0);
    ctx.fillStyle = 'rgba(18,55,42,0.84)';
    this.roundRect(ctx, p.x - textWidth / 2 - 6, labelY, textWidth + 12, 18, 8);
    ctx.fill();
    ctx.fillStyle = '#ECFFF7';
    ctx.fillText(label, p.x, labelY + 3);
    ctx.restore();
  }

  drawFullDuck(ctx, racer, size, frameIndex, now) {
    const paletteIndex = Number((racer.character.id || 'nv01').replace('nv', '')) - 1;
    const palette = DUCK_PALETTES[((paletteIndex % DUCK_PALETTES.length) + DUCK_PALETTES.length) % DUCK_PALETTES.length];
    const phase = (frameIndex % 4) / 4;
    const legSwing = Math.sin(phase * Math.PI * 2) * size * 0.28;
    const ribbonWave = Math.sin(now * 10 + racer.index) * size * 0.06;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Tail
    ctx.fillStyle = palette.body;
    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = Math.max(1.2, size * 0.10);
    ctx.beginPath();
    ctx.moveTo(-size * 0.55, -size * 0.10);
    ctx.lineTo(-size * 0.92, -size * 0.38);
    ctx.lineTo(-size * 0.84, -size * 0.02);
    ctx.lineTo(-size * 1.02, size * 0.12);
    ctx.lineTo(-size * 0.64, size * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Back leg.
    this.drawDuckLeg(ctx, -size * 0.12, size * 0.44, size, -legSwing, palette, 0.92);
    // Front leg.
    this.drawDuckLeg(ctx, size * 0.22, size * 0.44, size, legSwing, palette, 1.0);

    // Body.
    ctx.fillStyle = palette.body;
    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = Math.max(1.2, size * 0.11);
    ctx.beginPath();
    ctx.ellipse(-size * 0.05, size * 0.06, size * 0.84, size * 0.64, 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wing.
    ctx.fillStyle = palette.wing;
    ctx.beginPath();
    ctx.ellipse(-size * 0.06, size * 0.08, size * 0.36, size * 0.28, -0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head.
    ctx.fillStyle = palette.body;
    ctx.beginPath();
    ctx.arc(size * 0.54, -size * 0.32, size * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair tuft.
    ctx.beginPath();
    ctx.moveTo(size * 0.44, -size * 0.66);
    ctx.quadraticCurveTo(size * 0.62, -size * 0.96, size * 0.76, -size * 0.62);
    ctx.quadraticCurveTo(size * 0.68, -size * 0.82, size * 0.54, -size * 0.54);
    ctx.fill();
    ctx.stroke();

    // Beak.
    ctx.fillStyle = palette.beak;
    ctx.beginPath();
    ctx.moveTo(size * 0.76, -size * 0.24);
    ctx.lineTo(size * 1.14, -size * 0.12);
    ctx.lineTo(size * 0.78, size * 0.02);
    ctx.quadraticCurveTo(size * 0.58, -size * 0.08, size * 0.76, -size * 0.24);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.68, -size * 0.02);
    ctx.quadraticCurveTo(size * 0.86, size * 0.04, size * 0.98, -size * 0.02);
    ctx.stroke();

    // Eye.
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.56, -size * 0.36, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.arc(size * 0.58, -size * 0.34, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.60, -size * 0.36, size * 0.025, 0, Math.PI * 2);
    ctx.fill();

    // Headband.
    ctx.fillStyle = palette.band;
    ctx.strokeStyle = palette.outline;
    ctx.lineWidth = Math.max(1.0, size * 0.08);
    ctx.beginPath();
    ctx.moveTo(size * 0.18, -size * 0.48);
    ctx.quadraticCurveTo(size * 0.50, -size * 0.70, size * 0.84, -size * 0.52);
    ctx.lineTo(size * 0.82, -size * 0.34);
    ctx.quadraticCurveTo(size * 0.50, -size * 0.52, size * 0.24, -size * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.18, -size * 0.45);
    ctx.lineTo(-size * 0.10, -size * 0.62 + ribbonWave);
    ctx.lineTo(-size * 0.03, -size * 0.40 + ribbonWave);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.24, -size * 0.39);
    ctx.lineTo(-size * 0.01, -size * 0.18 + ribbonWave * 0.6);
    ctx.lineTo(size * 0.08, -size * 0.04 + ribbonWave * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawDuckLeg(ctx, baseX, baseY, size, swing, palette, scale = 1) {
    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.strokeStyle = palette.beak;
    ctx.fillStyle = palette.beak;
    ctx.lineWidth = Math.max(1.1, size * 0.11 * scale);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(swing * 0.45, size * 0.34 * scale);
    ctx.stroke();
    const footX = swing * 0.45;
    const footY = size * 0.34 * scale;
    ctx.beginPath();
    ctx.moveTo(footX - size * 0.14, footY + size * 0.03);
    ctx.lineTo(footX + size * 0.07, footY + size * 0.03);
    ctx.lineTo(footX + size * 0.14, footY + size * 0.12);
    ctx.lineTo(footX - size * 0.02, footY + size * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawBubble(ctx, text, x, y, remaining) {
    ctx.save();
    const alpha = clamp(Math.min(1, remaining / 0.35), 0, 1);
    ctx.globalAlpha = alpha;
    ctx.font = '900 13px system-ui, sans-serif';
    const paddingX = 10;
    const width = Math.min(180, ctx.measureText(text).width + paddingX * 2);
    const height = 30;
    const { width: canvasWidth } = this.getCanvasSize();
    const left = clamp(x - width / 2, 8, canvasWidth - width - 8);
    const top = Math.max(8, y - height / 2);
    ctx.fillStyle = '#FFFFFF';
    this.roundRect(ctx, left, top, width, height, 15);
    ctx.fill();
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.42)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#12372A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, left + width / 2, top + height / 2 + 0.5);
    ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  spawnConfetti() {
    const { width, height } = this.getCanvasSize();
    this.confetti = Array.from({ length: 90 }, () => ({
      x: rand(width * 0.15, width * 0.85),
      y: rand(-height * 0.2, height * 0.15),
      vx: rand(-38, 38),
      vy: rand(80, 170),
      life: rand(1.4, 2.6),
      size: rand(4, 8),
      color: pick(['#2DD4BF', '#34D399', '#FACC15', '#FB7185', '#FFFFFF']),
      angle: rand(0, Math.PI * 2),
      spin: rand(-5, 5)
    }));
  }

  updateConfetti(dt) {
    this.confetti.forEach((c) => {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 42 * dt;
      c.angle += c.spin * dt;
      c.life -= dt;
    });
    this.confetti = this.confetti.filter((c) => c.life > 0);
  }

  drawConfetti(ctx) {
    if (!this.confetti.length) return;
    for (const c of this.confetti) {
      ctx.save();
      ctx.globalAlpha = clamp(c.life, 0, 1);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.65);
      ctx.restore();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});

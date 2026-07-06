/*
  Mint Duck Race Arena - Race Engine + Canvas UI
  Ghi chu: comment trong code dung tieng Viet khong dau de de sua ve sau.
*/

'use strict';

const GAME_CONFIG = {
  minPlayers: 2,
  maxPlayers: 12,
  defaultDuration: 30,
  minDuration: 15,
  maxDuration: 90,
  eventMinGap: 2.0,
  eventMaxGap: 4.0,
  commentMinVisibleMs: 2000,
  bubbleMinTime: 1.15,
  tieRate: 0.15,
  maxTieWinners: 2,
  endAfterFirstFinish: true
};

const SAMPLE_NAMES = {
  3: ['Khải', 'Lan', 'Tùng'],
  5: ['Khải', 'Lan', 'Tùng', 'Minh', 'Vy'],
  8: ['Khải', 'Lan', 'Tùng', 'Minh', 'Vy', 'Huy', 'An', 'Bình']
};

const ANIMAL_DATA = [
  { id: 'brave-duck', label: 'Vịt dũng cảm', emoji: '🦆', color: '#FACC15' },
  { id: 'white-duck', label: 'Vịt thanh lịch', emoji: '🦢', color: '#F8FAFC' },
  { id: 'fun-duck', label: 'Vịt vui nhộn', emoji: '🦆', color: '#B77945' },
  { id: 'lucky-duck', label: 'Vịt may mắn', emoji: '🦆', color: '#34D399' },
  { id: 'sport-duck', label: 'Vịt thể thao', emoji: '🦆', color: '#60A5FA' },
  { id: 'pink-duck', label: 'Vịt vui vẻ', emoji: '🦆', color: '#FB7185' },
  { id: 'ninja-duck', label: 'Vịt ninja', emoji: '🥷', color: '#111827' },
  { id: 'orange-duck', label: 'Vịt tốc độ', emoji: '🦆', color: '#FB923C' },
  { id: 'frog', label: 'Ếch xanh', emoji: '🐸', color: '#22C55E' },
  { id: 'rabbit', label: 'Thỏ nhanh chân', emoji: '🐰', color: '#F9A8D4' },
  { id: 'turtle', label: 'Rùa lì đòn', emoji: '🐢', color: '#84CC16' },
  { id: 'cat', label: 'Mèo lanh lợi', emoji: '🐱', color: '#F97316' }
];

const MAP_DATA = [
  {
    id: 'mint-violet',
    name: 'Sân Mint Violet',
    description: 'Màu xanh tím giống sân điền kinh, cua rộng, vạch làn rõ.',
    trackColor: '#6F71B0',
    trackLight: '#8588C5',
    trackDark: '#34345D',
    curveDifficulty: 0.88,
    shortcutRisk: 0.42,
    shortcutGain: 0.055
  },
  {
    id: 'river-lane',
    name: 'Kênh Bèo Mint',
    description: 'Đường nước êm nhưng nhánh hẹp dễ kẹt.',
    trackColor: '#5E8FD5',
    trackLight: '#8DB6F2',
    trackDark: '#265386',
    curveDifficulty: 0.8,
    shortcutRisk: 0.48,
    shortcutGain: 0.065
  },
  {
    id: 'bamboo-cup',
    name: 'Bamboo Cup',
    description: 'Đường cua mượt, có lối tắt xuyên bụi tre.',
    trackColor: '#64A98C',
    trackLight: '#94D3B4',
    trackDark: '#23634D',
    curveDifficulty: 0.76,
    shortcutRisk: 0.38,
    shortcutGain: 0.052
  },
  {
    id: 'sunny-loop',
    name: 'Sunny Loop',
    description: 'Đường sáng, dễ xem, cuối chặng dễ bứt tốc.',
    trackColor: '#7B79C9',
    trackLight: '#A7A5F0',
    trackDark: '#403C88',
    curveDifficulty: 0.9,
    shortcutRisk: 0.36,
    shortcutGain: 0.047
  },
  {
    id: 'stormy-mint',
    name: 'Stormy Mint',
    description: 'Gió thất thường, đường tắt lợi lớn nhưng rủi ro cao.',
    trackColor: '#5B68A8',
    trackLight: '#8E9BE0',
    trackDark: '#2F385F',
    curveDifficulty: 1.0,
    shortcutRisk: 0.58,
    shortcutGain: 0.075
  }
];

const EVENT_COMMENTS = {
  headwind: '{name} gặp gió ngược, tốc độ giảm thấy rõ!',
  tailwind: '{name} gặp gió xuôi và đang tăng tốc!',
  stumble: '{name} vừa vấp nhẹ nhưng đang cố lấy lại thăng bằng!',
  slideTurn: '{name} trượt cua, mất nhịp trong tích tắc!',
  block: '{name} bị chắn đường vì nhóm phía trước quá sát!',
  bump: '{name} va chạm nhẹ, cả làn đua nóng lên rồi!',
  shortcutEnter: '{name} liều lĩnh lao vào đường tắt!',
  shortcutSuccess: '{name} thoát khỏi đường tắt và vươn lên mạnh mẽ!',
  shortcutFail: '{name} bị kẹt ở nhánh hẹp!',
  slipstream: '{name} đang đu bám người phía trước để lấy đà!',
  finalSprint: '{name} đang bứt tốc ở những giây cuối!'
};

const EVENT_BUBBLES = {
  headwind: 'Gió ngược!',
  tailwind: 'Gió xuôi!',
  stumble: 'Vấp nhẹ!',
  slideTurn: 'Trượt cua!',
  block: 'Bị chắn!',
  bump: 'Va chạm!',
  shortcutEnter: 'Đường tắt!',
  shortcutSuccess: 'Thoát hiểm!',
  shortcutFail: 'Kẹt nhánh!',
  slipstream: 'Đu bám!',
  finalSprint: 'Bứt tốc!'
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const formatComment = (type, racer) => EVENT_COMMENTS[type].replace('{name}', racer.name);

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function round1(value) {
  return Math.round(value * 10) / 10;
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
  const valid = weightedItems.filter((item) => item.weight > 0);
  const total = valid.reduce((sum, item) => sum + item.weight, 0);
  if (!valid.length || total <= 0) return null;
  let cursor = Math.random() * total;
  for (const item of valid) {
    cursor -= item.weight;
    if (cursor <= 0) return item.value;
  }
  return valid[valid.length - 1].value;
}

class RaceEngine {
  constructor({ names, duration, map, onEvent, onFinish }) {
    this.duration = duration;
    this.map = map;
    this.onEvent = onEvent;
    this.onFinish = onFinish;
    this.elapsed = 0;
    this.running = false;
    this.finished = false;
    this.nextEventAt = rand(GAME_CONFIG.eventMinGap, GAME_CONFIG.eventMaxGap);
    this.racers = this.createRacers(names);
    this.tieMode = false;
    this.tieIds = [];
    this.assignFairFinishTimes();
  }

  createRacers(names) {
    const animals = shuffle(ANIMAL_DATA);
    return names.map((name, index) => {
      const animal = animals[index % animals.length];
      return {
        id: `racer-${index}-${Date.now()}`,
        index,
        lane: index,
        name,
        animal,
        stats: {
          baseSpeed: rand(0.9, 1.1),
          burst: rand(0.45, 1.0),
          stability: rand(0.45, 1.0),
          luck: rand(0.42, 1.0),
          courage: rand(0.38, 1.0)
        },
        progress: 0,
        targetFinishTime: this.duration,
        finishedAt: null,
        usedShortcut: false,
        inShortcut: false,
        shortcutResolveAt: 0,
        eventCooldownUntil: 0,
        effects: [],
        bubble: null,
        lastPosition: null,
        trail: [],
        laneOffset: rand(-0.006, 0.006),
        eventHistory: []
      };
    });
  }

  assignFairFinishTimes() {
    // Cham thoi gian dich truoc khi chay de dam bao van dua co nguoi cham vach dich dung thoi luong nguoi dung chon.
    // Diem so gom chi so an va nhieu nho, khong buff truc tiep qua lo trong luc dua.
    const ranked = this.racers
      .map((racer) => {
        const s = racer.stats;
        const score =
          s.baseSpeed * 0.42 +
          s.burst * 0.2 +
          s.stability * 0.14 +
          s.luck * 0.14 +
          s.courage * 0.1 +
          rand(-0.08, 0.08);
        return { racer, score };
      })
      .sort((a, b) => b.score - a.score);

    this.tieMode = this.racers.length >= 4 && Math.random() < GAME_CONFIG.tieRate;
    const winnerTime = this.duration * rand(0.91, 0.975);

    ranked.forEach((entry, rankIndex) => {
      const spread = rankIndex === 0 ? 0 : rand(0.025, 0.075) * rankIndex;
      const skillAdjust = clamp((ranked[0].score - entry.score) * 0.12, 0, 0.16);
      const naturalNoise = rand(0, 0.045);
      const raw = winnerTime + this.duration * (spread + skillAdjust + naturalNoise);
      entry.racer.targetFinishTime = clamp(raw, winnerTime, this.duration * 1.45);
    });

    if (this.tieMode) {
      const first = ranked[0].racer;
      const second = ranked[1].racer;
      const tieTime = winnerTime;
      first.targetFinishTime = tieTime;
      second.targetFinishTime = tieTime;
      this.tieIds = [first.id, second.id];
    }
  }

  start() {
    this.running = true;
    this.finished = false;
  }

  stop() {
    this.running = false;
  }

  update(dt) {
    if (!this.running || this.finished) return;
    this.elapsed += dt;

    this.handleScheduledEvent();
    this.updateRacers(dt);
    this.resolveShortcutEvents();
    this.checkFinish();
  }

  getRaceFactor() {
    return clamp(this.elapsed / this.duration, 0, 1.4);
  }

  getRanking() {
    return this.racers.slice().sort((a, b) => {
      if (a.finishedAt !== null && b.finishedAt !== null) return a.finishedAt - b.finishedAt;
      if (a.finishedAt !== null) return -1;
      if (b.finishedAt !== null) return 1;
      return b.progress - a.progress;
    });
  }

  updateRacers(dt) {
    const ranking = this.getRanking();
    const leaderProgress = ranking[0]?.progress || 0;
    const raceFactor = this.getRaceFactor();

    for (const racer of this.racers) {
      if (racer.finishedAt !== null) continue;

      racer.effects = racer.effects.filter((effect) => effect.until > this.elapsed);
      const effectMult = racer.effects.reduce((mult, effect) => mult * effect.multiplier, 1);

      const gapFromLeader = Math.max(0, leaderProgress - racer.progress);
      const isLeader = ranking[0]?.id === racer.id;

      // Rubber-band nhe: chi dieu chinh nho de khong bo xa qua som, khong lap nguoc trang thai qua lo.
      let rubber = 1;
      if (!isLeader && gapFromLeader > 0.08 && raceFactor < 0.82) rubber += clamp(gapFromLeader * 0.28, 0, 0.08);
      if (isLeader && leaderProgress > 0.22 && raceFactor < 0.7) rubber -= 0.025;

      const finalPush = raceFactor > 0.8 ? 1 + racer.stats.burst * 0.035 : 1;
      const idealProgress = this.elapsed / racer.targetFinishTime;
      const pacingDiff = idealProgress - racer.progress;
      const pacingCorrection = clamp(pacingDiff * 0.5, -0.025, 0.04);
      const baseRate = 1 / racer.targetFinishTime;
      const variation = 1 + Math.sin((this.elapsed * 1.7) + racer.index) * 0.012 + rand(-0.008, 0.008);

      let delta = dt * baseRate * racer.stats.baseSpeed * effectMult * rubber * finalPush * variation;
      delta += dt * pacingCorrection;

      // Truoc thoi diem cham dich da duoc gan, khong cho vuot vach de ket qua dung theo cham vach.
      const softCapBeforeFinish = this.elapsed < racer.targetFinishTime ? 0.996 : 1.03;
      racer.progress = clamp(racer.progress + delta, 0, softCapBeforeFinish);

      // Neu da den moc dich ma van thieu chut xiu, keo ve dich bang correction rat nhe.
      if (this.elapsed >= racer.targetFinishTime && racer.progress < 1) {
        racer.progress = Math.min(1, racer.progress + dt * 0.9);
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

  pickEvent() {
    const raceFactor = this.getRaceFactor();
    const active = this.racers.filter((r) => r.finishedAt === null);
    if (!active.length) return null;

    const closePair = this.findClosePair();
    const slipstreamTarget = this.findSlipstreamTarget();
    const shortcutTarget = this.findShortcutCandidate();
    const curveTarget = this.findCurveCandidate();

    const choices = [];
    choices.push({ value: { type: 'headwind', racer: this.pickVulnerableRacer(active) }, weight: 1.0 });
    choices.push({ value: { type: 'tailwind', racer: this.pickGoodEventRacer(active) }, weight: 0.9 });
    choices.push({ value: { type: 'stumble', racer: this.pickStumbleRacer(active) }, weight: 0.95 });
    choices.push({ value: { type: 'slideTurn', racer: curveTarget }, weight: curveTarget ? 0.8 * this.map.curveDifficulty : 0 });
    choices.push({ value: { type: 'block', racer: closePair?.behind, extra: closePair }, weight: closePair ? 1.0 : 0 });
    choices.push({ value: { type: 'bump', racer: closePair?.behind, extra: closePair }, weight: closePair ? 0.8 : 0 });
    choices.push({ value: { type: 'slipstream', racer: slipstreamTarget }, weight: slipstreamTarget ? 0.95 : 0 });
    choices.push({ value: { type: 'shortcutEnter', racer: shortcutTarget }, weight: shortcutTarget ? 1.0 : 0 });
    choices.push({ value: { type: 'finalSprint', racer: this.pickFinalSprinter(active) }, weight: raceFactor > 0.8 ? 2.3 : 0.12 });

    const picked = weightedPick(choices);
    if (!picked || !picked.racer) return null;
    if (picked.racer.eventCooldownUntil > this.elapsed && !['block', 'bump'].includes(picked.type)) return null;
    return picked;
  }

  pickVulnerableRacer(active) {
    const ranking = this.getRanking();
    const items = active.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const badLuck = 1.1 - racer.stats.luck;
      const lowStable = 1.15 - racer.stats.stability;
      const leaderPressure = rankIndex <= 1 ? 0.28 : 0;
      return { value: racer, weight: 0.35 + badLuck * 0.55 + lowStable * 0.35 + leaderPressure };
    });
    return weightedPick(items) || pick(active);
  }

  pickGoodEventRacer(active) {
    const ranking = this.getRanking();
    const leader = ranking[0];
    const items = active.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const trailingBoost = rankIndex >= Math.ceil(active.length / 2) ? 0.28 : 0;
      const leaderPenalty = racer.id === leader.id && this.getRaceFactor() < 0.78 ? -0.25 : 0;
      return {
        value: racer,
        weight: 0.25 + racer.stats.luck * 0.32 + racer.stats.burst * 0.28 + trailingBoost + leaderPenalty
      };
    });
    return weightedPick(items) || pick(active);
  }

  pickStumbleRacer(active) {
    const items = active.map((racer) => ({
      value: racer,
      weight: 0.2 + (1 - racer.stats.stability) * 1.15 + (1 - racer.stats.luck) * 0.35
    }));
    return weightedPick(items) || pick(active);
  }

  pickFinalSprinter(active) {
    const ranking = this.getRanking();
    const items = active.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const canFlip = rankIndex >= 1 && rankIndex <= 4 ? 0.28 : 0;
      return { value: racer, weight: 0.28 + racer.stats.burst * 0.75 + racer.stats.luck * 0.22 + canFlip };
    });
    return weightedPick(items) || pick(active);
  }

  findClosePair() {
    const active = this.racers.filter((r) => r.finishedAt === null);
    let best = null;
    for (const behind of active) {
      for (const front of active) {
        if (behind.id === front.id) continue;
        const gap = front.progress - behind.progress;
        const laneGap = Math.abs(front.lane - behind.lane);
        if (gap > 0 && gap < 0.026 && laneGap <= 2) {
          const score = (0.026 - gap) + (2 - laneGap) * 0.003;
          if (!best || score > best.score) best = { behind, front, score };
        }
      }
    }
    return best;
  }

  findSlipstreamTarget() {
    const pair = this.findClosePair();
    if (!pair) return null;
    if (Math.random() < 0.25 + pair.behind.stats.luck * 0.35) return pair.behind;
    return null;
  }

  findShortcutCandidate() {
    const active = this.racers.filter((r) => r.finishedAt === null && !r.usedShortcut && !r.inShortcut);
    const zone = active.filter((r) => r.progress > 0.34 && r.progress < 0.66);
    if (!zone.length) return null;
    const ranking = this.getRanking();
    const items = zone.map((racer) => {
      const rankIndex = ranking.findIndex((item) => item.id === racer.id);
      const behindNeed = rankIndex >= 2 ? 0.22 : 0;
      return {
        value: racer,
        weight: racer.stats.courage * 0.75 + racer.stats.luck * 0.25 + behindNeed - (rankIndex === 0 ? 0.18 : 0)
      };
    });
    const candidate = weightedPick(items);
    if (!candidate) return null;
    const chance = 0.18 + candidate.stats.courage * 0.34 + candidate.stats.luck * 0.12;
    return Math.random() < chance ? candidate : null;
  }

  findCurveCandidate() {
    const active = this.racers.filter((r) => r.finishedAt === null);
    const inCurve = active.filter((r) => this.isInCurve(r.progress));
    if (!inCurve.length) return null;
    const items = inCurve.map((racer) => ({
      value: racer,
      weight: 0.18 + (1 - racer.stats.stability) * 0.9 + (1 - racer.stats.luck) * 0.24
    }));
    return weightedPick(items);
  }

  isInCurve(progress) {
    const p = progress % 1;
    return (p > 0.08 && p < 0.32) || (p > 0.58 && p < 0.82);
  }

  applyEvent(type, racer, extra = null) {
    if (!racer || racer.finishedAt !== null) return;
    racer.eventCooldownUntil = this.elapsed + 2.0;
    racer.eventHistory.push({ type, at: this.elapsed });

    switch (type) {
      case 'headwind':
        this.addEffect(racer, 'headwind', 0.76, 1.65);
        break;
      case 'tailwind':
        this.addEffect(racer, 'tailwind', 1.14 + racer.stats.luck * 0.04, 1.75);
        break;
      case 'stumble': {
        const recover = Math.random() < racer.stats.luck * 0.32;
        this.addEffect(racer, 'stumble', recover ? 0.72 : 0.5, recover ? 1.15 : 1.45);
        break;
      }
      case 'slideTurn':
        this.addEffect(racer, 'slideTurn', 0.62 + racer.stats.stability * 0.18, 1.35);
        break;
      case 'block':
        this.addEffect(racer, 'block', 0.68, 1.25);
        if (extra?.front) this.addEffect(extra.front, 'pressure', 0.94, 1.0);
        break;
      case 'bump':
        this.addEffect(racer, 'bump', 0.82, 1.15);
        if (extra?.front) this.addEffect(extra.front, 'bump', 0.88, 1.05);
        break;
      case 'shortcutEnter':
        racer.usedShortcut = true;
        racer.inShortcut = true;
        racer.shortcutResolveAt = this.elapsed + 2.0;
        this.addEffect(racer, 'shortcutEnter', 1.06, 1.2);
        break;
      case 'shortcutSuccess':
        racer.inShortcut = false;
        racer.progress = Math.min(0.996, racer.progress + this.map.shortcutGain + racer.stats.luck * 0.018);
        this.addEffect(racer, 'shortcutSuccess', 1.13, 1.45);
        break;
      case 'shortcutFail':
        racer.inShortcut = false;
        this.addEffect(racer, 'shortcutFail', 0.48, 1.65);
        break;
      case 'slipstream':
        this.addEffect(racer, 'slipstream', 1.13 + racer.stats.luck * 0.03, 1.35);
        break;
      case 'finalSprint':
        this.addEffect(racer, 'finalSprint', 1.13 + racer.stats.burst * 0.18, 2.15);
        break;
      default:
        break;
    }

    this.showBubble(racer, type);
    this.onEvent?.({ type, racer, comment: formatComment(type, racer) });
  }

  addEffect(racer, type, multiplier, duration) {
    racer.effects.push({
      type,
      multiplier,
      until: this.elapsed + Math.max(GAME_CONFIG.bubbleMinTime, duration)
    });
  }

  showBubble(racer, type) {
    racer.bubble = {
      text: EVENT_BUBBLES[type] || type,
      type,
      until: this.elapsed + Math.max(GAME_CONFIG.bubbleMinTime, 1.25)
    };
  }

  resolveShortcutEvents() {
    for (const racer of this.racers) {
      if (!racer.inShortcut || this.elapsed < racer.shortcutResolveAt) continue;
      const successChance = clamp(
        0.38 + racer.stats.luck * 0.3 + racer.stats.stability * 0.18 - this.map.shortcutRisk * 0.28,
        0.24,
        0.78
      );
      this.applyEvent(Math.random() < successChance ? 'shortcutSuccess' : 'shortcutFail', racer);
    }
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
      this.finished = true;
      this.running = false;
      this.onFinish?.(this.getResults());
      return;
    }

    if (timeExpired) {
      this.finished = true;
      this.running = false;
      this.onFinish?.(this.getResults());
    }
  }

  getResults() {
    const ranking = this.getRanking();
    return ranking.map((racer, index) => ({
      rank: index + 1,
      name: racer.name,
      animal: racer.animal,
      progress: racer.progress,
      finishedAt: racer.finishedAt,
      isTieWinner: this.tieIds.includes(racer.id) && racer.finishedAt !== null
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
      playAgainBigBtn: qs('#playAgainBigBtn')
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
    this.trackBox = null;

    this.init();
  }

  init() {
    this.populateMaps();
    this.bindEvents();
    this.syncDuration(GAME_CONFIG.defaultDuration);
    this.preparePreview();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animationId = requestAnimationFrame((time) => this.loop(time));
  }

  populateMaps() {
    this.dom.mapSelect.innerHTML = MAP_DATA.map((map) => `<option value="${map.id}">${map.name}</option>`).join('');
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
    this.dom.playAgainBigBtn.addEventListener('click', () => {
      this.hideResults();
      this.startRace();
    });
    this.dom.closeResultBtn.addEventListener('click', () => this.hideResults());
    this.dom.randomMapBtn.addEventListener('click', () => {
      const current = this.dom.mapSelect.value;
      const options = MAP_DATA.filter((map) => map.id !== current);
      this.dom.mapSelect.value = pick(options).id;
      this.preparePreview();
    });
    this.dom.resetBtn.addEventListener('click', () => {
      this.dom.playerNames.value = '';
      this.resetRaceState();
      this.drawEmptyState();
    });
  }

  syncDuration(value) {
    const duration = clamp(Number.isFinite(value) ? value : GAME_CONFIG.defaultDuration, GAME_CONFIG.minDuration, GAME_CONFIG.maxDuration);
    this.dom.durationRange.value = duration;
    this.dom.durationNumber.value = duration;
    this.dom.durationLabel.textContent = `${duration} giây`;
    this.dom.timerText.textContent = `${duration.toFixed(1)}s`;
  }

  getSelectedMap() {
    return MAP_DATA.find((map) => map.id === this.dom.mapSelect.value) || MAP_DATA[0];
  }

  getDuration() {
    return clamp(Number(this.dom.durationRange.value), GAME_CONFIG.minDuration, GAME_CONFIG.maxDuration);
  }

  preparePreview() {
    const names = parseNames(this.dom.playerNames.value);
    const map = this.getSelectedMap();
    this.dom.raceTitle.textContent = map.name;
    this.dom.raceMeta.textContent = map.description;

    if (this.engine?.running) return;

    if (names.length >= GAME_CONFIG.minPlayers) {
      this.engine = new RaceEngine({
        names,
        duration: this.getDuration(),
        map,
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
    this.engine = new RaceEngine({
      names,
      duration,
      map,
      onEvent: (event) => this.handleEngineEvent(event),
      onFinish: (results) => this.finishRace(results)
    });
    this.engine.start();
    this.lastFrameTime = performance.now();
    this.rankingSignature = '';
    this.dom.startBtn.disabled = true;
    this.dom.replayBtn.disabled = true;
    this.dom.timerText.textContent = `${duration.toFixed(1)}s`;
    this.showComment('Cuộc đua bắt đầu! Các tay đua đang tăng tốc khỏi vạch xuất phát.');
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
    const winners = results.filter((r) => r.finishedAt !== null);
    if (winners.length >= 2 && Math.abs(winners[0].finishedAt - winners[1].finishedAt) < 0.12) {
      this.showComment(`${winners[0].name} và ${winners[1].name} gần như chạm đích đồng thời!`);
    } else if (winners[0]) {
      this.showComment(`${winners[0].name} đã chạm vạch đích đầu tiên!`);
    } else {
      this.showComment('Hết giờ! Bảng xếp hạng được tính theo vị trí hiện tại.');
    }
    this.spawnConfetti();
    this.showResults(results.slice(0, 3));
  }

  showResults(top3) {
    this.dom.podium.innerHTML = top3.map((item, index) => {
      const label = item.finishedAt !== null ? `${round1(item.finishedAt)}s` : `${Math.round(item.progress * 100)}%`;
      const tieText = item.isTieWinner ? ' · đồng thời' : '';
      return `
        <div class="podium-item">
          <div class="podium-rank">#${index + 1}</div>
          <div class="podium-name">
            <strong>${this.escapeHtml(item.name)} ${item.animal.emoji}</strong>
            <span>${this.escapeHtml(item.animal.label)}${tieText}</span>
          </div>
          <div class="podium-time">${label}</div>
        </div>
      `;
    }).join('');
    this.dom.resultOverlay.hidden = false;
  }

  hideResults() {
    this.dom.resultOverlay.hidden = true;
  }

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
            <strong>${this.escapeHtml(racer.name)} ${racer.animal.emoji}</strong>
            <span>${this.escapeHtml(racer.animal.label)} · Làn ${racer.lane + 1}</span>
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
    return {
      width: Number(this.dom.canvas.dataset.cssWidth || this.dom.canvas.width),
      height: Number(this.dom.canvas.dataset.cssHeight || this.dom.canvas.height)
    };
  }

  drawEmptyState() {
    const { width, height } = this.getCanvasSize();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    this.drawMintBackground(ctx, width, height);
    ctx.fillStyle = '#12372A';
    ctx.font = '900 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nhập ít nhất 2 người chơi để dựng làn đua', width / 2, height / 2 - 8);
    ctx.fillStyle = '#4B635B';
    ctx.font = '700 16px system-ui, sans-serif';
    ctx.fillText('Mỗi người sẽ có một đường riêng, tối đa 12 làn.', width / 2, height / 2 + 24);
  }

  drawRace() {
    if (!this.ctx) return;
    const { width, height } = this.getCanvasSize();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    this.drawMintBackground(ctx, width, height);

    const laneCount = this.engine?.racers.length || Math.max(GAME_CONFIG.minPlayers, parseNames(this.dom.playerNames.value).length || 6);
    const map = this.engine?.map || this.getSelectedMap();
    this.trackBox = this.drawAthleticTrack(ctx, width, height, laneCount, map);

    if (this.engine) {
      this.drawRacers(ctx, this.engine.racers, this.trackBox);
    }
    this.drawConfetti(ctx);
  }

  drawMintBackground(ctx, width, height) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#D6FFEF');
    grad.addColorStop(1, '#B8F0D9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 22; i += 1) {
      const x = (i * 97 + 40) % width;
      const y = (i * 61 + 33) % height;
      const r = 4 + (i % 5) * 4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawAthleticTrack(ctx, width, height, laneCount, map) {
    const outerRx = width * 0.42;
    const outerRy = Math.min(height * 0.34, width * 0.23);
    const innerRx = outerRx * 0.44;
    const innerRy = outerRy * 0.38;
    const cx = width / 2;
    const cy = height / 2 + height * 0.03;
    const lanes = clamp(laneCount, 2, GAME_CONFIG.maxPlayers);

    ctx.save();
    ctx.shadowColor = 'rgba(18, 55, 42, 0.28)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 12;
    this.drawEllipse(ctx, cx, cy, outerRx, outerRy);
    ctx.fillStyle = map.trackDark;
    ctx.fill();
    ctx.restore();

    ctx.save();
    this.drawEllipse(ctx, cx, cy, outerRx, outerRy);
    this.drawEllipse(ctx, cx, cy, innerRx, innerRy, true);
    ctx.fillStyle = map.trackColor;
    ctx.fill('evenodd');
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    this.drawEllipse(ctx, cx, cy, outerRx * 0.96, outerRy * 0.92);
    this.drawEllipse(ctx, cx, cy, innerRx * 1.05, innerRy * 1.08, true);
    ctx.fillStyle = map.trackLight;
    ctx.fill('evenodd');
    ctx.restore();

    // Co san o giua de giong san dien kinh.
    ctx.save();
    this.drawEllipse(ctx, cx, cy, innerRx * 0.96, innerRy * 0.9);
    const grass = ctx.createLinearGradient(cx - innerRx, cy - innerRy, cx + innerRx, cy + innerRy);
    grass.addColorStop(0, '#153B34');
    grass.addColorStop(1, '#276F55');
    ctx.fillStyle = grass;
    ctx.fill();
    ctx.restore();

    // Ke vach lan rieng. Neu nhieu nguoi thi tu dong sinh them lan.
    ctx.save();
    ctx.strokeStyle = '#EEF1FF';
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.92;
    for (let i = 0; i <= lanes; i += 1) {
      const t = i / lanes;
      const rx = innerRx + (outerRx - innerRx) * t;
      const ry = innerRy + (outerRy - innerRy) * t;
      this.drawEllipse(ctx, cx, cy, rx, ry);
      ctx.stroke();
    }
    ctx.restore();

    // Vach dich o phia duoi, racer phai cham vach nay moi co ket qua.
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(cx, cy + innerRy + 1);
    ctx.lineTo(cx, cy + outerRy - 1);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', cx + 45, cy + outerRy - 12);
    ctx.restore();

    // Ve nhanh tat bang duong vang dut net, chi la dau hieu thi giac cho mechanic.
    ctx.save();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([8, 7]);
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx + innerRx * 0.55, cy + innerRy * 0.72);
    ctx.bezierCurveTo(cx + outerRx * 0.72, cy + innerRy * 0.25, cx + outerRx * 0.68, cy - innerRy * 0.65, cx + innerRx * 0.42, cy - innerRy * 0.9);
    ctx.stroke();
    ctx.restore();

    // So lan o gan vach xuat phat.
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < lanes; i += 1) {
      const p = this.getLanePoint({ cx, cy, innerRx, innerRy, outerRx, outerRy, lanes }, i, 0.006);
      ctx.fillText(String(i + 1), p.x - 18, p.y + 4);
    }
    ctx.restore();

    return { cx, cy, outerRx, outerRy, innerRx, innerRy, lanes };
  }

  drawEllipse(ctx, cx, cy, rx, ry, reverse = false) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, reverse);
  }

  getLanePoint(track, laneIndex, progress) {
    const laneT = (laneIndex + 0.5) / track.lanes;
    const rx = track.innerRx + (track.outerRx - track.innerRx) * laneT;
    const ry = track.innerRy + (track.outerRy - track.innerRy) * laneT;
    const angle = Math.PI / 2 + progress * Math.PI * 2;
    return {
      x: track.cx + Math.cos(angle) * rx,
      y: track.cy + Math.sin(angle) * ry,
      angle,
      rx,
      ry
    };
  }

  drawRacers(ctx, racers, track) {
    const now = this.engine?.elapsed || 0;
    for (const racer of racers) {
      const p = this.getLanePoint(track, racer.lane, racer.progress + racer.laneOffset);
      racer.lastPosition = p;
      racer.trail.push({ x: p.x, y: p.y, at: now, sprint: this.hasEffect(racer, 'finalSprint') || this.hasEffect(racer, 'tailwind') || this.hasEffect(racer, 'shortcutSuccess') });
      racer.trail = racer.trail.filter((point) => now - point.at < 0.55);
      this.drawTrail(ctx, racer, now);
    }

    for (const racer of racers) {
      const p = racer.lastPosition;
      this.drawRacerToken(ctx, racer, p);
      if (racer.bubble && racer.bubble.until > now) {
        this.drawBubble(ctx, racer.bubble.text, p.x, p.y - 42, racer.bubble.until - now);
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
      const alpha = clamp(0.42 - age * 0.7, 0, 0.36);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = racer.animal.color;
      ctx.beginPath();
      ctx.ellipse(point.x, point.y, 12 + age * 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawRacerToken(ctx, racer, p) {
    const size = clamp(24 - this.engine.racers.length * 0.35, 18, 23);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 11, size * 0.75, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = racer.animal.color;
    ctx.stroke();

    ctx.font = `${Math.max(16, size * 1.05)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(racer.animal.emoji, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.font = '800 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const label = racer.name.length > 10 ? racer.name.slice(0, 10) + '…' : racer.name;
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(18,55,42,0.82)';
    this.roundRect(ctx, p.x - textWidth / 2 - 6, p.y + size + 2, textWidth + 12, 18, 9);
    ctx.fill();
    ctx.fillStyle = '#ECFFF7';
    ctx.fillText(label, p.x, p.y + size + 5);
    ctx.restore();
  }

  drawBubble(ctx, text, x, y, remaining) {
    ctx.save();
    const alpha = clamp(remaining / 0.25, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.font = '900 13px system-ui, sans-serif';
    const paddingX = 10;
    const width = Math.min(150, ctx.measureText(text).width + paddingX * 2);
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

/*
  Mint Duck Race Arena - Fairplay Race Engine
  Ghi chu: comment trong code dung tieng Viet khong dau de anh de sua ve sau.
*/

'use strict';

const GAME_CONFIG = {
  minPlayers: 2,
  maxPlayers: 12,
  defaultDuration: 30,
  minDuration: 15,
  maxDuration: 90,
  eventMinGap: 2.8,
  eventMaxGap: 4.8,
  commentMinVisibleMs: 2200,
  bubbleMinTime: 2.0,
  visualMinTime: 2.2,
  racerEventCooldown: 3.8,
  tieRate: 0.15,
  maxTieWinners: 2,
  endAfterFirstFinish: true,
  rampProgressMin: 0.20,
  rampProgressMax: 0.78,
  rampTriggerWindow: 0.006,
  rampMinGain: 0.018,
  rampMaxGain: 0.062
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
    description: 'Đường xanh tím tách làn, có bệ bật nhảy ngẫu nhiên trên từng lane.',
    trackColor: '#6F71B0',
    trackLight: '#8588C5',
    trackDark: '#34345D',
    curveDifficulty: 0.88,
    windRisk: 0.42,
    rampPower: 1.0
  },
  {
    id: 'ocean-violet',
    name: 'Sân Ocean Violet',
    description: 'Nền xanh tím đậm hơn, gió xuôi mạnh nhưng cua dễ trượt.',
    trackColor: '#6572BD',
    trackLight: '#93A4EA',
    trackDark: '#2C356A',
    curveDifficulty: 0.96,
    windRisk: 0.48,
    rampPower: 1.06
  },
  {
    id: 'bamboo-cup',
    name: 'Bamboo Cup',
    description: 'Đường dễ xem, bệ nhảy vừa phải, ít lốc xoáy hơn.',
    trackColor: '#64A98C',
    trackLight: '#94D3B4',
    trackDark: '#23634D',
    curveDifficulty: 0.76,
    windRisk: 0.32,
    rampPower: 0.92
  },
  {
    id: 'sunny-loop',
    name: 'Sunny Loop',
    description: 'Cuối chặng dễ bứt tốc, thích hợp trận ngắn 15-30 giây.',
    trackColor: '#7B79C9',
    trackLight: '#A7A5F0',
    trackDark: '#403C88',
    curveDifficulty: 0.9,
    windRisk: 0.38,
    rampPower: 1.0
  },
  {
    id: 'stormy-mint',
    name: 'Stormy Mint',
    description: 'Gió và lốc nhiều hơn, bệ bật nhảy lợi hơn nhưng dễ lỗi nhịp.',
    trackColor: '#5B68A8',
    trackLight: '#8E9BE0',
    trackDark: '#2F385F',
    curveDifficulty: 1.0,
    windRisk: 0.62,
    rampPower: 1.14
  }
];

const EVENT_COMMENTS = {
  headwind: '{name} gặp gió ngược, tốc độ giảm thấy rõ!',
  tailwind: '{name} gặp gió xuôi, nhịp chạy đang nhẹ hơn!',
  stumble: '{name} vấp phải đá và khựng lại một nhịp!',
  slideTurn: '{name} gặp lốc xoáy ở cua, mất thăng bằng nhẹ!',
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
    this.lastEventRacerId = null;
    this.visualEvents = [];
    this.tieMode = false;
    this.tieIds = [];
    this.racers = this.createRacers(names);
    this.assignFairFinishTimes();
    this.assignFairJumpPads();
  }

  createRacers(names) {
    const animals = shuffle(ANIMAL_DATA);
    return names.map((name, index) => {
      const animal = animals[index % animals.length];
      return {
        id: `racer-${index}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        index,
        lane: index,
        name,
        animal,
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
        laneOffset: rand(-0.003, 0.003),
        jumpPad: null,
        eventHistory: []
      };
    });
  }

  assignFairFinishTimes() {
    // Thuat toan fair play: moi tay dua co target pace an dua tren chi so + nhieu nho.
    // Su kien chi lam lech nhip trong gioi han, khong buff lo lieu mot nguoi.
    const ranked = this.racers
      .map((racer) => {
        const s = racer.stats;
        const score =
          s.baseSpeed * 0.38 +
          s.burst * 0.22 +
          s.stability * 0.15 +
          s.luck * 0.15 +
          s.courage * 0.10 +
          rand(-0.075, 0.075);
        return { racer, score };
      })
      .sort((a, b) => b.score - a.score);

    this.tieMode = this.racers.length >= 3 && Math.random() < GAME_CONFIG.tieRate;
    const winnerTime = this.duration * rand(0.88, 0.96);

    ranked.forEach((entry, rankIndex) => {
      const spread = rankIndex === 0 ? 0 : rand(0.025, 0.07) * rankIndex;
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
    // Moi racer co dung 1 be bat nhay rieng trong lane cua minh.
    // Vi tri moi van deu random, nhung so luong la cong bang: khong ai co 2 be, khong ai bi thieu.
    const count = this.racers.length;
    const slots = shuffle(this.racers.map((_, index) => index));
    this.racers.forEach((racer, order) => {
      const base = GAME_CONFIG.rampProgressMin + ((slots[order] + 0.5) / count) * (GAME_CONFIG.rampProgressMax - GAME_CONFIG.rampProgressMin);
      const jitter = rand(-0.035, 0.035);
      racer.jumpPad = {
        progress: clamp(base + jitter, GAME_CONFIG.rampProgressMin, GAME_CONFIG.rampProgressMax),
        used: false,
        activeUntil: 0,
        result: 'ready'
      };
    });
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
    this.visualEvents = this.visualEvents.filter((event) => event.until > this.elapsed);

    this.updateRacers(dt);
    this.checkJumpPadCollisions();
    this.handleScheduledEvent();
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
      if (racer.hardPauseUntil > this.elapsed) {
        // Vấp đá phải thấy khựng thật: 1 giay dau khong cong tien do.
        continue;
      }

      const effectMult = racer.effects.reduce((mult, effect) => mult * effect.multiplier, 1);
      const gapFromLeader = Math.max(0, leaderProgress - racer.progress);
      const isLeader = ranking[0]?.id === racer.id;

      // Rubber-band rat nhe de khong bo xa qua som, nhung gioi han thap de khong lo gian lan.
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
      const crossed = racer.progress >= pad.progress - GAME_CONFIG.rampTriggerWindow;
      if (!crossed) continue;

      pad.used = true;
      pad.activeUntil = this.elapsed + GAME_CONFIG.visualMinTime;

      const successChance = clamp(0.45 + racer.stats.courage * 0.18 + racer.stats.luck * 0.24 + racer.stats.stability * 0.13, 0.38, 0.88);
      const success = Math.random() < successChance;
      const jumpPower = clamp(
        GAME_CONFIG.rampMinGain + (racer.stats.burst * 0.020 + racer.stats.courage * 0.014 + racer.stats.luck * 0.010) * this.map.rampPower,
        GAME_CONFIG.rampMinGain,
        GAME_CONFIG.rampMaxGain
      );

      if (success) {
        pad.result = 'success';
        racer.progress = Math.min(0.996, racer.progress + jumpPower);
        this.addEffect(racer, 'jumpSuccess', 1.05 + racer.stats.burst * 0.05, 1.35);
        this.applyEvent('jumpSuccess', racer, { ignoreCooldown: true, noExtraEffect: true });
      } else {
        pad.result = 'fail';
        racer.hardPauseUntil = Math.max(racer.hardPauseUntil, this.elapsed + 0.55);
        this.addEffect(racer, 'jumpFail', 0.70, 1.45);
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
    choices.push({ value: { type: 'headwind', racer: this.pickVulnerableRacer(pool) }, weight: 0.8 + this.map.windRisk * 0.35 });
    choices.push({ value: { type: 'tailwind', racer: this.pickGoodEventRacer(pool) }, weight: 0.9 });
    choices.push({ value: { type: 'stumble', racer: this.pickStumbleRacer(pool) }, weight: 0.75 });
    choices.push({ value: { type: 'slideTurn', racer: curveTarget }, weight: curveTarget ? 0.62 * this.map.curveDifficulty : 0 });
    choices.push({ value: { type: 'block', racer: closePair?.behind, extra: closePair }, weight: closePair ? 0.7 : 0 });
    choices.push({ value: { type: 'bump', racer: closePair?.behind, extra: closePair }, weight: closePair ? 0.55 : 0 });
    choices.push({ value: { type: 'slipstream', racer: slipstreamTarget }, weight: slipstreamTarget ? 0.7 : 0 });
    choices.push({ value: { type: 'finalSprint', racer: this.pickFinalSprinter(pool) }, weight: raceFactor > 0.8 ? 2.0 : 0.05 });

    const picked = weightedPick(choices);
    if (!picked || !picked.racer) return null;
    return picked;
  }

  fairnessWeight(racer) {
    // Ai vua duoc/chiu nhieu su kien thi giam xac suat tiep theo de nhin cong bang hon.
    return 1 / (1 + racer.eventCount * 0.38);
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
      return {
        value: racer,
        weight: (0.25 + racer.stats.luck * 0.28 + racer.stats.burst * 0.22 + trailingBoost + leaderPenalty) * this.fairnessWeight(racer)
      };
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
        if (gap > 0 && gap < 0.024 && laneGap <= 2) {
          const score = (0.024 - gap) + (2 - laneGap) * 0.002;
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
    const items = inCurve.map((racer) => ({
      value: racer,
      weight: (0.15 + (1 - racer.stats.stability) * 0.85 + (1 - racer.stats.luck) * 0.20) * this.fairnessWeight(racer)
    }));
    return weightedPick(items);
  }

  isInCurve(progress) {
    const p = progress % 1;
    return (p > 0.08 && p < 0.32) || (p > 0.58 && p < 0.82);
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
          this.addEffect(racer, 'headwind', 0.74, 2.1);
          break;
        case 'tailwind':
          this.addEffect(racer, 'tailwind', 1.08 + racer.stats.luck * 0.035, 2.05);
          break;
        case 'stumble': {
          const recover = Math.random() < racer.stats.luck * 0.32;
          racer.hardPauseUntil = Math.max(racer.hardPauseUntil, this.elapsed + 1.0);
          this.addEffect(racer, 'stumble', recover ? 0.72 : 0.58, 1.7);
          break;
        }
        case 'slideTurn':
          this.addEffect(racer, 'slideTurn', 0.66 + racer.stats.stability * 0.14, 1.8);
          break;
        case 'block':
          this.addEffect(racer, 'block', 0.76, 1.7);
          if (extra?.front) this.addEffect(extra.front, 'pressure', 0.96, 1.2);
          break;
        case 'bump':
          this.addEffect(racer, 'bump', 0.82, 1.45);
          if (extra?.front) this.addEffect(extra.front, 'bump', 0.90, 1.25);
          break;
        case 'slipstream':
          this.addEffect(racer, 'slipstream', 1.09 + racer.stats.luck * 0.025, 1.75);
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
      until: this.elapsed + Math.max(GAME_CONFIG.bubbleMinTime, 2.0)
    };
  }

  createVisualEvent(type, racer) {
    let visualType = null;
    if (type === 'headwind') visualType = 'tornado';
    if (type === 'tailwind') visualType = 'wind';
    if (type === 'slideTurn') visualType = 'tornado';
    if (type === 'stumble') visualType = 'rock';
    if (type === 'jumpSuccess' || type === 'jumpFail') visualType = 'rampBurst';
    if (type === 'finalSprint') visualType = 'speed';
    if (!visualType) return;

    this.visualEvents.push({
      type: visualType,
      lane: racer.lane,
      progress: racer.progress,
      racerId: racer.id,
      createdAt: this.elapsed,
      until: this.elapsed + GAME_CONFIG.visualMinTime,
      success: type === 'jumpSuccess'
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
      // Truong hop hiem do su kien lam cham qua muc: dam bao co nguoi cham vach dich theo yeu cau thoi gian.
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
    const ranking = this.getRanking();
    return ranking.map((racer) => ({
      id: racer.id,
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
    this.showComment('Cuộc đua bắt đầu! Mỗi tay đua có một làn và một bệ bật nhảy riêng.');
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
      this.showComment(`${firstGroup.items[0].name} và ${firstGroup.items[1].name} cùng chạm vạch đích ở hạng 1!`);
    } else if (firstGroup?.items[0]?.finishedAt !== null) {
      this.showComment(`${firstGroup.items[0].name} đã chạm vạch đích đầu tiên!`);
    } else {
      this.showComment('Hết giờ! Hạng 1 được tính cho người đã chạm vạch hoặc tiến gần vạch nhất.');
    }
    this.spawnConfetti();
    this.showResults(groups.slice(0, 3));
  }

  buildResultGroups(results) {
    const groups = [];
    const sorted = results.slice();
    for (const item of sorted) {
      const last = groups[groups.length - 1];
      const canTieFirst = groups.length === 1 && last.items.length < GAME_CONFIG.maxTieWinners;
      const closeFinish = last && item.finishedAt !== null && last.items[0].finishedAt !== null && Math.abs(item.finishedAt - last.items[0].finishedAt) <= 0.16;
      if (canTieFirst && closeFinish) {
        last.items.push(item);
      } else {
        groups.push({ rank: groups.length + 1, items: [item] });
      }
      if (groups.length >= 3 && groups[groups.length - 1].items.length >= 1) {
        // Lay du 3 nhom hang la du cho overlay.
        continue;
      }
    }
    return groups.slice(0, 3).map((group, index) => ({ ...group, rank: index + 1 }));
  }

  showResults(groups) {
    this.dom.podium.innerHTML = groups.map((group) => {
      const names = group.items.map((item) => `${this.escapeHtml(item.name)} ${item.animal.emoji}`).join(', ');
      const progressLabel = group.items.map((item) => {
        if (item.finishedAt !== null) return `${round1(item.finishedAt)}s`;
        return `${Math.round(item.progress * 100)}% chặng đua`;
      }).join(' · ');
      const subLabel = group.items.length > 1 ? 'Đồng hạng 1' : this.escapeHtml(group.items[0].animal.label);
      return `
        <div class="podium-item">
          <div class="podium-rank">${group.rank}</div>
          <div class="podium-name">
            <strong>Hạng ${group.rank}: ${names}</strong>
            <span>${subLabel}</span>
          </div>
          <div class="podium-time">${progressLabel}</div>
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
    ctx.fillText('Mỗi người có một làn và một bệ bật nhảy riêng.', width / 2, height / 2 + 24);
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
      this.drawJumpPads(ctx, this.engine.racers, this.trackBox);
      this.drawVisualEvents(ctx, this.engine.visualEvents, this.trackBox);
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

    ctx.save();
    this.drawEllipse(ctx, cx, cy, innerRx * 0.96, innerRy * 0.9);
    const grass = ctx.createLinearGradient(cx - innerRx, cy - innerRy, cx + innerRx, cy + innerRy);
    grass.addColorStop(0, '#153B34');
    grass.addColorStop(1, '#276F55');
    ctx.fillStyle = grass;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#EEF1FF';
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.95;
    for (let i = 0; i <= lanes; i += 1) {
      const t = i / lanes;
      const rx = innerRx + (outerRx - innerRx) * t;
      const ry = innerRy + (outerRy - innerRy) * t;
      this.drawEllipse(ctx, cx, cy, rx, ry);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy + innerRy + 1);
    ctx.lineTo(cx, cy + outerRy - 1);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', cx + 45, cy + outerRy - 12);
    ctx.restore();

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

  drawJumpPads(ctx, racers, track) {
    for (const racer of racers) {
      if (!racer.jumpPad) continue;
      const p = this.getLanePoint(track, racer.lane, racer.jumpPad.progress);
      const active = racer.jumpPad.activeUntil > (this.engine?.elapsed || 0);
      this.drawRamp(ctx, p.x, p.y, p.angle, active, racer.jumpPad.result);
    }
  }

  drawRamp(ctx, x, y, angle, active, result) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = active ? 16 : 6;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = result === 'fail' ? '#FB7185' : '#2F54D4';
    ctx.beginPath();
    ctx.moveTo(-15, 9);
    ctx.lineTo(18, 4);
    ctx.lineTo(16, -7);
    ctx.lineTo(-18, -3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D8F3FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = active ? '#FACC15' : '#9FE8FF';
    ctx.lineWidth = 2;
    for (let i = -9; i <= 9; i += 9) {
      ctx.beginPath();
      ctx.moveTo(i, 7);
      ctx.bezierCurveTo(i - 3, 0, i + 3, -1, i, -7);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawVisualEvents(ctx, events, track) {
    const now = this.engine?.elapsed || 0;
    for (const event of events) {
      const p = this.getLanePoint(track, event.lane, event.progress);
      const age = now - event.createdAt;
      const remaining = event.until - now;
      const alpha = clamp(Math.min(age / 0.22, remaining / 0.35), 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      if (event.type === 'tornado') this.drawTornado(ctx, p.x, p.y, age);
      if (event.type === 'wind') this.drawWind(ctx, p.x, p.y, age);
      if (event.type === 'rock') this.drawRock(ctx, p.x + 10, p.y + 2);
      if (event.type === 'rampBurst') this.drawRampBurst(ctx, p.x, p.y, age, event.success);
      if (event.type === 'speed') this.drawSpeedBurst(ctx, p.x, p.y, age);
      ctx.restore();
    }
  }

  drawTornado(ctx, x, y, age) {
    ctx.save();
    ctx.translate(x, y - 18);
    ctx.rotate(age * 2.4);
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

  drawWind(ctx, x, y, age) {
    ctx.save();
    ctx.translate(x - 30, y - 8);
    ctx.strokeStyle = '#E6FCFF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i += 1) {
      const offset = ((age * 38 + i * 18) % 42) - 20;
      ctx.beginPath();
      ctx.moveTo(offset, i * 9);
      ctx.bezierCurveTo(offset + 20, i * 9 - 8, offset + 38, i * 9 + 8, offset + 62, i * 9);
      ctx.stroke();
    }
    ctx.strokeStyle = '#45E0E0';
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
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(4, -11);
    ctx.lineTo(0, -4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawRampBurst(ctx, x, y, age, success) {
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
      ctx.moveTo(-32 - i * 8 - age * 20, -10 + i * 5);
      ctx.lineTo(-10 - i * 3, -8 + i * 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawRacers(ctx, racers, track) {
    const now = this.engine?.elapsed || 0;
    for (const racer of racers) {
      const p = this.getLanePoint(track, racer.lane, racer.progress + racer.laneOffset);
      racer.lastPosition = p;
      racer.trail.push({
        x: p.x,
        y: p.y,
        at: now,
        sprint: this.hasEffect(racer, 'finalSprint') || this.hasEffect(racer, 'tailwind') || this.hasEffect(racer, 'jumpSuccess')
      });
      racer.trail = racer.trail.filter((point) => now - point.at < 0.55);
      this.drawTrail(ctx, racer, now);
    }

    for (const racer of racers) {
      const p = racer.lastPosition;
      this.drawRacerToken(ctx, racer, p);
      if (racer.bubble && racer.bubble.until > now) {
        this.drawBubble(ctx, racer.bubble.text, p.x, p.y - 46, racer.bubble.until - now);
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
    const paused = racer.hardPauseUntil > this.engine.elapsed;
    const wobble = this.hasEffect(racer, 'slideTurn') || this.hasEffect(racer, 'bump') || paused;
    ctx.save();
    ctx.translate(p.x, p.y);
    if (wobble) ctx.rotate(Math.sin(this.engine.elapsed * 18 + racer.index) * 0.18);
    if (paused) ctx.scale(1.12, 0.86);

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 11, size * 0.75, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = paused ? '#FB7185' : racer.animal.color;
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
    const alpha = clamp(Math.min(1, remaining / 0.35), 0, 1);
    ctx.globalAlpha = alpha;
    ctx.font = '900 13px system-ui, sans-serif';
    const paddingX = 10;
    const width = Math.min(160, ctx.measureText(text).width + paddingX * 2);
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

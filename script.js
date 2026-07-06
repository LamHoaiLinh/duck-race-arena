'use strict';

/*
  Mint Duck Race Arena - Race Engine
  Ghi chu: comment trong file JS dung tieng Viet khong dau de de doc va de sua.
  Toan bo trang thai game chi nam trong RAM cua trinh duyet.
*/

const TRACK_STYLE = {
  trackMain: '#6F71B0',
  trackDark: '#3A3761',
  trackLine: '#EAECF8',
  trackHighlight: '#AFB2D3',
  grass: '#2C4A36',
  grassLight: '#5D7C5B',
  shortcut: '#FACC15',
  danger: '#FB7185',
  boost: '#34D399',
  text: '#12372A'
};

const ANIMAL_DATA = [
  { id: 'brave-duck', label: 'Vịt vàng gan dạ', emoji: '🦆', color: '#FACC15' },
  { id: 'elegant-duck', label: 'Vịt trắng quý phái', emoji: '🦢', color: '#F8FAFC' },
  { id: 'funny-duck', label: 'Vịt nâu hài hước', emoji: '🦆', color: '#B7791F' },
  { id: 'lucky-duck', label: 'Vịt xanh may mắn', emoji: '🦆', color: '#34D399' },
  { id: 'sporty-duck', label: 'Vịt xanh thể thao', emoji: '🦆', color: '#60A5FA' },
  { id: 'cheerful-duck', label: 'Vịt hồng vui vẻ', emoji: '🦆', color: '#FB7185' },
  { id: 'ninja-duck', label: 'Vịt ninja', emoji: '🦆', color: '#111827' },
  { id: 'fast-duck', label: 'Vịt cam tốc độ', emoji: '🦆', color: '#FB923C' },
  { id: 'frog', label: 'Ếch xanh bật nhảy', emoji: '🐸', color: '#86EFAC' },
  { id: 'turtle', label: 'Rùa lì đòn', emoji: '🐢', color: '#65A30D' },
  { id: 'rabbit', label: 'Thỏ nhanh nhảu', emoji: '🐰', color: '#FDE68A' },
  { id: 'penguin', label: 'Cánh cụt lướt băng', emoji: '🐧', color: '#1F2937' }
];

const MAP_DATA = [
  {
    id: 'mint-stadium',
    name: 'Sân Mint Violet',
    subtitle: 'Màu đường đua xanh tím, vạch trắng rõ như sân điền kinh.',
    shortcut: { start: 0.20, end: 0.36, reward: 0.055, risk: 0.42, duration: 1.55 },
    narrowZones: [{ start: 0.18, end: 0.23 }, { start: 0.63, end: 0.70 }],
    curveZones: [{ start: 0.08, end: 0.34 }, { start: 0.58, end: 0.84 }],
    eventBias: { headwind: 1.0, tailwind: 1.0, shortcut: 1.0 }
  },
  {
    id: 'lotus-lane',
    name: 'Làn Bèo May Rủi',
    subtitle: 'Đường tắt đi qua cụm bèo, lợi rõ nhưng dễ khựng lại.',
    shortcut: { start: 0.28, end: 0.47, reward: 0.070, risk: 0.55, duration: 1.85 },
    narrowZones: [{ start: 0.26, end: 0.32 }, { start: 0.44, end: 0.50 }],
    curveZones: [{ start: 0.10, end: 0.35 }, { start: 0.56, end: 0.86 }],
    eventBias: { headwind: 0.9, tailwind: 1.0, shortcut: 1.25 }
  },
  {
    id: 'windy-curve',
    name: 'Khúc Cua Gió Lùa',
    subtitle: 'Gió đảo chiều liên tục, cua dễ trượt nếu stability thấp.',
    shortcut: { start: 0.17, end: 0.31, reward: 0.052, risk: 0.50, duration: 1.65 },
    narrowZones: [{ start: 0.16, end: 0.22 }, { start: 0.73, end: 0.80 }],
    curveZones: [{ start: 0.05, end: 0.37 }, { start: 0.55, end: 0.88 }],
    eventBias: { headwind: 1.35, tailwind: 1.2, shortcut: 0.95 }
  },
  {
    id: 'golden-shortcut',
    name: 'Đường Tắt Vàng',
    subtitle: 'Nhánh tắt cực lời, nhưng chỉ người gan và may mới tận dụng tốt.',
    shortcut: { start: 0.34, end: 0.56, reward: 0.085, risk: 0.66, duration: 2.05 },
    narrowZones: [{ start: 0.32, end: 0.39 }, { start: 0.52, end: 0.58 }],
    curveZones: [{ start: 0.09, end: 0.35 }, { start: 0.60, end: 0.82 }],
    eventBias: { headwind: 0.95, tailwind: 0.95, shortcut: 1.5 }
  },
  {
    id: 'pressure-final',
    name: 'Cua Cuối Áp Lực',
    subtitle: 'Đoạn cuối dễ lật kèo, final sprint xuất hiện nhiều hơn.',
    shortcut: { start: 0.22, end: 0.40, reward: 0.060, risk: 0.48, duration: 1.75 },
    narrowZones: [{ start: 0.20, end: 0.25 }, { start: 0.82, end: 0.92 }],
    curveZones: [{ start: 0.07, end: 0.33 }, { start: 0.58, end: 0.92 }],
    eventBias: { headwind: 1.0, tailwind: 1.0, shortcut: 1.05, finalSprint: 1.35 }
  }
];

const EVENT_COMMENTS = {
  headwind: [
    '{name} gặp gió ngược, tốc độ giảm thấy rõ!',
    'Một luồng gió ngược kéo {name} chậm lại!',
    '{name} đang phải chống gió ngay giữa làn đua!'
  ],
  tailwind: [
    '{name} gặp gió xuôi và tăng tốc rất mượt!',
    'Gió xuôi đang đẩy {name} tiến lên!',
    '{name} được gió hỗ trợ, khoảng cách đang thu hẹp!'
  ],
  stumble: [
    '{name} vừa vấp nhẹ nhưng cố lấy lại nhịp!',
    '{name} mất trụ một nhịp, tốc độ tụt mạnh!',
    'Một cú vấp khiến {name} phải giảm tốc!'
  ],
  slideTurn: [
    '{name} trượt cua, phải ghìm tốc độ để giữ thăng bằng!',
    'Khúc cua làm {name} chao đảo nhẹ!',
    '{name} ôm cua hơi rộng và bị chậm lại!'
  ],
  block: [
    '{name} bị chắn đường ở đoạn hẹp!',
    '{name} bị kẹt sau đối thủ và mất nhịp!',
    'Đoạn hẹp làm {name} không thể vượt lên!'
  ],
  bump: [
    '{name} va chạm nhẹ, cả nhóm phía trước bị xáo trộn!',
    'Một pha chen lấn khiến {name} mất tốc độ!',
    '{name} bị tì vai nhẹ ở khu vực đông người!'
  ],
  shortcutEnter: [
    '{name} liều lĩnh lao vào đường tắt!',
    '{name} chọn nhánh tắt, quyết định rất mạo hiểm!',
    '{name} rẽ vào đường tắt để tìm cơ hội lật kèo!'
  ],
  shortcutSuccess: [
    '{name} thoát khỏi đường tắt và vươn lên mạnh mẽ!',
    '{name} vượt đường tắt thành công, lợi thế rất rõ!',
    'Nhánh tắt giúp {name} rút ngắn khoảng cách cực nhanh!'
  ],
  shortcutFail: [
    '{name} bị kẹt ở nhánh hẹp!',
    '{name} vấp ở đường tắt và mất lợi thế!',
    'Đường tắt phản tác dụng, {name} bị chậm đáng kể!'
  ],
  slipstream: [
    '{name} đang đu bám người phía trước để tăng tốc nhẹ!',
    '{name} núp gió rất khôn, tốc độ đang nhích lên!',
    '{name} áp sát phía sau và tận dụng slipstream!'
  ],
  finalSprint: [
    '{name} đang bứt tốc ở những giây cuối!',
    '{name} bung sức ở chặng cuối, cuộc đua nóng lên rồi!',
    '{name} tăng tốc mạnh, khả năng lật kèo đang xuất hiện!'
  ],
  escape: [
    '{name} suýt gặp sự cố nhưng may mắn thoát được!',
    '{name} loạng choạng nhẹ rồi hồi phục rất nhanh!',
    '{name} giữ thăng bằng kịp lúc, không mất nhiều tốc độ!'
  ]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(0, item.weight);
    if (roll <= 0) return item;
  }
  return items[items.length - 1] || null;
}

function normalizeProgressGap(a, b) {
  const gap = Math.abs(a - b);
  return Math.min(gap, 1 - gap);
}

function createHiddenStats(index) {
  // Sinh chi so an theo bien do vua phai de game can bang hon.
  const stat = () => clamp(randomBetween(0.28, 0.92), 0, 1);
  const baseSpeed = clamp(randomBetween(0.92, 1.08) + (Math.random() - 0.5) * 0.05, 0.86, 1.14);
  return {
    baseSpeed,
    burst: stat(),
    stability: stat(),
    luck: stat(),
    courage: stat(),
    laneTemper: randomBetween(0.96, 1.04),
    seedOffset: index * 0.001
  };
}

function formatName(raw, fallbackIndex) {
  const name = String(raw || '').trim().replace(/\s+/g, ' ');
  return name || `Người chơi ${fallbackIndex + 1}`;
}

class RaceEngine {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.players = options.players || [];
    this.durationSec = clamp(Number(options.durationSec) || 30, 15, 90);
    this.map = options.map || MAP_DATA[0];
    this.onCommentary = options.onCommentary || function () {};
    this.onRankChange = options.onRankChange || function () {};
    this.onTick = options.onTick || function () {};
    this.onFinish = options.onFinish || function () {};

    this.racers = [];
    this.elapsed = 0;
    this.running = false;
    this.finished = false;
    this.lastFrame = 0;
    this.nextEventAt = 0;
    this.animationId = 0;
    this.previousRankIds = [];
    this.confetti = [];
    this.tieEnabled = Math.random() < 0.15;
    this.tiePairIds = [];
    this.finishReason = '';

    this.resizeCanvasToDisplaySize();
    this.createRacers();
    this.scheduleNextEvent();
    this.render();
  }

  resizeCanvasToDisplaySize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(620, Math.floor(rect.width * dpr));
    const height = Math.max(420, Math.floor(rect.height * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.dpr = dpr;
  }

  createRacers() {
    const names = this.players.slice(0, 12).map(formatName);
    const shuffledAnimals = ANIMAL_DATA.slice().sort(() => Math.random() - 0.5);
    this.racers = names.map((name, index) => {
      const stats = createHiddenStats(index);
      const animal = shuffledAnimals[index % shuffledAnimals.length];
      return {
        id: `racer-${index}-${Date.now()}`,
        name,
        animal,
        lane: index,
        stats,
        progress: 0,
        lastProgress: 0,
        speedNow: 0,
        modifiers: [],
        bubble: null,
        rankPulseUntil: 0,
        shortcut: null,
        shortcutUsed: false,
        finalSprintUsed: false,
        eventLockUntil: 0,
        history: [],
        finishTime: null,
        sameFinishGroup: null
      };
    });

    if (this.tieEnabled && this.racers.length >= 2) {
      const shuffled = this.racers.slice().sort(() => Math.random() - 0.5);
      this.tiePairIds = [shuffled[0].id, shuffled[1].id];
    }

    this.previousRankIds = this.getRanking().map(r => r.id);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.finished = false;
    this.elapsed = 0;
    this.lastFrame = performance.now();
    this.scheduleNextEvent();
    this.say('Tiếng còi vang lên! Các tay đua bắt đầu tăng tốc!', 'start');
    this.loop(this.lastFrame);
  }

  stop() {
    this.running = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  loop(now) {
    if (!this.running) return;
    this.resizeCanvasToDisplaySize();
    const dt = clamp((now - this.lastFrame) / 1000, 0, 0.05);
    this.lastFrame = now;
    this.update(dt);
    this.render();
    this.animationId = requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.finished) return;
    this.elapsed += dt;
    const timeLeft = Math.max(0, this.durationSec - this.elapsed);

    for (const racer of this.racers) {
      racer.lastProgress = racer.progress;
      this.cleanupModifiers(racer);
      this.updateRacer(racer, dt);
      this.tryNaturalShortcut(racer);
      this.recordHistory(racer);
      if (racer.progress >= 1 && racer.finishTime === null) {
        racer.finishTime = this.elapsed;
      }
    }

    this.applyTieBalance(dt);
    this.checkRankChanges();

    if (this.elapsed >= this.nextEventAt && this.elapsed < this.durationSec) {
      this.triggerRaceEvent();
      this.scheduleNextEvent();
    }

    this.updateConfetti(dt);
    this.onTick({ elapsed: this.elapsed, timeLeft, ranking: this.getRanking() });

    const someoneFinished = this.racers.some(r => r.progress >= 1);
    if (someoneFinished || this.elapsed >= this.durationSec) {
      this.finishRace(someoneFinished ? 'Có tay đua hoàn thành vòng đua!' : 'Hết thời gian thi đấu!');
    }
  }

  updateRacer(racer, dt) {
    if (racer.shortcut && racer.shortcut.active) {
      this.updateShortcutTravel(racer, dt);
      return;
    }

    const baseUnit = 1 / this.durationSec;
    let multiplier = racer.stats.baseSpeed * racer.stats.laneTemper;
    multiplier *= this.getModifierMultiplier(racer);
    multiplier *= this.getRubberBandMultiplier(racer);

    const finalWindow = this.elapsed >= this.durationSec * 0.80;
    if (finalWindow && !racer.finalSprintUsed) {
      // Mot co hoi nho de tu bung toc, nhung van dua tren burst va luck.
      const chancePerSec = 0.018 + racer.stats.burst * 0.032 + racer.stats.luck * 0.012;
      if (Math.random() < chancePerSec * dt * 60) {
        this.triggerFinalSprint(racer);
      }
    }

    const speed = baseUnit * multiplier;
    racer.speedNow = speed;
    racer.progress = clamp(racer.progress + speed * dt, 0, 1.05);
  }

  updateShortcutTravel(racer, dt) {
    const sc = racer.shortcut;
    sc.elapsed += dt;
    const t = clamp(sc.elapsed / sc.duration, 0, 1);
    racer.progress = lerp(sc.start, sc.end, t);
    racer.speedNow = (sc.end - sc.start) / sc.duration;

    if (t >= 1) {
      sc.active = false;
      racer.shortcut = null;
      if (sc.success) {
        racer.progress = clamp(sc.end + sc.reward, 0, 1.05);
        this.addModifier(racer, 'shortcutSuccessBoost', 1.12 + racer.stats.luck * 0.08, 1.35);
        this.emitEvent(racer, 'shortcutSuccess', 'Thoát đường tắt', 1.25);
      } else {
        racer.progress = clamp(sc.start + (sc.end - sc.start) * randomBetween(0.42, 0.62), 0, 1.05);
        this.addModifier(racer, 'shortcutFailSlow', 0.50 + racer.stats.luck * 0.08, 2.15);
        this.emitEvent(racer, 'shortcutFail', 'Kẹt nhánh hẹp', 1.35);
      }
    }
  }

  cleanupModifiers(racer) {
    racer.modifiers = racer.modifiers.filter(mod => mod.until > this.elapsed);
  }

  getModifierMultiplier(racer) {
    return racer.modifiers.reduce((mul, mod) => mul * mod.multiplier, 1);
  }

  addModifier(racer, key, multiplier, durationSec) {
    const minDuration = Math.max(1.0, durationSec);
    racer.modifiers = racer.modifiers.filter(mod => mod.key !== key);
    racer.modifiers.push({ key, multiplier, until: this.elapsed + minDuration });
  }

  getRubberBandMultiplier(racer) {
    const ranking = this.getRanking();
    const leader = ranking[0];
    const rankIndex = ranking.findIndex(r => r.id === racer.id);
    if (!leader || leader.id === racer.id) {
      const second = ranking[1];
      const gap = second ? leader.progress - second.progress : 0;
      const earlyFactor = 1 - clamp(this.elapsed / (this.durationSec * 0.62), 0, 1);
      // Neu dan qua xa luc dau, giam rat nhe de khong bo xa qua som.
      return gap > 0.075 ? 1 - clamp((gap - 0.075) * 0.70 * earlyFactor, 0, 0.075) : 1;
    }

    const gapToLeader = leader.progress - racer.progress;
    const lateFactor = clamp(this.elapsed / this.durationSec, 0, 1);
    const backBoost = clamp(gapToLeader * 0.28, 0, 0.075);
    const lastBoost = rankIndex === ranking.length - 1 ? 0.018 + lateFactor * 0.018 : 0;
    // Nguoi cuoi co co hoi nhe, nhung khong cong qua lo.
    return 1 + backBoost + lastBoost;
  }

  applyTieBalance(dt) {
    if (!this.tieEnabled || this.tiePairIds.length !== 2) return;
    const finalWindow = this.elapsed >= this.durationSec * 0.78;
    if (!finalWindow) return;
    const a = this.racers.find(r => r.id === this.tiePairIds[0]);
    const b = this.racers.find(r => r.id === this.tiePairIds[1]);
    if (!a || !b || a.shortcut || b.shortcut) return;
    const gap = Math.abs(a.progress - b.progress);
    if (gap > 0.095) return;
    const target = Math.max(a.progress, b.progress);
    const slower = a.progress < b.progress ? a : b;
    const catchRate = clamp(0.010 + slower.stats.burst * 0.006 + slower.stats.luck * 0.004, 0.01, 0.02);
    slower.progress = clamp(slower.progress + catchRate * dt, 0, target + 0.002);
  }

  scheduleNextEvent() {
    this.nextEventAt = this.elapsed + randomBetween(2, 4);
  }

  triggerRaceEvent() {
    const finalWindow = this.elapsed >= this.durationSec * 0.80;
    const eventPool = [];

    eventPool.push({ type: 'headwind', weight: 13 * (this.map.eventBias.headwind || 1), run: () => this.triggerHeadwind() });
    eventPool.push({ type: 'tailwind', weight: 12 * (this.map.eventBias.tailwind || 1), run: () => this.triggerTailwind() });
    eventPool.push({ type: 'stumble', weight: 12, run: () => this.triggerStumble() });
    eventPool.push({ type: 'slideTurn', weight: this.hasAnyRacerInCurve() ? 12 : 4, run: () => this.triggerSlideTurn() });
    eventPool.push({ type: 'slipstream', weight: this.findClosePair() ? 12 : 4, run: () => this.triggerSlipstream() });
    eventPool.push({ type: 'block', weight: this.findClosePair(true) ? 10 : 3, run: () => this.triggerBlock() });
    eventPool.push({ type: 'bump', weight: this.findClosePair(true) ? 8 : 3, run: () => this.triggerBump() });
    eventPool.push({ type: 'shortcutEnter', weight: this.findShortcutCandidate() ? 14 * (this.map.eventBias.shortcut || 1) : 2, run: () => this.triggerShortcutEnter() });

    if (finalWindow) {
      eventPool.push({ type: 'finalSprint', weight: 30 * (this.map.eventBias.finalSprint || 1), run: () => this.triggerScheduledFinalSprint() });
    }

    const picked = weightedPick(eventPool);
    if (picked) picked.run();
  }

  triggerHeadwind() {
    const target = this.pickRacerForTrouble();
    if (!target) return;
    const escapeChance = target.stats.luck * 0.22;
    if (Math.random() < escapeChance) {
      this.addModifier(target, 'headwindEscape', 0.95, 1.1);
      this.emitEvent(target, 'escape', 'Né gió', 1.1);
      return;
    }
    const multiplier = 0.68 + target.stats.stability * 0.08 + target.stats.luck * 0.05;
    this.addModifier(target, 'headwind', multiplier, 1.75);
    this.emitEvent(target, 'headwind', 'Gió ngược', 1.25);
  }

  triggerTailwind() {
    const target = this.pickRacerForBoost();
    if (!target) return;
    const multiplier = 1.12 + target.stats.luck * 0.08 + target.stats.burst * 0.05;
    this.addModifier(target, 'tailwind', multiplier, 1.85);
    this.emitEvent(target, 'tailwind', 'Gió xuôi', 1.2);
  }

  triggerStumble() {
    const candidates = this.racers.filter(r => !r.shortcut);
    const picked = weightedPick(candidates.map(r => ({ racer: r, weight: 0.45 + (1 - r.stats.stability) * 1.8 })));
    const target = picked ? picked.racer : pickRandom(candidates);
    if (!target) return;

    const escapeChance = clamp(target.stats.luck * 0.24 + target.stats.stability * 0.12, 0.02, 0.36);
    if (Math.random() < escapeChance) {
      this.addModifier(target, 'stumbleEscape', 0.93, 1.0);
      this.emitEvent(target, 'escape', 'Hồi phục nhanh', 1.1);
      return;
    }

    const multiplier = 0.46 + target.stats.stability * 0.20 + target.stats.luck * 0.08;
    this.addModifier(target, 'stumble', multiplier, 1.25);
    this.emitEvent(target, 'stumble', 'Vấp té', 1.25);
  }

  triggerSlideTurn() {
    const inCurve = this.racers.filter(r => this.isCurve(r.progress) && !r.shortcut);
    const list = inCurve.length ? inCurve : this.racers.filter(r => !r.shortcut);
    const picked = weightedPick(list.map(r => ({ racer: r, weight: 0.5 + (1 - r.stats.stability) * 1.7 })));
    const target = picked ? picked.racer : pickRandom(list);
    if (!target) return;

    const escapeChance = clamp(target.stats.luck * 0.18 + target.stats.stability * 0.15, 0.02, 0.34);
    if (Math.random() < escapeChance) {
      this.emitEvent(target, 'escape', 'Giữ cua', 1.1);
      return;
    }

    const multiplier = this.isCurve(target.progress) ? 0.58 + target.stats.stability * 0.18 : 0.82;
    this.addModifier(target, 'slideTurn', multiplier, 1.35);
    this.emitEvent(target, 'slideTurn', 'Trượt cua', 1.3);
  }

  triggerBlock() {
    const pair = this.findClosePair(true) || this.findClosePair(false);
    if (!pair) return this.triggerHeadwind();
    const behind = pair.behind;
    const front = pair.front;
    this.addModifier(behind, 'block', 0.66 + behind.stats.luck * 0.08, 1.35);
    this.addModifier(front, 'frontPressure', 0.92 + front.stats.stability * 0.04, 1.0);
    this.emitEvent(behind, 'block', 'Bị chắn', 1.25);
  }

  triggerBump() {
    const pair = this.findClosePair(true) || this.findClosePair(false);
    if (!pair) return this.triggerStumble();
    const harshBehind = 0.70 + pair.behind.stats.stability * 0.09 + pair.behind.stats.luck * 0.05;
    const harshFront = 0.82 + pair.front.stats.stability * 0.07;
    this.addModifier(pair.behind, 'bumpBehind', harshBehind, 1.15);
    this.addModifier(pair.front, 'bumpFront', harshFront, 1.0);
    this.emitEvent(pair.behind, 'bump', 'Va chạm', 1.25);
    this.setBubble(pair.front, 'Bị áp lực', '#FACC15', 1.0);
  }

  triggerSlipstream() {
    const pair = this.findClosePair(false);
    if (!pair) return this.triggerTailwind();
    const behind = pair.behind;
    const multiplier = 1.09 + behind.stats.burst * 0.08 + behind.stats.luck * 0.04;
    this.addModifier(behind, 'slipstream', multiplier, 1.9);
    this.emitEvent(behind, 'slipstream', 'Đu bám', 1.25);
  }

  triggerShortcutEnter() {
    const candidate = this.findShortcutCandidate();
    if (!candidate) return this.triggerTailwind();
    this.enterShortcut(candidate);
  }

  triggerScheduledFinalSprint() {
    const candidates = this.racers.filter(r => !r.finalSprintUsed && !r.shortcut);
    if (!candidates.length) return this.triggerTailwind();
    const ranking = this.getRanking();
    const picked = weightedPick(candidates.map(r => {
      const rankIndex = ranking.findIndex(x => x.id === r.id);
      const comebackWeight = rankIndex >= Math.floor(ranking.length / 2) ? 1.25 : 1.0;
      return { racer: r, weight: (0.6 + r.stats.burst * 1.8 + r.stats.luck * 0.6) * comebackWeight };
    }));
    this.triggerFinalSprint(picked ? picked.racer : pickRandom(candidates));
  }

  triggerFinalSprint(racer) {
    if (!racer || racer.finalSprintUsed || racer.shortcut) return;
    racer.finalSprintUsed = true;
    const multiplier = 1.14 + racer.stats.burst * 0.23 + racer.stats.luck * 0.06;
    this.addModifier(racer, 'finalSprint', multiplier, 2.45);
    this.emitEvent(racer, 'finalSprint', 'Bứt tốc', 1.35);
  }

  tryNaturalShortcut(racer) {
    if (racer.shortcutUsed || racer.shortcut || racer.progress >= 0.95) return;
    const start = this.map.shortcut.start;
    const crossedGate = racer.lastProgress < start && racer.progress >= start;
    if (!crossedGate) return;
    const chance = clamp(0.10 + racer.stats.courage * 0.48 + racer.stats.luck * 0.12 - this.map.shortcut.risk * 0.11, 0.08, 0.72);
    if (Math.random() < chance) this.enterShortcut(racer);
  }

  enterShortcut(racer) {
    if (!racer || racer.shortcutUsed || racer.shortcut) return;
    const sc = this.map.shortcut;
    racer.shortcutUsed = true;
    const successChance = clamp(0.32 + racer.stats.luck * 0.30 + racer.stats.stability * 0.24 + racer.stats.courage * 0.05 - sc.risk * 0.22, 0.22, 0.86);
    const success = Math.random() < successChance;
    racer.shortcut = {
      active: true,
      start: sc.start,
      end: sc.end,
      reward: sc.reward,
      risk: sc.risk,
      duration: sc.duration + randomBetween(-0.18, 0.22),
      elapsed: 0,
      success
    };
    racer.progress = sc.start;
    this.emitEvent(racer, 'shortcutEnter', 'Vào đường tắt', 1.25);
  }

  pickRacerForTrouble() {
    const ranking = this.getRanking();
    const topHalf = ranking.slice(0, Math.max(1, Math.ceil(ranking.length * 0.55)));
    const candidates = topHalf.filter(r => !r.shortcut);
    if (!candidates.length) return pickRandom(this.racers);
    return pickRandom(candidates);
  }

  pickRacerForBoost() {
    const ranking = this.getRanking();
    const fromMiddleDown = ranking.slice(Math.max(0, Math.floor(ranking.length * 0.25)));
    const candidates = fromMiddleDown.filter(r => !r.shortcut);
    if (!candidates.length) return pickRandom(this.racers);
    const picked = weightedPick(candidates.map(r => ({ racer: r, weight: 0.7 + r.stats.luck * 0.7 + r.stats.burst * 0.5 })));
    return picked ? picked.racer : pickRandom(candidates);
  }

  findShortcutCandidate() {
    const sc = this.map.shortcut;
    const candidates = this.racers.filter(r => {
      if (r.shortcutUsed || r.shortcut) return false;
      return Math.abs(r.progress - sc.start) <= 0.075 || (r.progress < sc.start && sc.start - r.progress < 0.11);
    });
    if (!candidates.length) return null;
    const picked = weightedPick(candidates.map(r => ({ racer: r, weight: 0.4 + r.stats.courage * 1.8 + r.stats.luck * 0.5 })));
    return picked ? picked.racer : pickRandom(candidates);
  }

  findClosePair(requireNarrow) {
    const sorted = this.getRanking();
    for (let i = 0; i < sorted.length - 1; i++) {
      const front = sorted[i];
      const behind = sorted[i + 1];
      const gap = front.progress - behind.progress;
      const closeEnough = gap > 0 && gap < 0.028;
      const narrow = this.isNarrow(front.progress) || this.isNarrow(behind.progress) || front.shortcut || behind.shortcut;
      if (closeEnough && (!requireNarrow || narrow)) {
        return { front, behind, gap, narrow };
      }
    }
    return null;
  }

  hasAnyRacerInCurve() {
    return this.racers.some(r => this.isCurve(r.progress));
  }

  isCurve(progress) {
    const p = progress % 1;
    return this.map.curveZones.some(zone => p >= zone.start && p <= zone.end);
  }

  isNarrow(progress) {
    const p = progress % 1;
    return this.map.narrowZones.some(zone => p >= zone.start && p <= zone.end);
  }

  emitEvent(racer, type, bubbleText, minDuration) {
    const templates = EVENT_COMMENTS[type] || ['{name} vừa tạo ra một diễn biến mới!'];
    const text = pickRandom(templates).replace('{name}', racer.name);
    const color = this.getEventColor(type);
    this.setBubble(racer, bubbleText, color, minDuration || 1.1);
    this.say(text, type);
  }

  getEventColor(type) {
    if (['tailwind', 'slipstream', 'finalSprint', 'shortcutSuccess', 'escape'].includes(type)) return TRACK_STYLE.boost;
    if (['stumble', 'slideTurn', 'block', 'bump', 'shortcutFail', 'headwind'].includes(type)) return TRACK_STYLE.danger;
    if (type === 'shortcutEnter') return TRACK_STYLE.shortcut;
    return '#FFFFFF';
  }

  setBubble(racer, text, color, minDurationSec) {
    racer.bubble = {
      text,
      color,
      until: this.elapsed + Math.max(1.0, minDurationSec || 1.0)
    };
  }

  say(text, type) {
    this.onCommentary({ text, type, at: this.elapsed });
  }

  getRanking() {
    return this.racers.slice().sort((a, b) => {
      if (b.progress !== a.progress) return b.progress - a.progress;
      return a.lane - b.lane;
    });
  }

  checkRankChanges() {
    const ranking = this.getRanking();
    const ids = ranking.map(r => r.id);
    let changed = false;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] !== this.previousRankIds[i]) {
        changed = true;
        const racer = this.racers.find(r => r.id === ids[i]);
        if (racer) racer.rankPulseUntil = this.elapsed + 0.5;
      }
    }
    if (changed) {
      this.previousRankIds = ids;
      this.onRankChange(ranking);
    }
  }

  finishRace(reason) {
    if (this.finished) return;
    this.finished = true;
    this.running = false;
    this.finishReason = reason;

    const ranking = this.getRanking();
    this.applyPossibleTieAtFinish(ranking);
    const finalRanking = this.getRanking();
    this.spawnConfetti();
    this.render();
    this.say(`${reason} Kết quả top 3 đã có!`, 'finish');
    this.onFinish({ reason, ranking: finalRanking, tieEnabled: this.tieEnabled });
  }

  applyPossibleTieAtFinish(currentRanking) {
    if (!this.tieEnabled || this.tiePairIds.length !== 2) return;
    const a = this.racers.find(r => r.id === this.tiePairIds[0]);
    const b = this.racers.find(r => r.id === this.tiePairIds[1]);
    if (!a || !b) return;
    const gap = Math.abs(a.progress - b.progress);
    const bothRelevant = currentRanking.slice(0, Math.min(5, currentRanking.length)).some(r => r.id === a.id) && currentRanking.slice(0, Math.min(5, currentRanking.length)).some(r => r.id === b.id);
    if (!bothRelevant || gap > 0.08) return;
    const same = Math.max(a.progress, b.progress);
    a.progress = same;
    b.progress = same;
    a.sameFinishGroup = 'tie-1';
    b.sameFinishGroup = 'tie-1';
  }

  recordHistory(racer) {
    const point = this.getRacerPoint(racer, true);
    racer.history.push({ x: point.x, y: point.y, at: this.elapsed });
    const keepAfter = this.elapsed - 0.55;
    racer.history = racer.history.filter(p => p.at >= keepAfter);
  }

  getGeometry() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const lanes = Math.max(2, this.racers.length || 2);
    const outerRx = w * 0.43;
    const outerRy = h * 0.36;
    let laneWidth = clamp((Math.min(w, h) * 0.42) / lanes, 18 * this.dpr, 46 * this.dpr);
    laneWidth = Math.min(laneWidth, (outerRx - 86 * this.dpr) / lanes, (outerRy - 56 * this.dpr) / lanes);
    laneWidth = Math.max(12 * this.dpr, laneWidth);
    return {
      cx: w * 0.50,
      cy: h * 0.54,
      outerRx,
      outerRy,
      laneWidth,
      lanes,
      startAngle: Math.PI / 2
    };
  }

  getRacerPoint(racer, includeShortcut) {
    const geo = this.getGeometry();
    if (includeShortcut && racer.shortcut && racer.shortcut.active) {
      const sc = racer.shortcut;
      const t = clamp(sc.elapsed / sc.duration, 0, 1);
      const startPoint = this.getPointAtProgress(sc.start, racer.lane, geo);
      const endPoint = this.getPointAtProgress(sc.end, racer.lane, geo);
      // Duong tat ve gan vung giua de nhin ro la da re nhanh.
      const midPull = 0.18 + (racer.lane / Math.max(1, geo.lanes - 1)) * 0.05;
      const midX = lerp(startPoint.x, endPoint.x, 0.5);
      const midY = lerp(startPoint.y, endPoint.y, 0.5);
      const controlX = lerp(midX, geo.cx, midPull);
      const controlY = lerp(midY, geo.cy, midPull);
      const x = (1 - t) * (1 - t) * startPoint.x + 2 * (1 - t) * t * controlX + t * t * endPoint.x;
      const y = (1 - t) * (1 - t) * startPoint.y + 2 * (1 - t) * t * controlY + t * t * endPoint.y;
      return { x, y };
    }
    return this.getPointAtProgress(racer.progress, racer.lane, geo);
  }

  getPointAtProgress(progress, lane, geo) {
    const offset = geo.laneWidth * (lane + 0.5);
    const rx = geo.outerRx - offset;
    const ry = geo.outerRy - offset;
    const angle = geo.startAngle - (progress % 1) * Math.PI * 2;
    return {
      x: geo.cx + Math.cos(angle) * rx,
      y: geo.cy + Math.sin(angle) * ry,
      angle,
      rx,
      ry
    };
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    this.drawBackground(ctx, w, h);
    this.drawTrack(ctx);
    this.drawShortcutGuides(ctx);
    this.drawRacers(ctx);
    this.drawConfetti(ctx);
  }

  drawBackground(ctx, w, h) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#CFF8E6');
    bg.addColorStop(1, '#8FD3B2');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 26; i++) {
      const x = (Math.sin(i * 15.9) * 0.5 + 0.5) * w;
      const y = (Math.cos(i * 9.3) * 0.5 + 0.5) * h;
      const r = (8 + (i % 5) * 5) * this.dpr;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawTrack(ctx) {
    const geo = this.getGeometry();
    const totalWidth = geo.laneWidth * geo.lanes;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.shadowColor = 'rgba(15, 23, 42, 0.26)';
    ctx.shadowBlur = 20 * this.dpr;
    ctx.shadowOffsetY = 10 * this.dpr;
    ctx.beginPath();
    ctx.ellipse(geo.cx, geo.cy, geo.outerRx - totalWidth / 2, geo.outerRy - totalWidth / 2, 0, 0, Math.PI * 2);
    ctx.lineWidth = totalWidth;
    ctx.strokeStyle = TRACK_STYLE.trackDark;
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.ellipse(geo.cx, geo.cy, geo.outerRx - totalWidth / 2, geo.outerRy - totalWidth / 2, 0, 0, Math.PI * 2);
    ctx.lineWidth = totalWidth - 5 * this.dpr;
    ctx.strokeStyle = TRACK_STYLE.trackMain;
    ctx.stroke();

    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.ellipse(geo.cx, geo.cy - 4 * this.dpr, geo.outerRx - totalWidth / 2, geo.outerRy - totalWidth / 2, 0, Math.PI, Math.PI * 2);
    ctx.lineWidth = totalWidth - 10 * this.dpr;
    ctx.strokeStyle = TRACK_STYLE.trackHighlight;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Vung co trong long san.
    ctx.beginPath();
    ctx.ellipse(geo.cx, geo.cy, geo.outerRx - totalWidth - 10 * this.dpr, geo.outerRy - totalWidth - 10 * this.dpr, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#244533';
    ctx.fill();
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = '#6FBF8F';
    ctx.beginPath();
    ctx.ellipse(geo.cx, geo.cy, geo.outerRx - totalWidth - 36 * this.dpr, geo.outerRy - totalWidth - 34 * this.dpr, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Ke vach phan lan. So lan duoc sinh theo so nguoi choi.
    ctx.lineWidth = Math.max(1.7 * this.dpr, geo.laneWidth * 0.055);
    ctx.strokeStyle = TRACK_STYLE.trackLine;
    for (let i = 0; i <= geo.lanes; i++) {
      const rx = geo.outerRx - geo.laneWidth * i;
      const ry = geo.outerRy - geo.laneWidth * i;
      if (rx <= 0 || ry <= 0) continue;
      ctx.beginPath();
      ctx.ellipse(geo.cx, geo.cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.drawFinishLine(ctx, geo);
    this.drawLaneNumbers(ctx, geo);
    ctx.restore();
  }

  drawFinishLine(ctx, geo) {
    const totalWidth = geo.laneWidth * geo.lanes;
    const angle = geo.startAngle;
    const innerRx = geo.outerRx - totalWidth;
    const innerRy = geo.outerRy - totalWidth;
    const outer = {
      x: geo.cx + Math.cos(angle) * geo.outerRx,
      y: geo.cy + Math.sin(angle) * geo.outerRy
    };
    const inner = {
      x: geo.cx + Math.cos(angle) * innerRx,
      y: geo.cy + Math.sin(angle) * innerRy
    };
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4 * this.dpr;
    ctx.beginPath();
    ctx.moveTo(inner.x, inner.y);
    ctx.lineTo(outer.x, outer.y);
    ctx.stroke();

    ctx.strokeStyle = TRACK_STYLE.trackDark;
    ctx.lineWidth = 2 * this.dpr;
    const tickCount = Math.max(6, geo.lanes * 2);
    for (let i = 0; i < tickCount; i++) {
      const t1 = i / tickCount;
      const t2 = (i + 0.55) / tickCount;
      const x1 = lerp(inner.x, outer.x, t1);
      const y1 = lerp(inner.y, outer.y, t1);
      const x2 = lerp(inner.x, outer.x, t2);
      const y2 = lerp(inner.y, outer.y, t2);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawLaneNumbers(ctx, geo) {
    ctx.save();
    ctx.font = `${Math.max(10 * this.dpr, geo.laneWidth * 0.32)}px ui-sans-serif, system-ui`;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const p = 0.985;
    for (let i = 0; i < geo.lanes; i++) {
      const point = this.getPointAtProgress(p, i, geo);
      ctx.fillText(String(i + 1), point.x, point.y);
    }
    ctx.restore();
  }

  drawShortcutGuides(ctx) {
    const geo = this.getGeometry();
    const sc = this.map.shortcut;
    ctx.save();
    ctx.setLineDash([10 * this.dpr, 10 * this.dpr]);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.82)';
    ctx.lineWidth = Math.max(2 * this.dpr, geo.laneWidth * 0.07);
    for (let i = 0; i < geo.lanes; i++) {
      const start = this.getPointAtProgress(sc.start, i, geo);
      const end = this.getPointAtProgress(sc.end, i, geo);
      const midX = lerp(start.x, end.x, 0.5);
      const midY = lerp(start.y, end.y, 0.5);
      const controlX = lerp(midX, geo.cx, 0.20);
      const controlY = lerp(midY, geo.cy, 0.20);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawRacers(ctx) {
    const geo = this.getGeometry();
    const ordered = this.getRanking().slice().reverse();
    for (const racer of ordered) {
      const point = this.getRacerPoint(racer, true);
      this.drawMotionTrail(ctx, racer, point, geo);
      this.drawRacer(ctx, racer, point, geo);
    }
    for (const racer of ordered) {
      if (racer.bubble && racer.bubble.until > this.elapsed) {
        const point = this.getRacerPoint(racer, true);
        this.drawBubble(ctx, racer, point, geo);
      }
    }
  }

  drawMotionTrail(ctx, racer, point, geo) {
    const boosting = racer.modifiers.some(mod => ['finalSprint', 'tailwind', 'slipstream', 'shortcutSuccessBoost'].includes(mod.key));
    if (!boosting && racer.history.length < 5) return;
    if (!boosting) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.42)';
    ctx.lineWidth = Math.max(3 * this.dpr, geo.laneWidth * 0.12);
    ctx.beginPath();
    const hist = racer.history.slice(-7);
    hist.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#34D399';
    for (let i = 0; i < hist.length; i += 2) {
      const p = hist[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(2 * this.dpr, geo.laneWidth * 0.05), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawRacer(ctx, racer, point, geo) {
    const radius = clamp(geo.laneWidth * 0.34, 8 * this.dpr, 18 * this.dpr);
    const rankPulse = racer.rankPulseUntil > this.elapsed;
    const scale = rankPulse ? 1.14 : 1;

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.95, radius * 0.95, radius * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = racer.animal.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(2 * this.dpr, radius * 0.16);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = `${radius * 1.12}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(racer.animal.emoji, 0, radius * 0.02);

    ctx.restore();

    ctx.save();
    ctx.font = `800 ${Math.max(10 * this.dpr, geo.laneWidth * 0.22)}px ui-sans-serif, system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const labelY = point.y + radius + 5 * this.dpr;
    const maxW = geo.laneWidth * 2.8;
    const text = racer.name.length > 12 ? racer.name.slice(0, 11) + '…' : racer.name;
    ctx.lineWidth = 4 * this.dpr;
    ctx.strokeStyle = 'rgba(18,55,42,0.55)';
    ctx.strokeText(text, point.x, labelY, maxW);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, point.x, labelY, maxW);
    ctx.restore();
  }

  drawBubble(ctx, racer, point, geo) {
    const bubble = racer.bubble;
    const text = bubble.text;
    const fontSize = Math.max(11 * this.dpr, geo.laneWidth * 0.28);
    ctx.save();
    ctx.font = `900 ${fontSize}px ui-sans-serif, system-ui`;
    const paddingX = 10 * this.dpr;
    const paddingY = 7 * this.dpr;
    const textW = Math.min(ctx.measureText(text).width, 170 * this.dpr);
    const w = textW + paddingX * 2;
    const h = fontSize + paddingY * 2;
    let x = point.x - w / 2;
    let y = point.y - geo.laneWidth * 0.88 - h;
    x = clamp(x, 8 * this.dpr, this.canvas.width - w - 8 * this.dpr);
    y = clamp(y, 8 * this.dpr, this.canvas.height - h - 8 * this.dpr);

    ctx.fillStyle = bubble.color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * this.dpr;
    this.roundRect(ctx, x, y, w, h, 12 * this.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#12372A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2, w - paddingX * 2);
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
    this.confetti = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: randomBetween(0, this.canvas.width),
        y: randomBetween(-this.canvas.height * 0.25, this.canvas.height * 0.25),
        vx: randomBetween(-45, 45) * this.dpr,
        vy: randomBetween(80, 220) * this.dpr,
        size: randomBetween(4, 8) * this.dpr,
        life: randomBetween(1.6, 2.7),
        age: 0,
        color: pickRandom(['#2DD4BF', '#34D399', '#FACC15', '#FB7185', '#FFFFFF'])
      });
    }
  }

  updateConfetti(dt) {
    for (const p of this.confetti) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 60 * this.dpr * dt;
    }
    this.confetti = this.confetti.filter(p => p.age < p.life);
  }

  drawConfetti(ctx) {
    if (!this.confetti.length) return;
    ctx.save();
    for (const p of this.confetti) {
      ctx.globalAlpha = clamp(1 - p.age / p.life, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 0.62);
    }
    ctx.restore();
  }
}

const app = {
  engine: null,
  lastNames: [],
  els: {},

  init() {
    this.els.canvas = document.getElementById('raceCanvas');
    this.els.playerNames = document.getElementById('playerNames');
    this.els.mapSelect = document.getElementById('mapSelect');
    this.els.durationRange = document.getElementById('raceDuration');
    this.els.durationNumber = document.getElementById('durationNumber');
    this.els.durationLabel = document.getElementById('durationLabel');
    this.els.startBtn = document.getElementById('startBtn');
    this.els.replayBtn = document.getElementById('replayBtn');
    this.els.randomMapBtn = document.getElementById('randomMapBtn');
    this.els.resetBtn = document.getElementById('resetBtn');
    this.els.rankingList = document.getElementById('rankingList');
    this.els.ticker = document.getElementById('commentaryTicker');
    this.els.timerText = document.getElementById('timerText');
    this.els.raceTitle = document.getElementById('raceTitle');
    this.els.raceMeta = document.getElementById('raceMeta');
    this.els.resultOverlay = document.getElementById('resultOverlay');
    this.els.podium = document.getElementById('podium');
    this.els.closeResultBtn = document.getElementById('closeResultBtn');
    this.els.playAgainBigBtn = document.getElementById('playAgainBigBtn');

    this.populateMaps();
    this.bindEvents();
    this.syncDuration(30);
    this.preparePreview();
  },

  populateMaps() {
    this.els.mapSelect.innerHTML = MAP_DATA.map(map => `<option value="${map.id}">${map.name}</option>`).join('');
  },

  bindEvents() {
    document.querySelectorAll('[data-sample]').forEach(btn => {
      btn.addEventListener('click', () => this.fillSample(Number(btn.dataset.sample)));
    });

    this.els.durationRange.addEventListener('input', () => this.syncDuration(this.els.durationRange.value));
    this.els.durationNumber.addEventListener('input', () => this.syncDuration(this.els.durationNumber.value));
    this.els.startBtn.addEventListener('click', () => this.startRace());
    this.els.replayBtn.addEventListener('click', () => this.replayRace());
    this.els.randomMapBtn.addEventListener('click', () => this.randomMap());
    this.els.resetBtn.addEventListener('click', () => this.resetNames());
    this.els.closeResultBtn.addEventListener('click', () => this.hideResult());
    this.els.playAgainBigBtn.addEventListener('click', () => this.replayRace());
    this.els.mapSelect.addEventListener('change', () => this.preparePreview());

    window.addEventListener('resize', () => {
      if (this.engine) {
        this.engine.resizeCanvasToDisplaySize();
        this.engine.render();
      }
    });
  },

  syncDuration(value) {
    const safe = clamp(Number(value) || 30, 15, 90);
    this.els.durationRange.value = String(safe);
    this.els.durationNumber.value = String(safe);
    this.els.durationLabel.textContent = `${safe} giây`;
    this.els.timerText.textContent = `${safe.toFixed(1)}s`;
  },

  fillSample(count) {
    const samples = ['Khải', 'Lan', 'Tùng', 'Minh', 'Vy', 'Huy', 'An', 'Bình', 'Nam', 'Mai', 'Phúc', 'Linh'];
    this.els.playerNames.value = samples.slice(0, count).join('\n');
    this.preparePreview();
  },

  resetNames() {
    this.els.playerNames.value = '';
    this.clearRanking();
    this.setTicker('Đã reset tên. Nhập từ 2 đến 12 người chơi để bắt đầu.');
  },

  randomMap() {
    const current = this.els.mapSelect.value;
    const choices = MAP_DATA.filter(m => m.id !== current);
    const picked = pickRandom(choices.length ? choices : MAP_DATA);
    this.els.mapSelect.value = picked.id;
    this.preparePreview();
  },

  getSelectedMap() {
    return MAP_DATA.find(map => map.id === this.els.mapSelect.value) || MAP_DATA[0];
  },

  getPlayersFromInput() {
    const names = this.els.playerNames.value
      .split('\n')
      .map(name => name.trim())
      .filter(Boolean);
    return Array.from(new Set(names)).slice(0, 12);
  },

  validatePlayers(players) {
    if (players.length < 2) {
      this.setTicker('Cần tối thiểu 2 người chơi. Mỗi dòng là một tên.');
      return false;
    }
    if (players.length > 12) {
      this.setTicker('Tối đa 12 người chơi. Hệ thống đã lấy 12 tên đầu tiên.');
    }
    return true;
  },

  preparePreview() {
    const players = this.getPlayersFromInput();
    const previewPlayers = players.length >= 2 ? players : ['Khải', 'Lan', 'Tùng', 'Minh'];
    const map = this.getSelectedMap();
    if (this.engine) this.engine.stop();
    this.engine = new RaceEngine({
      canvas: this.els.canvas,
      players: previewPlayers,
      durationSec: Number(this.els.durationNumber.value),
      map,
      onCommentary: (entry) => this.setTicker(entry.text),
      onRankChange: (ranking) => this.renderRanking(ranking),
      onTick: (state) => this.onTick(state),
      onFinish: (result) => this.showResult(result)
    });
    this.els.raceTitle.textContent = map.name;
    this.els.raceMeta.textContent = map.subtitle;
    this.renderRanking(this.engine.getRanking());
  },

  startRace() {
    const players = this.getPlayersFromInput();
    if (!this.validatePlayers(players)) return;
    const map = this.getSelectedMap();
    if (this.engine) this.engine.stop();
    this.hideResult();
    this.engine = new RaceEngine({
      canvas: this.els.canvas,
      players,
      durationSec: Number(this.els.durationNumber.value),
      map,
      onCommentary: (entry) => this.setTicker(entry.text),
      onRankChange: (ranking) => this.renderRanking(ranking),
      onTick: (state) => this.onTick(state),
      onFinish: (result) => this.showResult(result)
    });
    this.lastNames = players;
    this.els.raceTitle.textContent = map.name;
    this.els.raceMeta.textContent = map.subtitle;
    this.els.startBtn.disabled = true;
    this.els.replayBtn.disabled = true;
    this.engine.start();
  },

  replayRace() {
    this.hideResult();
    this.els.startBtn.disabled = false;
    this.els.replayBtn.disabled = true;
    this.startRace();
  },

  onTick(state) {
    this.els.timerText.textContent = `${state.timeLeft.toFixed(1)}s`;
    this.renderRanking(state.ranking);
  },

  renderRanking(ranking) {
    const oldItems = new Map(Array.from(this.els.rankingList.children).map(li => [li.dataset.id, li]));
    this.els.rankingList.innerHTML = ranking.map((racer, index) => {
      const jumped = racer.rankPulseUntil > (this.engine ? this.engine.elapsed : 0);
      const pct = clamp(racer.progress * 100, 0, 100);
      const animalText = `${racer.animal.emoji} ${racer.animal.label}`;
      const same = racer.sameFinishGroup ? ' · Cán đích đồng thời' : '';
      return `
        <li class="rank-item ${jumped ? 'rank-jump' : ''}" data-id="${racer.id}">
          <div class="rank-no">${index + 1}</div>
          <div class="rank-name"><strong>${this.escapeHtml(racer.name)}</strong><span>${animalText}${same}</span></div>
          <div class="rank-progress">${pct.toFixed(0)}%</div>
        </li>
      `;
    }).join('');

    for (const li of this.els.rankingList.children) {
      if (oldItems.has(li.dataset.id)) li.classList.toggle('rank-jump', li.classList.contains('rank-jump'));
    }
  },

  clearRanking() {
    this.els.rankingList.innerHTML = '';
  },

  setTicker(text) {
    this.els.ticker.innerHTML = `<span>${this.escapeHtml(text)}</span>`;
  },

  showResult(result) {
    this.els.startBtn.disabled = false;
    this.els.replayBtn.disabled = false;
    const top = result.ranking.slice(0, 3);
    this.els.podium.innerHTML = top.map((racer, index) => {
      const medal = ['1', '2', '3'][index];
      const label = racer.sameFinishGroup ? 'Cán đích đồng thời' : `${clamp(racer.progress * 100, 0, 100).toFixed(0)}% chặng đua`;
      return `
        <div class="podium-item">
          <div class="podium-medal">${medal}</div>
          <div><strong>${this.escapeHtml(racer.name)} ${racer.animal.emoji}</strong><span>${label}</span></div>
        </div>
      `;
    }).join('');
    this.els.resultOverlay.hidden = false;
  },

  hideResult() {
    this.els.resultOverlay.hidden = true;
  },

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());

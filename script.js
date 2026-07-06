(() => {
  "use strict";

  // =========================
  // Cau hinh de chinh gameplay
  // =========================
  const CONFIG = {
    minPlayers: 2,
    maxPlayers: 12,
    defaultDuration: 30,
    minDuration: 15,
    maxDuration: 90,
    rankRefreshMs: 150,
    eventBaseRate: 0.72,
    finalPhaseRatio: 0.8,
    rubberBandMax: 0.18,
    leaderBrake: 0.94,
    shortcutBoost: 1.36,
    shortcutPenaltySeconds: 2.25,
    closeDistance: 0.024,
    narrowDistance: 0.032,
    bubbleLifeMs: 1600,
    maxComments: 6
  };

  // Du lieu con vat tach rieng de sau nay thay asset PNG
  const ANIMALS = [
    { key: "duck", label: "Vit Mint", emoji: "🦆", color: "#FACC15", asset: "assets/animals/duck.svg" },
    { key: "turtle", label: "Rua Rua", emoji: "🐢", color: "#34D399", asset: "assets/animals/turtle.svg" },
    { key: "rabbit", label: "Tho Chanh", emoji: "🐰", color: "#FB7185", asset: "assets/animals/rabbit.svg" },
    { key: "frog", label: "Ech Xanh", emoji: "🐸", color: "#2DD4BF", asset: "assets/animals/frog.svg" },
    { key: "crab", label: "Cua Gang", emoji: "🦀", color: "#FB7185", asset: "assets/animals/crab.svg" },
    { key: "penguin", label: "Chim Cut", emoji: "🐧", color: "#89CFF0", asset: "assets/animals/penguin.svg" },
    { key: "hamster", label: "Hamster", emoji: "🐹", color: "#F7D794", asset: "assets/animals/hamster.svg" },
    { key: "fox", label: "Cao Lua", emoji: "🦊", color: "#F59E0B", asset: "assets/animals/fox.svg" },
    { key: "koala", label: "Gau Koala", emoji: "🐨", color: "#CBD5E1", asset: "assets/animals/koala.svg" },
    { key: "monkey", label: "Khi Nhanh", emoji: "🐵", color: "#B45309", asset: "assets/animals/monkey.svg" },
    { key: "panda", label: "Gau Truc", emoji: "🐼", color: "#111827", asset: "assets/animals/panda.svg" },
    { key: "chick", label: "Ga Con", emoji: "🐥", color: "#FACC15", asset: "assets/animals/chick.svg" }
  ];

  // Du lieu map tach rieng: moi map co oval, duong tat va doan hep
  const MAPS = [
    {
      id: "mint-pond",
      name: "Ao Mint May Rủi",
      terrain: "water",
      bgA: "#D9FFF4",
      bgB: "#F7FFFC",
      track: "#9CF3DA",
      lane: "#FFFFFF",
      marker: "#2DD4BF",
      shortcut: { entry: 0.23, exit: 0.58, cp1: [0.40, 0.18], cp2: [0.62, 0.80], label: "cầu bèo tắt" },
      narrow: [0.44, 0.57],
      decor: "lily"
    },
    {
      id: "bamboo-bend",
      name: "Khúc Cua Tre Non",
      terrain: "grass",
      bgA: "#E8FFF3",
      bgB: "#F4FFFA",
      track: "#B6F5D5",
      lane: "#F7FFFC",
      marker: "#34D399",
      shortcut: { entry: 0.30, exit: 0.67, cp1: [0.31, 0.70], cp2: [0.72, 0.22], label: "lối tre hẹp" },
      narrow: [0.60, 0.74],
      decor: "bamboo"
    },
    {
      id: "candy-canal",
      name: "Kênh Kẹo Hồng",
      terrain: "water",
      bgA: "#F2FFF9",
      bgB: "#FFE8EF",
      track: "#A7F3D0",
      lane: "#FFFFFF",
      marker: "#FB7185",
      shortcut: { entry: 0.17, exit: 0.49, cp1: [0.48, 0.08], cp2: [0.52, 0.90], label: "ống kẹo tắt" },
      narrow: [0.12, 0.22],
      decor: "candy"
    },
    {
      id: "golden-marsh",
      name: "Đầm Vàng Lật Kèo",
      terrain: "marsh",
      bgA: "#FFF9DB",
      bgB: "#ECFFF7",
      track: "#BDF4DD",
      lane: "#FFFDF2",
      marker: "#FACC15",
      shortcut: { entry: 0.39, exit: 0.76, cp1: [0.76, 0.69], cp2: [0.25, 0.28], label: "lối sình vàng" },
      narrow: [0.35, 0.47],
      decor: "gold"
    },
    {
      id: "stormy-mint",
      name: "Đảo Gió Mint",
      terrain: "island",
      bgA: "#DDFDF6",
      bgB: "#EAF8FF",
      track: "#96EED8",
      lane: "#F8FFFD",
      marker: "#2DD4BF",
      shortcut: { entry: 0.08, exit: 0.43, cp1: [0.25, 0.16], cp2: [0.78, 0.52], label: "cầu gió tắt" },
      narrow: [0.78, 0.90],
      decor: "wind"
    }
  ];

  // Du lieu su kien tach rieng de de them bot
  const EVENT_LIBRARY = [
    { key: "headwind", kind: "bad", mod: 0.72, seconds: 1.15, bubble: "Gió ngược!", text: name => `${name} bị gió ngược làm chậm lại!` },
    { key: "tailwind", kind: "good", mod: 1.20, seconds: 1.05, bubble: "Gió xuôi!", text: name => `${name} gặp gió xuôi, tốc độ lên thấy rõ!` },
    { key: "trip", kind: "bad", mod: 0.52, seconds: 1.05, bubble: "Vấp nhẹ!", text: name => `${name} vừa vấp nhẹ nhưng đã lấy lại thăng bằng!` },
    { key: "corner-slip", kind: "bad", mod: 0.66, seconds: 0.95, bubble: "Trượt cua!", text: name => `${name} trượt cua một nhịp, vị trí đang bị đe dọa!` },
    { key: "blocked", kind: "bad", mod: 0.62, seconds: 1.25, bubble: "Bị chắn!", text: name => `${name} bị chắn đường, phải né sang làn ngoài!` },
    { key: "balance", kind: "bad", mod: 0.76, seconds: 0.85, bubble: "Lảo đảo!", text: name => `${name} mất thăng bằng rồi hồi phục rất nhanh!` },
    { key: "burst", kind: "good", mod: 1.34, seconds: 1.18, bubble: "Bứt tốc!", text: name => `${name} đang bứt tốc ở cua cuối!` }
  ];

  const SAMPLE_NAMES = {
    3: ["Khải", "Lan", "Tùng"],
    5: ["Khải", "Lan", "Tùng", "Minh", "Vy"],
    8: ["Khải", "Lan", "Tùng", "Minh", "Vy", "Huy", "An", "Bảo"]
  };

  const els = {
    playersInput: document.getElementById("playersInput"),
    mapSelect: document.getElementById("mapSelect"),
    randomMapBtn: document.getElementById("randomMapBtn"),
    durationRange: document.getElementById("durationRange"),
    durationNumber: document.getElementById("durationNumber"),
    durationOutput: document.getElementById("durationOutput"),
    startBtn: document.getElementById("startBtn"),
    replayBtn: document.getElementById("replayBtn"),
    resetNamesBtn: document.getElementById("resetNamesBtn"),
    setupMessage: document.getElementById("setupMessage"),
    canvas: document.getElementById("raceCanvas"),
    canvasWrap: document.getElementById("canvasWrap"),
    raceStatus: document.getElementById("raceStatus"),
    clockLabel: document.getElementById("clockLabel"),
    mapTitle: document.getElementById("mapTitle"),
    rankingList: document.getElementById("rankingList"),
    playerCountPill: document.getElementById("playerCountPill"),
    commentaryFeed: document.getElementById("commentaryFeed"),
    resultModal: document.getElementById("resultModal"),
    podium: document.getElementById("podium"),
    closeResultBtn: document.getElementById("closeResultBtn"),
    playAgainFromModalBtn: document.getElementById("playAgainFromModalBtn")
  };

  const ctx = els.canvas.getContext("2d");
  const state = {
    running: false,
    duration: CONFIG.defaultDuration,
    elapsed: 0,
    lastFrame: 0,
    rafId: 0,
    racers: [],
    selectedMap: MAPS[0],
    lastNames: [],
    previousRanks: new Map(),
    lastRankRender: 0,
    images: new Map(),
    dpr: 1,
    canvasWidth: 1100,
    canvasHeight: 620,
    finishReason: "",
    lastGlobalCommentAt: 0
  };

  init();

  function init() {
    populateMapSelect();
    loadAnimalImages();
    bindEvents();
    syncDuration(CONFIG.defaultDuration);
    resizeCanvas();
    drawIdle();
    updateRanking([]);

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        resizeCanvas();
        drawScene();
      }).observe(els.canvasWrap);
    } else {
      window.addEventListener("resize", () => {
        resizeCanvas();
        drawScene();
      });
    }
  }

  function populateMapSelect() {
    els.mapSelect.innerHTML = MAPS.map(map => `<option value="${map.id}">${map.name}</option>`).join("");
    els.mapTitle.textContent = MAPS[0].name;
  }

  function bindEvents() {
    document.querySelectorAll("[data-sample]").forEach(btn => {
      btn.addEventListener("click", () => {
        const count = Number(btn.dataset.sample);
        els.playersInput.value = SAMPLE_NAMES[count].join("\n");
        setMessage("");
      });
    });

    els.mapSelect.addEventListener("change", () => {
      state.selectedMap = MAPS.find(map => map.id === els.mapSelect.value) || MAPS[0];
      els.mapTitle.textContent = state.selectedMap.name;
      drawScene();
    });

    els.randomMapBtn.addEventListener("click", () => {
      const currentIndex = MAPS.findIndex(map => map.id === els.mapSelect.value);
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex && MAPS.length > 1) {
        nextIndex = Math.floor(Math.random() * MAPS.length);
      }
      els.mapSelect.value = MAPS[nextIndex].id;
      state.selectedMap = MAPS[nextIndex];
      els.mapTitle.textContent = state.selectedMap.name;
      addComment(`Map được random: ${state.selectedMap.name}. Nhánh tắt hôm nay nhìn rất đáng ngờ!`);
      drawScene();
    });

    els.durationRange.addEventListener("input", () => syncDuration(Number(els.durationRange.value)));
    els.durationNumber.addEventListener("change", () => syncDuration(Number(els.durationNumber.value)));

    els.startBtn.addEventListener("click", () => startRace(false));
    els.replayBtn.addEventListener("click", () => startRace(true));
    els.resetNamesBtn.addEventListener("click", resetNames);
    els.closeResultBtn.addEventListener("click", hideResult);
    els.playAgainFromModalBtn.addEventListener("click", () => {
      hideResult();
      startRace(true);
    });
  }

  function loadAnimalImages() {
    ANIMALS.forEach(animal => {
      const img = new Image();
      img.onload = () => state.images.set(animal.key, img);
      img.onerror = () => state.images.delete(animal.key);
      img.src = animal.asset;
    });
  }

  function syncDuration(rawValue) {
    const clean = clamp(Number.isFinite(rawValue) ? rawValue : CONFIG.defaultDuration, CONFIG.minDuration, CONFIG.maxDuration);
    const rounded = Math.round(clean / 5) * 5;
    state.duration = rounded;
    els.durationRange.value = String(rounded);
    els.durationNumber.value = String(rounded);
    els.durationOutput.textContent = `${rounded} giây`;
    els.clockLabel.textContent = formatTime(rounded);
  }

  function resizeCanvas() {
    const rect = els.canvasWrap.getBoundingClientRect();
    const cssWidth = Math.max(320, rect.width || 1100);
    const cssHeight = Math.max(340, els.canvas.getBoundingClientRect().height || 620);
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.canvasWidth = cssWidth;
    state.canvasHeight = cssHeight;
    els.canvas.width = Math.round(cssWidth * state.dpr);
    els.canvas.height = Math.round(cssHeight * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function getNamesFromInput() {
    const seen = new Set();
    return els.playersInput.value
      .split("\n")
      .map(name => name.trim())
      .filter(Boolean)
      .map(name => name.slice(0, 28))
      .filter(name => {
        const key = name.toLocaleLowerCase("vi");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function validateNames(names) {
    if (names.length < CONFIG.minPlayers) return `Cần tối thiểu ${CONFIG.minPlayers} người chơi.`;
    if (names.length > CONFIG.maxPlayers) return `Tối đa ${CONFIG.maxPlayers} người chơi. Anh đang nhập ${names.length} người.`;
    return "";
  }

  function startRace(useLastNames) {
    const names = useLastNames && state.lastNames.length ? [...state.lastNames] : getNamesFromInput();
    const error = validateNames(names);
    if (error) {
      setMessage(error);
      return;
    }

    hideResult();
    cancelAnimationFrame(state.rafId);
    state.running = true;
    state.elapsed = 0;
    state.lastFrame = performance.now();
    state.lastNames = [...names];
    state.previousRanks.clear();
    state.lastRankRender = 0;
    state.finishReason = "";
    state.lastGlobalCommentAt = 0;
    state.selectedMap = MAPS.find(map => map.id === els.mapSelect.value) || MAPS[0];
    state.racers = createRacers(names);

    els.startBtn.disabled = true;
    els.replayBtn.disabled = true;
    els.raceStatus.textContent = "Cuộc đua đang diễn ra. Cẩn thận nhánh tắt và đoạn hẹp!";
    setMessage("");
    addComment(`Cuộc đua bắt đầu tại ${state.selectedMap.name}. ${names.length} tay đua đã xuất phát!`, true);
    updateRanking(state.racers);
    drawScene();
    state.rafId = requestAnimationFrame(tick);
  }

  function createRacers(names) {
    const animals = shuffle([...ANIMALS]);
    return names.map((name, index) => {
      const animal = animals[index % animals.length];
      const base = 0.020 + Math.random() * 0.0075;
      return {
        id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
        name,
        animal,
        lane: index,
        stats: {
          baseSpeed: base,
          burst: randomBetween(0.35, 1.0),
          stability: randomBetween(0.30, 1.0),
          luck: randomBetween(0.25, 1.0),
          courage: randomBetween(0.25, 1.0)
        },
        progress: 0,
        visualProgress: 0,
        modifier: 1,
        modifierUntil: 0,
        triedShortcut: false,
        onShortcut: false,
        shortcutFailed: false,
        shortcutBonusApplied: false,
        lastBumpAt: -99,
        lastEventAt: -99,
        finished: false,
        finishTime: null,
        bubbleText: "",
        bubbleAt: 0,
        isBursting: false,
        trail: [],
        currentPoint: { x: 0, y: 0 },
        rank: index + 1
      };
    });
  }

  function tick(now) {
    const dt = Math.min(0.05, Math.max(0, (now - state.lastFrame) / 1000));
    state.lastFrame = now;
    state.elapsed += dt;

    updateRace(dt, now);
    drawScene();

    if (now - state.lastRankRender > CONFIG.rankRefreshMs) {
      updateRanking(state.racers);
      state.lastRankRender = now;
    }

    const remaining = Math.max(0, state.duration - state.elapsed);
    els.clockLabel.textContent = formatTime(remaining);

    const finished = state.racers.some(racer => racer.finished);
    if (finished || remaining <= 0) {
      stopRace(finished ? "finish" : "time");
      return;
    }

    state.rafId = requestAnimationFrame(tick);
  }

  function updateRace(dt, now) {
    const map = state.selectedMap;
    const sorted = getSortedRacers(state.racers);
    const leaderProgress = sorted[0]?.progress || 0;
    const finalPhase = state.elapsed / state.duration >= CONFIG.finalPhaseRatio;
    const speedScale = 30 / state.duration;

    state.racers.forEach(racer => {
      if (racer.finished) return;

      maybeEnterShortcut(racer, map, now);
      maybeTriggerEvent(racer, finalPhase, dt, now);

      const gap = Math.max(0, leaderProgress - racer.progress);
      const rubber = 1 + Math.min(CONFIG.rubberBandMax, gap * 0.58);
      const isLeaderFar = sorted[0]?.id === racer.id && sorted.length > 1 && racer.progress - sorted[1].progress > 0.10;
      const leaderBrake = isLeaderFar ? CONFIG.leaderBrake : 1;
      const eventMod = now < racer.modifierUntil ? racer.modifier : 1;
      const shortcutMod = racer.onShortcut ? CONFIG.shortcutBoost : 1;
      const finalBoost = finalPhase ? 1 + racer.stats.burst * 0.10 : 1;
      const speed = racer.stats.baseSpeed * speedScale * rubber * leaderBrake * eventMod * shortcutMod * finalBoost;

      racer.progress += speed * dt;
      racer.visualProgress += (racer.progress - racer.visualProgress) * Math.min(1, dt * 9);

      if (racer.onShortcut && racer.progress >= map.shortcut.exit) {
        exitShortcut(racer, map, now);
      }

      if (racer.progress >= 1) {
        racer.progress = 1;
        racer.visualProgress = 1;
        racer.finished = true;
        racer.finishTime = state.elapsed;
        addBubble(racer, "Về đích!", now);
        addComment(`${racer.name} cán đích trước! Bảng top 3 đang chốt kết quả.`);
      }
    });

    resolveCrowding(dt, now);
    updateRacerPoints();
  }

  function maybeEnterShortcut(racer, map, now) {
    if (racer.triedShortcut || racer.onShortcut || racer.progress < map.shortcut.entry || racer.progress > map.shortcut.entry + 0.035) return;

    const choiceChance = 0.26 + racer.stats.courage * 0.35 + racer.stats.luck * 0.15;
    if (Math.random() < choiceChance) {
      racer.triedShortcut = true;
      racer.onShortcut = true;
      racer.shortcutFailed = false;
      racer.shortcutBonusApplied = false;
      addBubble(racer, "Rẽ tắt!", now);
      addComment(`${racer.name} liều lĩnh rẽ vào ${map.shortcut.label}!`);

      const incidentChance = 0.42 - racer.stats.stability * 0.18 - racer.stats.luck * 0.10 + racer.stats.courage * 0.09;
      if (Math.random() < incidentChance) {
        racer.shortcutFailed = true;
        applyModifier(racer, 0.36, CONFIG.shortcutPenaltySeconds, now);
        addBubble(racer, "Kẹt nhánh hẹp!", now + 50);
        addComment(`${racer.name} bị kẹt ở nhánh hẹp, lợi thế đường tắt đang hóa rủi ro!`);
      }
    } else {
      racer.triedShortcut = true;
    }
  }

  function exitShortcut(racer, map, now) {
    racer.onShortcut = false;
    if (!racer.shortcutFailed && !racer.shortcutBonusApplied) {
      racer.progress = Math.min(0.98, racer.progress + 0.035 + racer.stats.luck * 0.018);
      racer.shortcutBonusApplied = true;
      addBubble(racer, "Thoát hiểm!", now);
      addComment(`${racer.name} thoát hiểm đường tắt và được lợi thế rõ rệt!`);
    }
  }

  function maybeTriggerEvent(racer, finalPhase, dt, now) {
    if (now - racer.lastEventAt < 650) return;

    const danger = racer.onShortcut ? 1.75 : 1;
    const finalRate = finalPhase ? 1.55 : 1;
    const rate = CONFIG.eventBaseRate * danger * finalRate;
    if (Math.random() > rate * dt) return;

    let pool = EVENT_LIBRARY;
    if (finalPhase && Math.random() < 0.44) {
      pool = EVENT_LIBRARY.filter(event => event.key === "burst" || event.key === "tailwind" || event.key === "corner-slip");
    }

    const event = weightedEvent(pool, racer, finalPhase);
    racer.lastEventAt = now;
    applyModifier(racer, event.mod, event.seconds, now);
    racer.isBursting = event.key === "burst" || event.key === "tailwind";
    window.setTimeout(() => {
      racer.isBursting = false;
    }, event.seconds * 1000);
    addBubble(racer, event.bubble, now);
    addComment(event.text(racer.name));
  }

  function weightedEvent(pool, racer, finalPhase) {
    const weights = pool.map(event => {
      if (event.kind === "good") return 0.8 + racer.stats.luck * 0.55 + (finalPhase ? racer.stats.burst * 0.75 : 0);
      return 1.0 + (1 - racer.stats.stability) * 0.55 + (racer.onShortcut ? 0.35 : 0);
    });
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function resolveCrowding(dt, now) {
    const racers = state.racers.filter(racer => !racer.finished).sort((a, b) => b.progress - a.progress);
    const [narrowStart, narrowEnd] = state.selectedMap.narrow;

    for (let i = 0; i < racers.length - 1; i++) {
      const front = racers[i];
      const back = racers[i + 1];
      const distance = Math.abs(front.progress - back.progress);
      const inNarrow = isProgressInArc(front.progress, narrowStart, narrowEnd) || isProgressInArc(back.progress, narrowStart, narrowEnd);
      const threshold = inNarrow ? CONFIG.narrowDistance : CONFIG.closeDistance;

      if (distance < threshold && now - back.lastBumpAt > 1100 && Math.random() < dt * (inNarrow ? 2.0 : 0.78)) {
        back.lastBumpAt = now;
        front.lastBumpAt = now;

        if (Math.random() < 0.48 + back.stats.luck * 0.22) {
          applyModifier(back, 1.13, 0.85, now);
          addBubble(back, "Đu bám!", now);
          addComment(`${back.name} đang đu bám ${front.name} để áp sát vị trí phía trước!`);
        } else {
          applyModifier(back, 0.68, 0.86, now);
          applyModifier(front, 0.92, 0.56, now);
          addBubble(back, "Chen lấn!", now);
          addComment(`${back.name} và ${front.name} chen lấn ở đoạn hẹp, tốc độ bị xáo trộn!`);
        }
      }
    }
  }

  function applyModifier(racer, modifier, seconds, now) {
    racer.modifier = modifier;
    racer.modifierUntil = Math.max(racer.modifierUntil, now + seconds * 1000);
  }

  function updateRacerPoints() {
    state.racers.forEach(racer => {
      const point = getRacerPoint(racer);
      racer.currentPoint = point;
      if (racer.isBursting) {
        racer.trail.unshift({ x: point.x, y: point.y, at: performance.now(), color: racer.animal.color });
      }
      racer.trail = racer.trail.slice(0, 9);
    });
  }

  function getRacerPoint(racer) {
    const map = state.selectedMap;
    const laneOffset = getLaneOffset(racer.lane, state.racers.length);
    const p = clamp(racer.visualProgress, 0, 1);
    if (racer.onShortcut) {
      return getShortcutPoint(map, p, laneOffset * 0.38);
    }
    return getOvalPoint(p, laneOffset);
  }

  function getLaneOffset(lane, total) {
    const safeTotal = Math.max(1, total);
    const raw = lane - (safeTotal - 1) / 2;
    return raw * clamp(72 / safeTotal, 5.5, 9.5);
  }

  function getOvalMetrics() {
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    return {
      cx: w * 0.50,
      cy: h * 0.52,
      rx: Math.max(180, w * 0.36),
      ry: Math.max(112, h * 0.30)
    };
  }

  function getOvalPoint(progress, laneOffset = 0) {
    const { cx, cy, rx, ry } = getOvalMetrics();
    const angle = -Math.PI / 2 + progress * Math.PI * 2;
    const x = cx + (rx + laneOffset) * Math.cos(angle);
    const y = cy + (ry + laneOffset * 0.58) * Math.sin(angle);
    return { x, y, angle };
  }

  function getShortcutPoint(map, progress, laneOffset = 0) {
    const start = getOvalPoint(map.shortcut.entry, laneOffset);
    const end = getOvalPoint(map.shortcut.exit, laneOffset);
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    const t = clamp((progress - map.shortcut.entry) / (map.shortcut.exit - map.shortcut.entry), 0, 1);
    const cp1 = { x: map.shortcut.cp1[0] * w, y: map.shortcut.cp1[1] * h };
    const cp2 = { x: map.shortcut.cp2[0] * w, y: map.shortcut.cp2[1] * h };
    const point = cubicBezier(start, cp1, cp2, end, t);
    point.angle = 0;
    return point;
  }

  function cubicBezier(p0, p1, p2, p3, t) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
    };
  }

  function drawIdle() {
    drawScene();
  }

  function drawScene() {
    const map = state.selectedMap;
    const w = state.canvasWidth;
    const h = state.canvasHeight;

    ctx.clearRect(0, 0, w, h);
    drawBackground(map);
    drawTrack(map);
    drawDecorations(map);
    drawTrails();
    drawRacers();
  }

  function drawBackground(map) {
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, map.bgA);
    grad.addColorStop(1, map.bgB);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.34;
    for (let i = 0; i < 18; i++) {
      const x = ((i * 97) % w) + Math.sin(i) * 26;
      const y = ((i * 53) % h) + Math.cos(i * 0.8) * 18;
      ctx.beginPath();
      ctx.arc(x, y, 18 + (i % 4) * 9, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "#FFFFFF" : "#C8FFF0";
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTrack(map) {
    const { cx, cy, rx, ry } = getOvalMetrics();

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Bong ngoai cua duong dua
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8, rx + 34, ry + 34, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(18, 55, 42, 0.09)";
    ctx.lineWidth = 74;
    ctx.stroke();

    // Nen duong dua chinh
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = map.track;
    ctx.lineWidth = 66;
    ctx.stroke();

    // Vien duong dua
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Vach ke duong dua
    ctx.setLineDash([14, 18]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = map.lane;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);

    // Duong tat
    drawShortcut(map);

    // Vach xuat phat / ve dich
    const start = getOvalPoint(0, 0);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(0.02);
    for (let i = -3; i <= 3; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#12372A" : "#FFFFFF";
      ctx.fillRect(i * 10, -40, 10, 80);
    }
    ctx.restore();

    // Danh dau doan hep
    drawArcSegment(map.narrow[0], map.narrow[1], "rgba(251, 113, 133, 0.42)", 75);
    ctx.restore();
  }

  function drawShortcut(map) {
    const start = getOvalPoint(map.shortcut.entry, 0);
    const end = getOvalPoint(map.shortcut.exit, 0);
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    const cp1 = { x: map.shortcut.cp1[0] * w, y: map.shortcut.cp1[1] * h };
    const cp2 = { x: map.shortcut.cp2[0] * w, y: map.shortcut.cp2[1] * h };

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.strokeStyle = "rgba(18,55,42,0.11)";
    ctx.lineWidth = 48;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.strokeStyle = "rgba(250, 204, 21, 0.72)";
    ctx.lineWidth = 34;
    ctx.stroke();

    ctx.setLineDash([8, 14]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);

    drawMiniSign(start.x, start.y, "TẮT");
    drawMiniSign(end.x, end.y, "RA");
    ctx.restore();
  }

  function drawArcSegment(startProgress, endProgress, color, width) {
    const { cx, cy, rx, ry } = getOvalMetrics();
    const startAngle = -Math.PI / 2 + startProgress * Math.PI * 2;
    const endAngle = -Math.PI / 2 + endProgress * Math.PI * 2;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawMiniSign(x, y, text) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#12372A";
    roundRect(ctx, -24, -18, 48, 28, 10);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 12px Segoe UI, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, -4);
    ctx.restore();
  }

  function drawDecorations(map) {
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    const items = map.decor === "wind" ? ["💨", "🌿", "🫧"] : map.decor === "candy" ? ["🍬", "🌸", "🫧"] : map.decor === "gold" ? ["⭐", "🌾", "🟡"] : map.decor === "bamboo" ? ["🎋", "🌱", "🍃"] : ["🪷", "🌿", "🫧"];

    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 16; i++) {
      const x = 38 + ((i * 139) % Math.max(1, w - 76));
      const y = 38 + ((i * 91) % Math.max(1, h - 76));
      const center = getOvalMetrics();
      const insideTrack = Math.abs(((x - center.cx) / center.rx) ** 2 + ((y - center.cy) / center.ry) ** 2 - 1) < 0.28;
      if (insideTrack) continue;
      ctx.font = `${18 + (i % 3) * 5}px Segoe UI Emoji`;
      ctx.fillText(items[i % items.length], x, y);
    }
    ctx.restore();
  }

  function drawTrails() {
    const now = performance.now();
    state.racers.forEach(racer => {
      racer.trail.forEach((point, index) => {
        const age = now - point.at;
        const alpha = clamp(1 - age / 700, 0, 0.58) * (1 - index / 11);
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 13 - index * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
        ctx.restore();
      });
      racer.trail = racer.trail.filter(point => now - point.at < 720);
    });
  }

  function drawRacers() {
    const racers = [...state.racers].sort((a, b) => a.lane - b.lane);
    racers.forEach(racer => drawRacer(racer));
  }

  function drawRacer(racer) {
    const point = racer.currentPoint.x ? racer.currentPoint : getRacerPoint(racer);
    const radius = clamp(19 + state.canvasWidth * 0.005, 20, 29);
    const img = state.images.get(racer.animal.key);

    ctx.save();
    ctx.translate(point.x, point.y);

    // Bong con vat
    ctx.beginPath();
    ctx.ellipse(2, radius + 10, radius * 0.82, radius * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18, 55, 42, 0.18)";
    ctx.fill();

    // Nen tron
    ctx.beginPath();
    ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
    ctx.fillStyle = racer.animal.color;
    ctx.globalAlpha = 0.95;
    ctx.fill();
    ctx.globalAlpha = 1;

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius + 1, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    } else {
      ctx.font = `${radius + 13}px Segoe UI Emoji, Apple Color Emoji, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(racer.animal.emoji, 0, 2);
    }

    // Bang ten ngan, tranh tran khung
    ctx.font = "900 12px Segoe UI, Arial";
    const label = truncateText(ctx, racer.name, 88);
    const labelWidth = Math.min(104, ctx.measureText(label).width + 18);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    roundRect(ctx, -labelWidth / 2, radius + 12, labelWidth, 24, 12);
    ctx.fill();
    ctx.fillStyle = "#12372A";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, radius + 24);
    ctx.restore();
  }

  function truncateText(context, text, maxWidth) {
    if (context.measureText(text).width <= maxWidth) return text;
    let output = text;
    while (output.length > 1 && context.measureText(`${output}…`).width > maxWidth) {
      output = output.slice(0, -1);
    }
    return `${output}…`;
  }

  function updateRanking(racers) {
    const sorted = getSortedRacers(racers);
    els.playerCountPill.textContent = `${sorted.length} tay đua`;

    if (!sorted.length) {
      els.rankingList.innerHTML = `<li class="rank-item"><span class="rank-pos">?</span><div class="rank-name"><span>Chưa có tay đua</span></div><div class="rank-meta">0%</div></li>`;
      return;
    }

    els.rankingList.innerHTML = sorted.map((racer, index) => {
      const progressPercent = Math.round(clamp(racer.progress, 0, 1) * 100);
      const className = `rank-item rank-${Math.min(index + 1, 3)}`;
      return `
        <li class="${className}" data-racer-id="${racer.id}">
          <span class="rank-pos">${index + 1}</span>
          <div class="rank-name" title="${escapeHtml(racer.name)}">
            <span class="rank-avatar">${racer.animal.emoji}</span>
            <span>${escapeHtml(racer.name)}</span>
          </div>
          <div class="rank-meta">${progressPercent}%</div>
          <div class="rank-progress" aria-hidden="true"><span style="width:${progressPercent}%"></span></div>
        </li>
      `;
    }).join("");

    sorted.forEach((racer, index) => {
      const previous = state.previousRanks.get(racer.id);
      const next = index + 1;
      racer.rank = next;
      if (previous && previous !== next) {
        const item = els.rankingList.querySelector(`[data-racer-id="${CSS.escape(racer.id)}"]`);
        if (item) {
          item.classList.remove("rank-bounce");
          void item.offsetWidth;
          item.classList.add("rank-bounce");
        }
      }
      state.previousRanks.set(racer.id, next);
    });
  }

  function getSortedRacers(racers) {
    return [...racers].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
  }

  function stopRace(reason) {
    state.running = false;
    state.finishReason = reason;
    cancelAnimationFrame(state.rafId);
    els.startBtn.disabled = false;
    els.replayBtn.disabled = false;
    els.raceStatus.textContent = reason === "finish" ? "Đã có tay đua hoàn thành vòng đua. Kết quả đã được chốt." : "Hết giờ. Bảng xếp hạng được chốt theo quãng đường đã chạy.";
    updateRanking(state.racers);
    showResult();
    launchConfetti();
  }

  function showResult() {
    const top = getSortedRacers(state.racers).slice(0, Math.min(3, state.racers.length));
    const notes = ["Bứt lên đúng lúc", "Bám đuổi rất sát", "Giữ phong độ ổn định"];
    els.podium.innerHTML = top.map((racer, index) => `
      <div class="podium-item">
        <div class="podium-rank">Top ${index + 1}</div>
        <div>
          <div class="podium-name">${racer.animal.emoji} ${escapeHtml(racer.name)}</div>
          <div class="podium-note">${notes[index]} • ${Math.round(racer.progress * 100)}% đường đua</div>
        </div>
        <strong>${index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"}</strong>
      </div>
    `).join("");
    els.resultModal.classList.add("show");
    els.resultModal.setAttribute("aria-hidden", "false");
  }

  function hideResult() {
    els.resultModal.classList.remove("show");
    els.resultModal.setAttribute("aria-hidden", "true");
  }

  function addComment(text, clear = false) {
    if (clear) els.commentaryFeed.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = text;
    els.commentaryFeed.prepend(p);
    while (els.commentaryFeed.children.length > CONFIG.maxComments) {
      els.commentaryFeed.removeChild(els.commentaryFeed.lastElementChild);
    }
  }

  function addBubble(racer, text, now) {
    racer.bubbleText = text;
    racer.bubbleAt = now;
    const point = racer.currentPoint.x ? racer.currentPoint : getRacerPoint(racer);
    const bubble = document.createElement("div");
    bubble.className = "incident-bubble";
    bubble.textContent = text;
    bubble.style.left = `${point.x}px`;
    bubble.style.top = `${point.y}px`;
    els.canvasWrap.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), CONFIG.bubbleLifeMs);
  }

  function launchConfetti() {
    const colors = ["#2DD4BF", "#34D399", "#FACC15", "#FB7185", "#FFFFFF"];
    const total = 70;
    for (let i = 0; i < total; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.35}s`;
      piece.style.animationDuration = `${1.15 + Math.random() * 0.85}s`;
      piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 2500);
    }
  }

  function resetNames() {
    els.playersInput.value = "";
    setMessage("Đã xoá danh sách tên. Reload trang cũng sẽ reset toàn bộ ván đua.");
    state.racers = [];
    state.lastNames = [];
    els.replayBtn.disabled = true;
    els.raceStatus.textContent = "Nhập tên và bấm bắt đầu để vào đường đua.";
    addComment("Danh sách đã reset. Sân đua đang chờ đội mới.", true);
    updateRanking([]);
    drawScene();
  }

  function setMessage(message) {
    els.setupMessage.textContent = message;
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Math.ceil(seconds));
    const mm = String(Math.floor(safe / 60)).padStart(2, "0");
    const ss = String(safe % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function isProgressInArc(progress, start, end) {
    if (start <= end) return progress >= start && progress <= end;
    return progress >= start || progress <= end;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();

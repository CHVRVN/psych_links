// app.js — UNSAID MVP demo logic. No backend, no real NLP, fully scripted.

(function () {
  const screens = ["picker", "landing", "checkin", "reveal", "map", "timeline", "dashboard", "closing"];
  let chartInstance = null;
  let selectedMoodIdx = null;
  let currentScenarioIdx = 0;

  // ---------- Deterministic PRNG (mulberry32) so each scenario's chart is stable across renders ----------
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildEmotionalMap(scenario) {
    const rand = mulberry32(scenario.seed);
    const spikeSet = new Set(scenario.spikeDays);
    const primary = [], secondary1 = [], secondary2 = [], secondary3 = [];
    for (let d = 1; d <= 30; d++) {
      if (spikeSet.has(d)) {
        primary.push(round1(7.4 + rand() * 1.5));
      } else {
        primary.push(round1(0.5 + rand() * 2.0));
      }
      secondary1.push(round1(1.5 + rand() * 3.0));
      secondary3.push(round1(1.0 + rand() * 2.5));
      const base = 7 - primary[primary.length - 1] * 0.4;
      secondary2.push(round1(Math.max(2, Math.min(9, base + (rand() - 0.5) * 2))));
    }
    return {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      primary, secondary1, secondary2, secondary3
    };
  }
  function round1(n) { return Math.round(n * 10) / 10; }

  function goTo(id) {
    screens.forEach((s) => {
      const el = document.getElementById(`screen-${s}`);
      if (el) el.classList.toggle("active", s === id);
    });
    try { localStorage.setItem("unsaid_screen", id); } catch (e) {}
    if (id === "map") setTimeout(renderChart, 60);
  }

  function currentScenario() { return demoScenarios[currentScenarioIdx]; }

  // ---------- Scenario picker ----------
  function renderPicker() {
    const grid = document.getElementById("scenario-grid");
    grid.innerHTML = "";
    demoScenarios.forEach((s, i) => {
      const card = document.createElement("button");
      card.className = "scenario-card";
      card.type = "button";
      card.innerHTML = `
        <div class="icon">${s.icon}</div>
        <div class="s-title">${s.title}</div>
        <div class="s-tagline">${s.tagline}</div>
        <div class="s-emotion">${s.primaryEmotion}</div>
      `;
      card.addEventListener("click", () => selectScenario(i, "landing"));
      grid.appendChild(card);
    });
  }

  function renderQuickSwitch() {
    const menu = document.getElementById("quickswitch-menu");
    menu.innerHTML = "";
    demoScenarios.forEach((s, i) => {
      const item = document.createElement("div");
      item.className = "quickswitch-item" + (i === currentScenarioIdx ? " active" : "");
      item.innerHTML = `<span>${s.icon}</span><span>${s.title}</span>`;
      item.addEventListener("click", () => {
        selectScenario(i, "landing");
        document.getElementById("quickswitch-menu").classList.remove("open");
      });
      menu.appendChild(item);
    });
    document.getElementById("quickswitch-label").textContent = currentScenario().title;
  }

  function selectScenario(idx, landOn) {
    currentScenarioIdx = idx;
    resetInteractionState();
    renderQuickSwitch();
    renderTimeline();
    renderDashboard();
    chartInstance = null;
    document.getElementById("chart-legend").dataset.built = "";
    goTo(landOn || "landing");
  }

  function resetInteractionState() {
    selectedMoodIdx = null;
    document.querySelectorAll(".mood-chip").forEach((c) => c.classList.remove("selected"));
    const box = document.getElementById("journal-box");
    if (box) box.value = "";
    document.getElementById("btn-submit-checkin").disabled = true;
    document.getElementById("insight-card").classList.remove("reveal");
    document.getElementById("btn-see-patterns").style.display = "none";
    document.getElementById("micro-confirm").classList.remove("show");
  }

  // ---------- Mood chips ----------
  function renderMoods() {
    const grid = document.getElementById("mood-grid");
    grid.innerHTML = "";
    moodOptions.forEach((m, i) => {
      const chip = document.createElement("button");
      chip.className = "mood-chip";
      chip.type = "button";
      chip.innerHTML = `<span>${m.emoji}</span><span>${m.label}</span>`;
      chip.addEventListener("click", () => {
        document.querySelectorAll(".mood-chip").forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        selectedMoodIdx = i;
        updateSubmitState();
      });
      grid.appendChild(chip);
    });
  }

  function updateSubmitState() {
    const text = document.getElementById("journal-box").value.trim();
    document.getElementById("btn-submit-checkin").disabled = !(selectedMoodIdx !== null && text.length > 0);
  }

  function typeText(el, text, speed = 12) {
    return new Promise((resolve) => {
      el.value = "";
      let i = 0;
      const interval = setInterval(() => {
        el.value += text.charAt(i);
        i++;
        if (i >= text.length) { clearInterval(interval); resolve(); }
      }, speed);
    });
  }

  // ---------- Screen 3: fill said-vs-meant ----------
  function fillReveal() {
    const s = currentScenario();
    const sv = s.saidVsMeant;
    document.getElementById("box-happened").textContent = sv.whatHappened;
    document.getElementById("box-said").textContent = sv.whatISaid;
    document.getElementById("box-felt").textContent = sv.whatIFelt;
    document.getElementById("box-wanted").textContent = sv.whatIWanted;
    document.getElementById("insight-text").textContent = s.aiObservation;
    document.getElementById("reflection-prompt").textContent = s.reflectionPrompt;

    document.getElementById("insight-card").classList.remove("reveal");
    document.getElementById("btn-see-patterns").style.display = "none";
    document.getElementById("micro-confirm").classList.remove("show");

    setTimeout(() => document.getElementById("insight-card").classList.add("reveal"), 850);
  }

  // ---------- Chart ----------
  const CHART_COLORS = {
    primary: "#1A1A19",
    secondary1: "#EA4630",
    secondary2: "#B7B2A3",
    secondary3: "#D8A170"
  };

  function renderChart() {
    const ctx = document.getElementById("emotionChart");
    if (!ctx) return;
    const s = currentScenario();
    const d = buildEmotionalMap(s);

    document.getElementById("map-sub").textContent =
      `Last 30 days, tracking ${s.primaryEmotion.toLowerCase()} against ${s.secondaryEmotions.map(x => x.toLowerCase()).join(", ")}.`;

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: s.primaryEmotion,
            data: d.primary,
            borderColor: CHART_COLORS.primary,
            backgroundColor: "rgba(26,26,25,0.06)",
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: (c) => (s.spikeDays.includes(c.dataIndex + 1) ? 5 : 0),
            pointBackgroundColor: CHART_COLORS.primary,
            pointHoverRadius: 6
          },
          { label: s.secondaryEmotions[0], data: d.secondary1, borderColor: CHART_COLORS.secondary1, backgroundColor: "transparent", tension: 0.35, borderWidth: 2, pointRadius: 0 },
          { label: s.secondaryEmotions[1], data: d.secondary2, borderColor: CHART_COLORS.secondary2, backgroundColor: "transparent", tension: 0.35, borderWidth: 2, pointRadius: 0, borderDash: [4, 3] },
          { label: s.secondaryEmotions[2], data: d.secondary3, borderColor: CHART_COLORS.secondary3, backgroundColor: "transparent", tension: 0.35, borderWidth: 2, pointRadius: 0, borderDash: [2, 3] }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 10, grid: { color: "#EFECE4" }, ticks: { color: "#8B887F", font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { color: "#8B887F", font: { size: 10 }, maxTicksLimit: 10 } }
        },
        interaction: { intersect: false, mode: "index" }
      }
    });

    const legend = document.getElementById("chart-legend");
    legend.dataset.built = "1";
    const items = [
      { label: s.primaryEmotion, color: CHART_COLORS.primary },
      { label: s.secondaryEmotions[0], color: CHART_COLORS.secondary1 },
      { label: s.secondaryEmotions[1], color: CHART_COLORS.secondary2 },
      { label: s.secondaryEmotions[2], color: CHART_COLORS.secondary3 }
    ];
    legend.innerHTML = items.map((i) => `<div class="legend-item"><span class="legend-dot" style="background:${i.color}"></span>${i.label}</div>`).join("");

    setTimeout(() => {
      const meta = chartInstance.getDatasetMeta(0);
      const spikeIndex = s.spikeDays[s.spikeDays.length - 1] - 1;
      const point = meta.data[spikeIndex];
      const callout = document.getElementById("pattern-callout");
      if (point && callout) {
        callout.style.left = `${point.x - 70}px`;
        callout.style.top = `${point.y - 46}px`;
        callout.classList.add("show");
      }
    }, 500);
  }

  // ---------- Timeline ----------
  function renderTimeline() {
    const list = document.getElementById("timeline-list");
    list.innerHTML = "";
    currentScenario().timeline.forEach((t) => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `
        <div class="timeline-item-top">
          <span class="timeline-date">${t.date}</span>
          <span class="timeline-label">${t.label}</span>
          <span class="timeline-chevron">\u203a</span>
        </div>
        <div class="timeline-context">${t.context}</div>
      `;
      item.addEventListener("click", () => item.classList.toggle("expanded"));
      list.appendChild(item);
    });
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    const s = currentScenario();
    const stats = s.dashboardStats;
    document.getElementById("dash-stats").innerHTML = `
      <div class="stat-card"><div class="stat-number">${stats.streak} days</div><div class="stat-label">Check-in streak</div></div>
      <div class="stat-card"><div class="stat-number">${stats.vocabWords}</div><div class="stat-label">New emotion words used this month</div></div>
      <div class="stat-card"><div class="stat-number">${stats.entriesLogged}</div><div class="stat-label">Entries logged</div></div>
    `;
    document.getElementById("practice-example").textContent = s.suggestedRewrite;
  }

  // ---------- Wire up events ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderPicker();
    renderMoods();
    renderQuickSwitch();
    renderTimeline();
    renderDashboard();

    document.getElementById("btn-start-demo").addEventListener("click", () => goTo("checkin"));
    document.getElementById("btn-back-1").addEventListener("click", () => goTo("landing"));

    document.getElementById("journal-box").addEventListener("input", updateSubmitState);

    document.getElementById("btn-try-example").addEventListener("click", async (e) => {
      e.preventDefault();
      const s = currentScenario();
      const box = document.getElementById("journal-box");
      if (selectedMoodIdx === null) {
        selectedMoodIdx = s.moodDefault;
        const chips = document.querySelectorAll(".mood-chip");
        chips[s.moodDefault] && chips[s.moodDefault].classList.add("selected");
      }
      await typeText(box, s.journalExample, 11);
      updateSubmitState();
    });

    document.getElementById("btn-submit-checkin").addEventListener("click", () => {
      const overlay = document.getElementById("analyzing-overlay");
      overlay.classList.add("active");
      setTimeout(() => {
        overlay.classList.remove("active");
        fillReveal();
        goTo("reveal");
      }, 1700);
    });

    document.getElementById("btn-resonate-yes").addEventListener("click", () => {
      document.getElementById("micro-confirm").classList.add("show");
      document.getElementById("btn-see-patterns").style.display = "inline-block";
    });
    document.getElementById("btn-resonate-no").addEventListener("click", () => {
      document.getElementById("micro-confirm").classList.add("show");
      document.getElementById("btn-see-patterns").style.display = "inline-block";
    });

    document.getElementById("btn-see-patterns").addEventListener("click", () => goTo("map"));
    document.getElementById("btn-back-4").addEventListener("click", () => goTo("reveal"));
    document.getElementById("btn-to-timeline").addEventListener("click", () => goTo("timeline"));
    document.getElementById("btn-back-5").addEventListener("click", () => goTo("map"));
    document.getElementById("btn-to-dashboard").addEventListener("click", () => goTo("dashboard"));
    document.getElementById("btn-back-6").addEventListener("click", () => goTo("timeline"));
    document.getElementById("btn-to-closing").addEventListener("click", () => goTo("closing"));

    document.getElementById("restart-btn").addEventListener("click", () => goTo("picker"));
    document.getElementById("btn-another-story").addEventListener("click", () => goTo("picker"));
    document.getElementById("btn-restart-final").addEventListener("click", () => {
      resetInteractionState();
      goTo("landing");
    });

    document.getElementById("quickswitch-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("quickswitch-menu").classList.toggle("open");
    });
    document.addEventListener("click", () => document.getElementById("quickswitch-menu").classList.remove("open"));

    goTo("picker");
  });
})();

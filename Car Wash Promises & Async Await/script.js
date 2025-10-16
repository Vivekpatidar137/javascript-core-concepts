// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  logs: [],
  stats: {
    totalWashes: 0,
    totalTime: 0,
    methodsUsed: new Set(),
  },
  lanes: [
    {
      id: 1,
      car: "🚗",
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    },
    {
      id: 2,
      car: "🚙",
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    },
    {
      id: 3,
      car: "🚕",
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    },
  ],
  isWashing: false,
};

// ============================================
// WASH STAGES CONFIGURATION
// ============================================
const stages = [
  {
    name: "Pre-rinse",
    emoji: "💧",
    duration: 2000,
    description: "Removing loose dirt",
  },
  {
    name: "Soap",
    emoji: "🫧",
    duration: 3000,
    description: "Applying cleaning solution",
  },
  {
    name: "Scrub",
    emoji: "🌀",
    duration: 4000,
    description: "Deep cleaning brushes",
  },
  {
    name: "Rinse",
    emoji: "💧",
    duration: 2000,
    description: "Washing off soap",
  },
  {
    name: "Dry",
    emoji: "💨",
    duration: 3000,
    description: "Air drying system",
  },
  {
    name: "Wax",
    emoji: "✨",
    duration: 2000,
    description: "Final polish & shine",
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
function addLog(message, type) {
  const timestamp = new Date().toLocaleTimeString();
  state.logs.push({
    message: message,
    type: type,
    timestamp: timestamp,
    id: Date.now(),
  });

  if (state.logs.length > 20) {
    state.logs.shift();
  }

  updateLogDisplay();
}

function updateLogDisplay() {
  const container = document.getElementById("log-container");

  if (state.logs.length === 0) {
    container.innerHTML =
      '<div class="log-empty">Click a wash button to start the demo...</div>';
    return;
  }

  container.innerHTML = state.logs
    .map(function (log) {
      return (
        '<div class="log-entry log-' +
        log.type +
        '">' +
        '<span class="log-timestamp">[' +
        log.timestamp +
        "]</span> " +
        log.message +
        "</div>"
      );
    })
    .join("");

  container.scrollTop = container.scrollHeight;
}

function updateStats(method, time) {
  state.stats.totalWashes++;
  state.stats.totalTime += time;
  state.stats.methodsUsed.add(method);

  document.getElementById("total-washes").textContent = state.stats.totalWashes;
  document.getElementById("total-time").textContent =
    (state.stats.totalTime / 1000).toFixed(1) + "s";

  const methodsContainer = document.getElementById("methods-used");
  methodsContainer.innerHTML = Array.from(state.stats.methodsUsed)
    .map(function (m) {
      return '<div class="method-badge">' + m + "</div>";
    })
    .join("");
}

function updateLaneUI(laneId, updates) {
  const lane = state.lanes.find(function (l) {
    return l.id === laneId;
  });
  Object.assign(lane, updates);

  const statusBadge = document.querySelector(
    "#lane-" + laneId + " .lane-status"
  );
  statusBadge.textContent = lane.status.toUpperCase();
  statusBadge.className = "lane-status status-" + lane.status;

  const carEmoji = document.getElementById("car-" + laneId);
  if (lane.error) {
    carEmoji.textContent = lane.car + "💥";
  } else if (lane.status === "complete") {
    carEmoji.textContent = lane.car + "✨";
  } else {
    carEmoji.textContent = lane.car;
  }

  const stageEl = document.getElementById("stage-" + laneId);
  stageEl.textContent = lane.stage || "Ready to wash";

  const progressBar = document.getElementById("progress-" + laneId);
  const percentEl = document.getElementById("percent-" + laneId);
  progressBar.style.width = lane.progress + "%";
  percentEl.textContent = Math.round(lane.progress) + "%";

  if (lane.error) {
    progressBar.className = "progress-bar error";
  } else if (lane.status === "complete") {
    progressBar.className = "progress-bar complete";
  } else {
    progressBar.className = "progress-bar";
  }

  const effectEl = document.getElementById("effect-" + laneId);
  if (lane.stage && lane.status === "washing") {
    const stage = stages.find(function (s) {
      return s.name === lane.stage;
    });
    effectEl.textContent = stage ? stage.emoji : "";
  } else {
    effectEl.textContent = "";
  }

  const errorEl = document.getElementById("error-" + laneId);
  errorEl.style.display = lane.error ? "flex" : "none";
}

function disableButtons(disabled) {
  state.isWashing = disabled;
  const buttons = document.querySelectorAll("button");
  buttons.forEach(function (btn) {
    btn.disabled = disabled;
  });
}

// ============================================
// CORE PROMISE FUNCTIONS - THIS IS THE KEY!
// ============================================

// This function returns a Promise that simulates a wash stage
function washStage(stageName, duration, laneId) {
  return new Promise(function (resolve, reject) {
    // 10% chance of error on scrub stage (for error handling demo)
    const shouldFail = stageName === "Scrub" && Math.random() < 0.1;

    setTimeout(function () {
      if (shouldFail) {
        reject(new Error("Machine malfunction!"));
      } else {
        resolve(stageName + " complete");
      }
    }, duration);
  });
}

// ============================================
// SEQUENTIAL WASH USING ASYNC/AWAIT
// ============================================
async function washCarSequential(laneId, carEmoji, washType) {
  const startTime = Date.now();
  const stagesToUse = washType === "express" ? stages.slice(0, 4) : stages;

  updateLaneUI(laneId, { status: "washing", progress: 0, error: false });
  addLog(
    carEmoji +
      " entered Lane " +
      laneId +
      " - " +
      washType.toUpperCase() +
      " wash starting!",
    "start"
  );

  try {
    // THIS IS THE KEY CONCEPT: Each await pauses until the Promise resolves!
    for (let i = 0; i < stagesToUse.length; i++) {
      const stage = stagesToUse[i];
      const progress = ((i + 1) / stagesToUse.length) * 100;

      updateLaneUI(laneId, { stage: stage.name, progress: progress - 20 });
      addLog(
        "Lane " +
          laneId +
          ": " +
          stage.emoji +
          " " +
          stage.name +
          " - " +
          stage.description +
          "...",
        "info"
      );

      // AWAIT makes JavaScript WAIT here until the Promise is resolved!
      // This is why each stage completes before the next one starts
      await washStage(stage.name, stage.duration, laneId);

      updateLaneUI(laneId, { progress: progress });
      addLog(
        "Lane " +
          laneId +
          ": " +
          stage.emoji +
          " " +
          stage.name +
          " complete! ✓",
        "success"
      );
    }

    const duration = Date.now() - startTime;
    updateLaneUI(laneId, {
      status: "complete",
      stage: "Complete",
      progress: 100,
    });
    addLog(
      "🎉 " +
        carEmoji +
        " Lane " +
        laneId +
        " finished! Sparkling clean in " +
        (duration / 1000).toFixed(1) +
        "s",
      "complete"
    );

    return { laneId: laneId, duration: duration, success: true };
  } catch (error) {
    // try/catch gracefully handles Promise rejections
    updateLaneUI(laneId, { status: "error", error: true });
    addLog(
      "❌ Lane " + laneId + ": " + error.message + " Wash interrupted!",
      "error"
    );
    return { laneId: laneId, duration: Date.now() - startTime, success: false };
  }
}

// ============================================
// BUTTON HANDLERS
// ============================================

// Handle single car wash (Sequential async/await)
async function handleSingleWash(washType) {
  if (state.isWashing) return;
  disableButtons(true);

  state.lanes[0] = {
    id: 1,
    car: "🚗",
    status: "waiting",
    stage: "",
    progress: 0,
    error: false,
  };
  updateLaneUI(1, state.lanes[0]);

  addLog(
    "🚀 Starting " + washType.toUpperCase() + " wash demo - Using async/await",
    "method"
  );

  const result = await washCarSequential(1, state.lanes[0].car, washType);

  if (result.success) {
    updateStats("async/await (sequential)", result.duration);
  }

  disableButtons(false);
}

// Handle parallel wash using Promise.all()
async function handleParallelWash() {
  if (state.isWashing) return;
  disableButtons(true);

  // Reset all lanes
  state.lanes = state.lanes.map(function (lane) {
    return {
      id: lane.id,
      car: lane.car,
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    };
  });
  state.lanes.forEach(function (lane) {
    updateLaneUI(lane.id, lane);
  });

  addLog("🚀 Starting PARALLEL wash - Using Promise.all()", "method");
  addLog("All 3 lanes washing simultaneously!", "info");

  const startTime = Date.now();

  try {
    // Create an array of Promises - one for each lane
    const washPromises = state.lanes.map(function (lane) {
      return washCarSequential(lane.id, lane.car, "standard");
    });

    // Promise.all() waits for ALL promises to complete
    // All lanes wash at the SAME TIME!
    const results = await Promise.all(washPromises);

    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(function (r) {
      return r.success;
    }).length;

    addLog(
      "✨ All lanes complete! " +
        successCount +
        "/3 successful in " +
        (totalDuration / 1000).toFixed(1) +
        "s",
      "complete"
    );
    updateStats("Promise.all() (parallel)", totalDuration);
  } catch (error) {
    addLog("⚠️ One or more washes failed!", "error");
  }

  disableButtons(false);
}

// Handle race mode using Promise.race()
async function handleRaceWash() {
  if (state.isWashing) return;
  disableButtons(true);

  // Reset all lanes
  state.lanes = state.lanes.map(function (lane) {
    return {
      id: lane.id,
      car: lane.car,
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    };
  });
  state.lanes.forEach(function (lane) {
    updateLaneUI(lane.id, lane);
  });

  addLog("🏁 Starting RACE MODE - Using Promise.race()", "method");
  addLog("First car to finish wins!", "info");

  const startTime = Date.now();

  try {
    // Start all washes with random types
    const washPromises = state.lanes.map(function (lane) {
      const washType = Math.random() > 0.5 ? "express" : "standard";
      return washCarSequential(lane.id, lane.car, washType);
    });

    // Promise.race() returns when the FIRST promise completes
    // The winner is whoever finishes first!
    const winner = await Promise.race(washPromises);

    const duration = Date.now() - startTime;
    addLog(
      "🏆 WINNER! Lane " +
        winner.laneId +
        " finished first in " +
        (duration / 1000).toFixed(1) +
        "s!",
      "complete"
    );
    updateStats("Promise.race() (first wins)", duration);

    // Let others finish in background
    Promise.all(washPromises).then(function () {
      addLog("🏁 All cars finished the race!", "info");
    });
  } catch (error) {
    addLog("Race interrupted!", "error");
  }

  disableButtons(false);
}

// Reset everything
function handleReset() {
  state.lanes = [
    {
      id: 1,
      car: "🚗",
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    },
    {
      id: 2,
      car: "🚙",
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    },
    {
      id: 3,
      car: "🚕",
      status: "waiting",
      stage: "",
      progress: 0,
      error: false,
    },
  ];
  state.logs = [];

  state.lanes.forEach(function (lane) {
    updateLaneUI(lane.id, lane);
  });
  updateLogDisplay();
}

// ============================================
// INITIALIZATION
// ============================================
console.log("🚗 Car Wash Simulator Ready!");
console.log("Click a button to see Promises & Async/Await in action!");

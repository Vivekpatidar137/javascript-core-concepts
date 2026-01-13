// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  currentSpeaker: "vivek",
  transcripts: [],
  hotkeys: [],
  stats: {
    totalCalls: 0,
    callUsed: 0,
    applyUsed: 0,
    bindCreated: 0,
  },
};

// ============================================
// SPEAKER OBJECTS
// ============================================
const speakers = {
  vivek: {
    name: "Vivek",
    role: "CEO",
    department: "Executive",
    avatar: "🧑‍💼",
    greeting: "Good morning team",

    speak: function () {
      return `${this.greeting}, this is ${this.name} from ${this.department} department.`;
    },

    introduce: function (topic, audience) {
      return `${this.name} (${this.role}) presenting "${topic}" to ${audience}.`;
    },

    announce: function (...points) {
      return `${this.name} announcing: ${points.join(", ")}`;
    },
  },

  roy: {
    name: "Roy",
    role: "Developer",
    department: "Engineering",
    avatar: "👨‍💻",
    greeting: "Hey everyone",

    speak: function () {
      return `${this.greeting}, this is ${this.name} from ${this.department} department.`;
    },

    introduce: function (topic, audience) {
      return `${this.name} (${this.role}) presenting "${topic}" to ${audience}.`;
    },

    announce: function (...points) {
      return `${this.name} announcing: ${points.join(", ")}`;
    },
  },

  jessica: {
    name: "Jessica",
    role: "Manager",
    department: "Project Management",
    avatar: "👩‍💼",
    greeting: "Hello team",

    speak: function () {
      return `${this.greeting}, this is ${this.name} from ${this.department} department.`;
    },

    introduce: function (topic, audience) {
      return `${this.name} (${this.role}) presenting "${topic}" to ${audience}.`;
    },

    announce: function (...points) {
      return `${this.name} announcing: ${points.join(", ")}`;
    },
  },

  maya: {
    name: "Maya",
    role: "Designer",
    department: "Creative",
    avatar: "🎨",
    greeting: "Hi there",

    speak: function () {
      return `${this.greeting}, this is ${this.name} from ${this.department} department.`;
    },

    introduce: function (topic, audience) {
      return `${this.name} (${this.role}) presenting "${topic}" to ${audience}.`;
    },

    announce: function (...points) {
      return `${this.name} announcing: ${points.join(", ")}`;
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function addTranscript(message, type) {
  const time = new Date().toLocaleTimeString();
  state.transcripts.push({ message, type, time, id: Date.now() });

  if (state.transcripts.length > 30) {
    state.transcripts.shift();
  }

  updateTranscriptDisplay();
}

function updateTranscriptDisplay() {
  const container = document.getElementById("transcript");

  if (state.transcripts.length === 0) {
    container.innerHTML =
      '<div class="transcript-empty">Start a call to see the transcript...</div>';
    return;
  }

  container.innerHTML = state.transcripts
    .map(
      (entry) =>
        `<div class="transcript-entry transcript-${entry.type}">
            <span class="transcript-time">[${entry.time}]</span> ${entry.message}
        </div>`
    )
    .join("");

  container.scrollTop = container.scrollHeight;
}

function updateContextDisplay() {
  const speaker = speakers[state.currentSpeaker];

  document.getElementById("current-context").innerHTML = `
        <span class="context-name">${speaker.name}</span>
        <span class="context-role">(${speaker.role}, ${speaker.department})</span>
    `;

  document.getElementById("tracker-this").textContent = speaker.name;
}

function updateStats() {
  document.getElementById("stat-calls").textContent = state.stats.totalCalls;
  document.getElementById("stat-call").textContent = state.stats.callUsed;
  document.getElementById("stat-apply").textContent = state.stats.applyUsed;
  document.getElementById("stat-bind").textContent = state.stats.bindCreated;
  document.getElementById("tracker-bound").textContent = state.hotkeys.length;
}

// ============================================
// SPEAKER SELECTION
// ============================================
function selectSpeaker(speakerId) {
  state.currentSpeaker = speakerId;

  // Update UI
  document.querySelectorAll(".speaker-card").forEach((card) => {
    card.classList.remove("active");
  });
  document.getElementById(`speaker-${speakerId}`).classList.add("active");

  updateContextDisplay();
  addTranscript(
    `Selected ${speakers[speakerId].name} as current context`,
    "info"
  );
}

function setSpeaking(speakerId) {
  // Remove speaking from all
  document.querySelectorAll(".speaker-card").forEach((card) => {
    card.classList.remove("speaking");
    const status = card.querySelector(".speaker-status");
    status.textContent = "Listening";
  });

  // Add speaking to specified
  const card = document.getElementById(`speaker-${speakerId}`);
  card.classList.add("speaking");
  const status = card.querySelector(".speaker-status");
  status.textContent = "Speaking";
}

// ============================================
// DEMO FUNCTIONS - THE CORE!
// ============================================

// 1. Normal Call - this = object calling the method
function demoNormalCall() {
  const speaker = speakers[state.currentSpeaker];

  setSpeaking(state.currentSpeaker);
  addTranscript(`🎤 Normal Call: speaker.speak()`, "normal");
  addTranscript(`Code: ${speaker.name.toLowerCase()}.speak()`, "info");

  // THIS IS THE KEY: Normal method call
  const result = speaker.speak();

  addTranscript(`Result: ${result}`, "normal");
  addTranscript(
    `'this' inside speak() = ${speaker.name} (the object calling the method)`,
    "info"
  );

  document.getElementById("tracker-method").textContent = "Normal Call";
  document.getElementById("tracker-args").textContent = "None";

  state.stats.totalCalls++;
  updateStats();

  setTimeout(() => setSpeaking(null), 2000);
}

// 2. .call() - Temporarily borrow method with different context
function demoCall() {
  const speaker = speakers[state.currentSpeaker];

  // Get a different speaker to borrow the context
  const otherSpeakers = Object.keys(speakers).filter(
    (k) => k !== state.currentSpeaker
  );
  const targetId =
    otherSpeakers[Math.floor(Math.random() * otherSpeakers.length)];
  const target = speakers[targetId];

  setSpeaking(targetId);
  addTranscript(
    `📞 Using .call(): ${speaker.name}.speak.call(${target.name})`,
    "call"
  );
  addTranscript(
    `Code: vivek.speak.call(roy) // Roy borrows Vivek's method`,
    "info"
  );

  // THIS IS THE KEY: .call() changes 'this' temporarily
  const result = speaker.speak.call(target);

  addTranscript(`Result: ${result}`, "call");
  addTranscript(
    `'this' was temporarily = ${target.name} (first argument to .call())`,
    "info"
  );
  addTranscript(
    `${target.name} borrowed ${speaker.name}'s speak() method!`,
    "call"
  );

  document.getElementById("tracker-method").textContent = ".call()";
  document.getElementById(
    "tracker-args"
  ).textContent = `context: ${target.name}`;

  state.stats.totalCalls++;
  state.stats.callUsed++;
  updateStats();

  setTimeout(() => setSpeaking(null), 2000);
}

// 3. .apply() - Like call, but with array arguments
function demoApply() {
  const speaker = speakers[state.currentSpeaker];

  // Use introduce method with apply
  const topics = ["Q4 Results", "New Strategy", "Team Updates"];
  const audiences = ["Board Members", "All Staff", "Department Heads"];

  const topic = topics[Math.floor(Math.random() * topics.length)];
  const audience = audiences[Math.floor(Math.random() * audiences.length)];

  setSpeaking(state.currentSpeaker);
  addTranscript(
    `📢 Using .apply(): speaker.introduce.apply(context, [args])`,
    "apply"
  );
  addTranscript(
    `Code: ${speaker.name.toLowerCase()}.introduce.apply(${speaker.name.toLowerCase()}, ["${topic}", "${audience}"])`,
    "info"
  );

  // THIS IS THE KEY: .apply() with arguments as array
  const result = speaker.introduce.apply(speaker, [topic, audience]);

  addTranscript(`Result: ${result}`, "apply");
  addTranscript(`'this' = ${speaker.name}, arguments passed as array`, "info");
  addTranscript(`Perfect for Math.max.apply(null, [1,5,3]) → 5`, "apply");

  document.getElementById("tracker-method").textContent = ".apply()";
  document.getElementById(
    "tracker-args"
  ).textContent = `["${topic}", "${audience}"]`;

  state.stats.totalCalls++;
  state.stats.applyUsed++;
  updateStats();

  setTimeout(() => setSpeaking(null), 2000);
}

// 4. .bind() - Create permanently bound function
function demoBind() {
  const speaker = speakers[state.currentSpeaker];

  addTranscript(
    `🔗 Using .bind(): Creating permanently bound function`,
    "bind"
  );
  addTranscript(
    `Code: const boundSpeak = ${speaker.name.toLowerCase()}.speak.bind(${speaker.name.toLowerCase()})`,
    "info"
  );

  // THIS IS THE KEY: .bind() creates new function with permanent context
  const boundSpeak = speaker.speak.bind(speaker);

  addTranscript(
    `Created new function with 'this' permanently = ${speaker.name}`,
    "bind"
  );
  addTranscript(
    `Even if we try .call() on it, 'this' stays ${speaker.name}!`,
    "info"
  );

  // Demonstrate it works
  setSpeaking(state.currentSpeaker);
  const result = boundSpeak();
  addTranscript(`Result: ${result}`, "bind");

  // Try to change context (won't work!)
  const otherSpeaker = speakers["roy"];
  const tryChange = boundSpeak.call(otherSpeaker);
  addTranscript(
    `Tried boundSpeak.call(${otherSpeaker.name}): Still ${speaker.name}!`,
    "bind"
  );

  document.getElementById("tracker-method").textContent = ".bind()";
  document.getElementById(
    "tracker-args"
  ).textContent = `Permanent: ${speaker.name}`;

  state.stats.totalCalls++;
  state.stats.bindCreated++;
  updateStats();

  setTimeout(() => setSpeaking(null), 2000);
}

// 5. Arrow Function - Lexical 'this'
function demoArrowFunction() {
  const speaker = speakers[state.currentSpeaker];

  addTranscript(
    `➡️ Arrow Function: Lexical 'this' (inherits from parent)`,
    "arrow"
  );
  addTranscript(`Code: const arrowSpeak = () => { console.log(this) }`, "info");

  // Arrow function doesn't have its own 'this'
  addTranscript(`Arrow functions DON'T have their own 'this'`, "arrow");
  addTranscript(
    `They inherit 'this' from parent scope (lexical binding)`,
    "info"
  );
  addTranscript(
    `Can't use .call(), .apply(), or .bind() to change it!`,
    "arrow"
  );

  // Example
  const obj = {
    name: speaker.name,
    normalFunc: function () {
      return this.name;
    },
    arrowFunc: () => {
      return this.name;
    }, // 'this' = window/undefined
  };

  addTranscript(`normalFunc: this.name = "${obj.normalFunc()}"`, "arrow");
  addTranscript(`arrowFunc: this.name = undefined (no own 'this')`, "arrow");
  addTranscript(
    `Use arrow functions when you DON'T want 'this' to change!`,
    "info"
  );

  document.getElementById("tracker-method").textContent = "Arrow Function";
  document.getElementById("tracker-args").textContent = "Lexical this";

  state.stats.totalCalls++;
  updateStats();
}

// 6. Lost Context - Common mistake
function demoLostContext() {
  const speaker = speakers[state.currentSpeaker];

  addTranscript(
    `❌ Lost Context: Common mistake when detaching methods`,
    "error"
  );
  addTranscript(
    `Code: const speak = ${speaker.name.toLowerCase()}.speak; speak(); // ERROR!`,
    "info"
  );

  // Detach method from object
  const detachedSpeak = speaker.speak;

  addTranscript(`When you detach a method, it loses its context!`, "error");
  addTranscript(
    `'this' becomes undefined (strict mode) or window (non-strict)`,
    "info"
  );

  try {
    // This will fail because 'this' is undefined
    detachedSpeak();
  } catch (error) {
    addTranscript(`Error: Cannot read properties of undefined`, "error");
  }

  // Solutions
  addTranscript(
    `✅ Solution 1: Use .bind() → const bound = speak.bind(${speaker.name.toLowerCase()})`,
    "info"
  );
  addTranscript(
    `✅ Solution 2: Arrow wrapper → const wrapper = () => ${speaker.name.toLowerCase()}.speak()`,
    "info"
  );
  addTranscript(
    `✅ Solution 3: Keep method attached → ${speaker.name.toLowerCase()}.speak()`,
    "info"
  );

  // Demonstrate solution with bind
  const boundSpeak = speaker.speak.bind(speaker);
  const result = boundSpeak();
  addTranscript(`With .bind(): ${result}`, "normal");

  document.getElementById("tracker-method").textContent = "Lost Context";
  document.getElementById("tracker-args").textContent = "Fixed with .bind()";

  state.stats.totalCalls++;
  updateStats();
}

// ============================================
// HOTKEY CREATION (BIND DEMONSTRATION)
// ============================================
function createHotkey() {
  const speaker = speakers[state.currentSpeaker];

  // Create permanently bound function
  const boundSpeak = speaker.speak.bind(speaker);

  // Add to hotkeys
  state.hotkeys.push({
    speakerId: state.currentSpeaker,
    name: speaker.name,
    fn: boundSpeak,
  });

  state.stats.bindCreated++;
  updateStats();

  // Update UI
  updateHotkeyButtons();

  addTranscript(`🔗 Created hotkey for ${speaker.name} using .bind()`, "bind");
  addTranscript(
    `This button will ALWAYS call ${speaker.name}, regardless of current selection!`,
    "info"
  );
}

function updateHotkeyButtons() {
  const container = document.getElementById("hotkey-container");

  if (state.hotkeys.length === 0) {
    container.innerHTML =
      '<div class="hotkey-placeholder">Click "Create Hotkey" to bind current speaker to a button</div>';
    return;
  }

  container.innerHTML = state.hotkeys
    .map(
      (hotkey, index) => `
        <button class="hotkey-btn" onclick="executeHotkey(${index})">
            <div>${hotkey.name}</div>
            <div class="hotkey-btn-label">Hotkey ${index + 1}</div>
        </button>
    `
    )
    .join("");
}

function executeHotkey(index) {
  const hotkey = state.hotkeys[index];

  // Find which speaker this is
  const speakerId = hotkey.speakerId;
  setSpeaking(speakerId);

  addTranscript(
    `🔘 Hotkey ${index + 1} pressed (bound to ${hotkey.name})`,
    "bind"
  );

  // Execute the bound function
  const result = hotkey.fn();

  addTranscript(`Result: ${result}`, "bind");
  addTranscript(`Bound functions always use their original context!`, "info");

  state.stats.totalCalls++;
  updateStats();

  setTimeout(() => setSpeaking(null), 2000);
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  // Set initial speaker
  selectSpeaker("vivek");

  // Initial transcript
  addTranscript("📞 Conference Call Manager initialized", "info");
  addTranscript("Select a speaker and try different methods!", "info");
  addTranscript(`Current 'this' context: Vivek (CEO)`, "info");

  updateStats();
}

// Run on page load
init();

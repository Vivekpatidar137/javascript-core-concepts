// Game statistics
let stats = {
  fireworks: 0,
  particles: 0,
  clicks: 0,
  lastSecond: Date.now(),
  eventsThisSecond: 0,
};

let autoShow = false;
let autoInterval;

// Firework colors
const colors = [
  "#ff6b6b",
  "#feca57",
  "#48dbfb",
  "#ff9ff3",
  "#54a0ff",
  "#5f27cd",
  "#00d2d3",
  "#ff9f43",
  "#10ac84",
  "#ee5a24",
  "#0984e3",
  "#a29bfe",
];

// THE MAGIC: Single event listener using delegation!
document
  .getElementById("fireworkArea")
  .addEventListener("click", function (event) {
    // This ONE listener handles ALL clicks anywhere on the screen!

    // Hide instructions after first click
    document.getElementById("instructions").style.display = "none";

    // Create firework at click position
    createFirework(event.clientX, event.clientY);

    // Update stats
    stats.clicks++;
    stats.eventsThisSecond++;
    updateStats();
  });

// Create spectacular firework
function createFirework(x, y) {
  stats.fireworks++;

  // Random firework properties
  const particleCount = 15 + Math.random() * 25; // 15-40 particles
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 0.5 + Math.random() * 1.5; // Size multiplier

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    createParticle(x, y, color, size);
    stats.particles++;
  }

  // Create central burst effect
  createBurst(x, y, color);

  // Add screen shake effect for big fireworks
  if (particleCount > 30) {
    document.body.style.animation = "shake 0.2s ease-in-out";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 200);
  }
}

// Create individual particle
function createParticle(x, y, color, sizeMultiplier) {
  const particle = document.createElement("div");
  particle.className = "particle";

  // Random direction and speed
  const angle = Math.PI * 2 * Math.random();
  const speed = (50 + Math.random() * 100) * sizeMultiplier;
  const finalX = x + Math.cos(angle) * speed;
  const finalY = y + Math.sin(angle) * speed;

  // Particle styling
  const size = (2 + Math.random() * 4) * sizeMultiplier;
  particle.style.width = size + "px";
  particle.style.height = size + "px";
  particle.style.left = x + "px";
  particle.style.top = y + "px";
  particle.style.background = color;
  particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

  // Animation
  const duration = 800 + Math.random() * 600;
  particle.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

  document.body.appendChild(particle);

  // Animate particle
  setTimeout(() => {
    particle.style.left = finalX + "px";
    particle.style.top = finalY + "px";
    particle.style.opacity = "0";
    particle.style.transform = "scale(0)";
  }, 50);

  // Remove particle
  setTimeout(() => {
    particle.remove();
  }, duration + 100);
}

// Create central burst effect
function createBurst(x, y, color) {
  const burst = document.createElement("div");
  burst.style.position = "absolute";
  burst.style.left = x - 25 + "px";
  burst.style.top = y - 25 + "px";
  burst.style.width = "50px";
  burst.style.height = "50px";
  burst.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  burst.style.borderRadius = "50%";
  burst.style.pointerEvents = "none";
  burst.style.animation = "explode 0.6s ease-out forwards";

  document.body.appendChild(burst);

  setTimeout(() => burst.remove(), 600);
}

// Update statistics display
function updateStats() {
  document.getElementById("fireworkCount").textContent = stats.fireworks;
  document.getElementById("particleCount").textContent = stats.particles;
  document.getElementById("clickCount").textContent = stats.clicks;
}

// Calculate events per second
setInterval(() => {
  const now = Date.now();
  if (now - stats.lastSecond >= 1000) {
    document.getElementById("eventsPerSecond").textContent =
      stats.eventsThisSecond;
    stats.eventsThisSecond = 0;
    stats.lastSecond = now;
  }
}, 100);

// Auto fireworks show
function autoFireworks() {
  if (autoShow) {
    clearInterval(autoInterval);
    autoShow = false;
    document.querySelector(".btn-success").textContent = "🎆 Auto Show";
    document.getElementById("instructions").style.display = "block";
    document.getElementById("instructions").textContent =
      "✨ Click anywhere to create fireworks! ✨";
  } else {
    autoShow = true;
    document.querySelector(".btn-success").textContent = "⏹️ Stop Show";
    document.getElementById("instructions").style.display = "none";

    autoInterval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createFirework(x, y);
      stats.fireworks++;
      stats.eventsThisSecond++;
      updateStats();
    }, 300 + Math.random() * 400);
  }
}

// Clear all fireworks and reset stats
function clearFireworks() {
  document.querySelectorAll(".particle").forEach((p) => p.remove());
  stats = {
    fireworks: 0,
    particles: 0,
    clicks: 0,
    lastSecond: Date.now(),
    eventsThisSecond: 0,
  };
  updateStats();
  document.getElementById("instructions").style.display = "block";
  document.getElementById("instructions").textContent =
    "✨ Ready for more fireworks! ✨";
}

// Show delegation explanation
function showDelegationInfo() {
  document.getElementById("delegationInfo").style.display = "block";
}

// Hide delegation explanation
function hideDelegationInfo() {
  document.getElementById("delegationInfo").style.display = "none";
}

// Add shake animation for big fireworks
const shakeCSS = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
        `;
const styleSheet = document.createElement("style");
styleSheet.textContent = shakeCSS;
document.head.appendChild(styleSheet);

// Initialize
updateStats();

// Add welcome message
setTimeout(() => {
  if (stats.clicks === 0) {
    createFirework(window.innerWidth / 2, window.innerHeight / 2);
    stats.fireworks++;
    updateStats();
  }
}, 2000);

// Travel destinations data
const destinations = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    icon: "🏝️",
    cost: 1500,
    rating: 4.8,
    days: 7,
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    icon: "🗼",
    cost: 3200,
    rating: 4.9,
    days: 10,
  },
  {
    id: 3,
    name: "Paris",
    country: "France",
    icon: "🗼",
    cost: 2800,
    rating: 4.7,
    days: 8,
  },
  {
    id: 4,
    name: "Santorini",
    country: "Greece",
    icon: "🏛️",
    cost: 2400,
    rating: 4.9,
    days: 6,
  },
  {
    id: 5,
    name: "New York",
    country: "USA",
    icon: "🏙️",
    cost: 3500,
    rating: 4.6,
    days: 7,
  },
  {
    id: 6,
    name: "Maldives",
    country: "Maldives",
    icon: "🏖️",
    cost: 4500,
    rating: 4.9,
    days: 9,
  },
  {
    id: 7,
    name: "Dubai",
    country: "UAE",
    icon: "🏗️",
    cost: 2200,
    rating: 4.5,
    days: 5,
  },
  {
    id: 8,
    name: "Iceland",
    country: "Iceland",
    icon: "🏔️",
    cost: 2600,
    rating: 4.8,
    days: 8,
  },
  {
    id: 9,
    name: "Thailand",
    country: "Thailand",
    icon: "🛕",
    cost: 1200,
    rating: 4.7,
    days: 12,
  },
  {
    id: 10,
    name: "Switzerland",
    country: "Switzerland",
    icon: "🏔️",
    cost: 4000,
    rating: 4.8,
    days: 7,
  },
  {
    id: 11,
    name: "Morocco",
    country: "Morocco",
    icon: "🕌",
    cost: 1800,
    rating: 4.4,
    days: 9,
  },
  {
    id: 12,
    name: "Australia",
    country: "Australia",
    icon: "🦘",
    cost: 3800,
    rating: 4.6,
    days: 14,
  },
  {
    id: 13,
    name: "Italy",
    country: "Italy",
    icon: "🍝",
    cost: 2500,
    rating: 4.7,
    days: 10,
  },
  {
    id: 14,
    name: "Norway",
    country: "Norway",
    icon: "🌌",
    cost: 3600,
    rating: 4.8,
    days: 6,
  },
  {
    id: 15,
    name: "Brazil",
    country: "Brazil",
    icon: "🏖️",
    cost: 2000,
    rating: 4.5,
    days: 11,
  },
];

let wishlist = [];
let methodsUsed = 0;

// Initialize
function init() {
  displayDestinations();
  updateStats();
  logAction("Welcome! Click destinations to build your wishlist!");
}

// Display destinations
function displayDestinations() {
  const grid = document.getElementById("destinationGrid");
  grid.innerHTML = "";

  destinations.forEach((dest) => {
    const card = document.createElement("div");
    card.className =
      "destination-card" + (wishlist.includes(dest.id) ? " selected" : "");
    card.onclick = () => toggleWishlist(dest.id);

    card.innerHTML =
      '<div class="destination-image">' +
      dest.icon +
      "</div>" +
      '<div class="destination-content">' +
      '<div class="destination-name">' +
      dest.name +
      "</div>" +
      '<div class="destination-country">' +
      dest.country +
      "</div>" +
      '<div class="destination-stats">' +
      '<div class="stat-item">' +
      '<div class="stat-value">$' +
      dest.cost +
      "</div>" +
      '<div class="stat-label">Cost</div>' +
      "</div>" +
      '<div class="stat-item">' +
      '<div class="stat-value">' +
      dest.days +
      "</div>" +
      '<div class="stat-label">Days</div>' +
      "</div>" +
      "</div>" +
      '<div class="rating">⭐ ' +
      dest.rating +
      "/5</div>" +
      "</div>";

    grid.appendChild(card);
  });
}

// Toggle wishlist
function toggleWishlist(id) {
  const dest = destinations.find((d) => d.id === id);
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((wid) => wid !== id);
    logAction("❌ Removed " + dest.name + " from wishlist");
  } else {
    wishlist.push(id);
    logAction("✅ Added " + dest.name + " to wishlist ($" + dest.cost + ")");
  }
  displayDestinations();
  updateStats();
}

// Array method demonstrations
function demonstrateMap() {
  methodsUsed++;
  const wishlistData = destinations.filter((d) => wishlist.includes(d.id));

  if (wishlistData.length === 0) {
    logAction("❌ Add destinations to wishlist first!");
    return;
  }

  const enhanced = wishlistData.map((dest) => ({
    name: dest.name,
    cost: dest.cost,
    withFlights: dest.cost + 800,
    perDay: Math.round(dest.cost / dest.days),
  }));

  let code = "// .map() - Transform destination data\n";
  code += "const enhanced = wishlist.map(dest => ({\n";
  code += "  name: dest.name,\n";
  code += "  cost: dest.cost,\n";
  code += "  withFlights: dest.cost + 800,\n";
  code += "  perDay: Math.round(dest.cost / dest.days)\n";
  code += "}));\n\n";
  code += "// Results:\n";
  enhanced.forEach((e) => {
    code += e.name + ": $" + e.cost + " → $" + e.withFlights + "\n";
  });

  displayCode(code);
  logAction(
    "🧮 .map() calculated enhanced costs for " +
      enhanced.length +
      " destinations!"
  );
  updateStats();
}

function demonstrateFilter() {
  methodsUsed++;

  const budget = destinations.filter((d) => d.cost < 2000);
  const luxury = destinations.filter((d) => d.cost > 3000);
  const highRated = destinations.filter((d) => d.rating >= 4.7);

  let code = "// .filter() - Find destinations by criteria\n";
  code += "const budget = destinations.filter(d => d.cost < 2000);\n";
  code += "const luxury = destinations.filter(d => d.cost > 3000);\n";
  code += "const highRated = destinations.filter(d => d.rating >= 4.7);\n\n";
  code += "// Results:\n";
  code += "Budget-friendly: " + budget.length + " destinations\n";
  code += "Luxury: " + luxury.length + " destinations\n";
  code += "Highly rated: " + highRated.length + " destinations";

  displayCode(code);
  logAction("🔍 .filter() found " + budget.length + " budget destinations!");
  updateStats();
}

function demonstrateReduce() {
  methodsUsed++;
  const wishlistData = destinations.filter((d) => wishlist.includes(d.id));

  if (wishlistData.length === 0) {
    logAction("❌ Add destinations to wishlist first!");
    return;
  }

  const totalCost = wishlistData.reduce((sum, d) => sum + d.cost, 0);
  const totalDays = wishlistData.reduce((sum, d) => sum + d.days, 0);
  const avgRating =
    wishlistData.reduce((sum, d) => sum + d.rating, 0) / wishlistData.length;

  let code = "// .reduce() - Calculate wishlist totals\n";
  code += "const totalCost = wishlist.reduce((sum, d) => sum + d.cost, 0);\n";
  code += "const totalDays = wishlist.reduce((sum, d) => sum + d.days, 0);\n";
  code +=
    "const avgRating = wishlist.reduce((sum, d) => sum + d.rating, 0) / wishlist.length;\n\n";
  code += "// Results:\n";
  code += "Total Cost: $" + totalCost.toLocaleString() + "\n";
  code += "Total Days: " + totalDays + "\n";
  code += "Average Rating: " + avgRating.toFixed(1) + "/5";

  displayCode(code);
  logAction(
    "📊 .reduce() calculated total cost: $" + totalCost.toLocaleString() + "!"
  );
  updateStats();
}

function demonstrateFind() {
  methodsUsed++;

  const cheapest = destinations.find(
    (d) => d.cost === Math.min(...destinations.map((dest) => dest.cost))
  );
  const mostExpensive = destinations.find(
    (d) => d.cost === Math.max(...destinations.map((dest) => dest.cost))
  );
  const bestRated = destinations.find(
    (d) => d.rating === Math.max(...destinations.map((dest) => dest.rating))
  );

  let code = "// .find() - Locate specific destinations\n";
  code +=
    "const cheapest = destinations.find(d => d.cost === Math.min(...destinations.map(dest => dest.cost)));\n";
  code +=
    "const mostExpensive = destinations.find(d => d.cost === Math.max(...destinations.map(dest => dest.cost)));\n\n";
  code += "// Results:\n";
  code += "Cheapest: " + cheapest.name + " ($" + cheapest.cost + ")\n";
  code +=
    "Most Expensive: " +
    mostExpensive.name +
    " ($" +
    mostExpensive.cost +
    ")\n";
  code += "Best Rated: " + bestRated.name + " (" + bestRated.rating + "/5)";

  displayCode(code);
  logAction(
    "🎯 .find() found cheapest: " + cheapest.name + " ($" + cheapest.cost + ")!"
  );
  updateStats();
}

function demonstrateSort() {
  methodsUsed++;

  const byPrice = [...destinations].sort((a, b) => a.cost - b.cost);
  const byRating = [...destinations].sort((a, b) => b.rating - a.rating);

  let code = "// .sort() - Rank destinations\n";
  code +=
    "const byPrice = [...destinations].sort((a, b) => a.cost - b.cost);\n";
  code +=
    "const byRating = [...destinations].sort((a, b) => b.rating - a.rating);\n\n";
  code += "// Top 3 by Rating:\n";
  for (let i = 0; i < 3; i++) {
    code +=
      i + 1 + ". " + byRating[i].name + " (" + byRating[i].rating + "/5)\n";
  }

  displayCode(code);
  logAction("📈 .sort() ranked destinations by rating!");
  updateStats();
}

function demonstrateForEach() {
  methodsUsed++;
  const wishlistData = destinations.filter((d) => wishlist.includes(d.id));

  if (wishlistData.length === 0) {
    logAction("❌ Add destinations to wishlist first!");
    return;
  }

  let code = "// .forEach() - Plan itinerary\n";
  code += "wishlist.forEach((dest, index) => {\n";
  code += "  console.log(`Day ${index + 1}: ${dest.name}`);\n";
  code += "  console.log(`Budget: $${dest.cost}`);\n";
  code += "});\n\n";
  code += "// Itinerary:\n";
  wishlistData.forEach((dest, index) => {
    code += "Day " + (index + 1) + ": " + dest.name + " ($" + dest.cost + ")\n";
  });

  displayCode(code);
  logAction(
    "📝 .forEach() created itinerary for " +
      wishlistData.length +
      " destinations!"
  );
  updateStats();
}

// Utility functions
function displayCode(code) {
  document.getElementById("codeDisplay").innerHTML = code.replace(
    /\n/g,
    "<br>"
  );
}

function logAction(message) {
  const log = document.getElementById("travelLog");
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = new Date().toLocaleTimeString() + " - " + message;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateStats() {
  const wishlistData = destinations.filter((d) => wishlist.includes(d.id));
  const avgCost =
    wishlistData.length > 0
      ? Math.round(
          wishlistData.reduce((sum, d) => sum + d.cost, 0) / wishlistData.length
        )
      : 0;

  document.getElementById("totalDestinations").textContent =
    destinations.length;
  document.getElementById("wishlistCount").textContent = wishlist.length;
  document.getElementById("averageCost").textContent = "$" + avgCost;
  document.getElementById("methodsUsed").textContent = methodsUsed;
}

function clearWishlist() {
  wishlist = [];
  displayDestinations();
  updateStats();
  logAction("🧹 Wishlist cleared!");
}

function resetDemo() {
  wishlist = [];
  methodsUsed = 0;
  displayDestinations();
  updateStats();
  displayCode(
    "// Click an array method to see it in action!<br>// Select destinations for your wishlist<br>// Watch live data transformations ✈️"
  );
  document.getElementById("travelLog").innerHTML =
    '<div style="font-weight: bold; margin-bottom: 8px; color: #3498db;">✈️ Travel Log:</div>';
  logAction("🔄 Demo reset! Ready for new adventures!");
}

// Initialize when page loads
init();

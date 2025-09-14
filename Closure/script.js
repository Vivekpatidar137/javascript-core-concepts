// The magical closure function that creates our pizza chefs
function createPizzaChef(name, personality, avatar) {
  // Private variables - these are "closed over" by the returned functions
  let customerPreferences = [];
  let pizzasMade = 0;
  let totalEarnings = 0;
  let mood = "😊 Happy";
  let specialtyPizza = null;

  // Return an object with methods that have access to the private variables
  return {
    getName: () => name,
    getPersonality: () => personality,
    getAvatar: () => avatar,
    getMood: () => mood,

    rememberOrder: function (toppings) {
      customerPreferences.push({
        toppings: [...toppings],
        date: new Date(),
        id: Date.now(),
      });

      if (customerPreferences.length === 1) {
        mood = "🤩 Excited";
      } else if (customerPreferences.length >= 5) {
        mood = "😎 Master Chef";
      }

      return `${personality} ${name} says: "Perfect! I'll remember that delicious combination!"`;
    },

    makePizza: function (toppings) {
      pizzasMade++;
      totalEarnings += 12 + toppings.length * 2;

      const pizzaEmojis = ["🍕", "🍕", "🍕"][Math.floor(Math.random() * 3)];

      if (pizzasMade % 5 === 0) {
        mood = "🔥 On Fire!";
      }

      return `${pizzaEmojis} ${name} crafted a masterpiece with ${toppings.join(
        ", "
      )}! (Pizza #${pizzasMade})`;
    },

    makeUsualPizza: function () {
      if (customerPreferences.length === 0) {
        return `${name} says: "I don't know your usual order yet! Try ordering first!"`;
      }

      const lastOrder = customerPreferences[customerPreferences.length - 1];
      pizzasMade++;
      totalEarnings += 10;

      return `${name} says: "Here's your usual!" 🍕 ${lastOrder.toppings.join(
        ", "
      )} (Your favorite!)`;
    },

    createSpecialtyPizza: function () {
      if (customerPreferences.length < 2) {
        return `${name} says: "I need to know more about your taste first!"`;
      }

      // Analyze preferences to create specialty
      const allToppings = customerPreferences.flatMap((pref) => pref.toppings);
      const uniqueToppings = [...new Set(allToppings)];
      const specialty = uniqueToppings.slice(0, 3);

      specialtyPizza = `${name}'s Special: ${specialty.join(" + ")}`;
      pizzasMade++;
      totalEarnings += 18;

      return `🌟 ${specialtyPizza} - "This is based on all your favorites!"`;
    },

    getMemories: function () {
      return customerPreferences.map(
        (pref) =>
          `${pref.toppings.join(" + ")} (${pref.date.toLocaleTimeString()})`
      );
    },

    getStats: function () {
      return {
        pizzasMade,
        totalEarnings,
        memoriesCount: customerPreferences.length,
        specialtyPizza: specialtyPizza || "None yet",
      };
    },

    resetMemory: function () {
      const oldCount = customerPreferences.length;
      customerPreferences = [];
      mood = "😊 Happy";
      return `${name} says: "Fresh start! Forgot ${oldCount} previous orders."`;
    },
  };
}

// Available toppings
const toppings = [
  "🍅 Tomato",
  "🧀 Cheese",
  "🍄 Mushroom",
  "🥓 Bacon",
  "🌶️ Pepperoni",
  "🫒 Olives",
  "🧄 Garlic",
  "🌿 Basil",
  "🍍 Pineapple",
];

// Create our pizza chefs using closures
const chefs = [
  createPizzaChef("Mario", "🤌 Passionate Italian", "👨‍🍳"),
  createPizzaChef("Luigi", "😄 Cheerful Brother", "👨‍🍳"),
  createPizzaChef("Isabella", "✨ Creative Artist", "👩‍🍳"),
];

// Create UI for each chef
function createChefUI(chef, index) {
  const chefDiv = document.createElement("div");
  chefDiv.className = "chef-card";
  chefDiv.innerHTML = `
                <div class="chef-header">
                    <div class="chef-avatar">${chef.getAvatar()}</div>
                    <div class="chef-name">${chef.getName()}</div>
                    <div class="chef-mood" id="mood-${index}">${chef.getMood()}</div>
                </div>
                
                <div class="toppings-section">
                    <strong>Select Toppings:</strong>
                    <div class="toppings-grid" id="toppings-${index}">
                        ${toppings
                          .map(
                            (topping) =>
                              `<div class="topping-btn" data-topping="${topping}">${topping}</div>`
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="rememberOrder(${index})">Remember Order</button>
                    <button class="btn btn-success" onclick="makePizza(${index})">Make Pizza</button>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="makeUsual(${index})">Make Usual</button>
                    <button class="btn btn-warning" onclick="makeSpecialty(${index})">Chef's Special</button>
                </div>
                
                <div class="pizza-output" id="output-${index}">
                    ${chef.getPersonality()} ${chef.getName()} is ready to make pizza!
                </div>
                
                <div class="chef-stats">
                    <div class="stat-item">
                        <div class="stat-number" id="pizzas-${index}">0</div>
                        <div class="stat-label">Pizzas Made</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="earnings-${index}">$0</div>
                        <div class="stat-label">Earnings</div>
                    </div>
                </div>
                
                <div class="memory-section">
                    <div class="memory-title">📝 ${chef.getName()}'s Memory:</div>
                    <div id="memories-${index}">No orders remembered yet!</div>
                </div>
                
                <button class="btn" onclick="resetChef(${index})" style="background: #dc3545; color: white; width: 100%;">
                    Reset Memory
                </button>
            `;
  return chefDiv;
}

// Initialize the pizza shop
function initPizzaShop() {
  const shopDiv = document.getElementById("pizzaShop");
  chefs.forEach((chef, index) => {
    shopDiv.appendChild(createChefUI(chef, index));
  });
}

// Get selected toppings for a chef
function getSelectedToppings(chefIndex) {
  const toppingElements = document.querySelectorAll(
    `#toppings-${chefIndex} .topping-btn.selected`
  );
  return Array.from(toppingElements).map((el) => el.dataset.topping);
}

// Update chef display
function updateChefDisplay(chefIndex) {
  const chef = chefs[chefIndex];
  const stats = chef.getStats();

  document.getElementById(`mood-${chefIndex}`).textContent = chef.getMood();
  document.getElementById(`pizzas-${chefIndex}`).textContent = stats.pizzasMade;
  document.getElementById(
    `earnings-${chefIndex}`
  ).textContent = `$${stats.totalEarnings}`;

  const memories = chef.getMemories();
  const memoriesDiv = document.getElementById(`memories-${chefIndex}`);
  if (memories.length > 0) {
    memoriesDiv.innerHTML = memories
      .map((memory) => `<div class="pizza-memory">🍕 ${memory}</div>`)
      .join("");
  } else {
    memoriesDiv.innerHTML = "No orders remembered yet!";
  }
}

// Chef actions
function rememberOrder(chefIndex) {
  const selectedToppings = getSelectedToppings(chefIndex);
  if (selectedToppings.length === 0) {
    document.getElementById(`output-${chefIndex}`).innerHTML =
      "Please select some toppings first! 🍕";
    return;
  }

  const result = chefs[chefIndex].rememberOrder(selectedToppings);
  document.getElementById(`output-${chefIndex}`).innerHTML = result;
  updateChefDisplay(chefIndex);
}

function makePizza(chefIndex) {
  const selectedToppings = getSelectedToppings(chefIndex);
  if (selectedToppings.length === 0) {
    document.getElementById(`output-${chefIndex}`).innerHTML =
      "Please select some toppings first! 🍕";
    return;
  }

  const result = chefs[chefIndex].makePizza(selectedToppings);
  document.getElementById(`output-${chefIndex}`).innerHTML = result;
  updateChefDisplay(chefIndex);
}

function makeUsual(chefIndex) {
  const result = chefs[chefIndex].makeUsualPizza();
  document.getElementById(`output-${chefIndex}`).innerHTML = result;
  updateChefDisplay(chefIndex);
}

function makeSpecialty(chefIndex) {
  const result = chefs[chefIndex].createSpecialtyPizza();
  document.getElementById(`output-${chefIndex}`).innerHTML = result;
  updateChefDisplay(chefIndex);
}

function resetChef(chefIndex) {
  const result = chefs[chefIndex].resetMemory();
  document.getElementById(`output-${chefIndex}`).innerHTML = result;
  updateChefDisplay(chefIndex);

  // Clear selected toppings
  const toppingElements = document.querySelectorAll(
    `#toppings-${chefIndex} .topping-btn`
  );
  toppingElements.forEach((el) => el.classList.remove("selected"));
}

// Add topping selection functionality
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("topping-btn")) {
    e.target.classList.toggle("selected");
  }
});

// Initialize the pizza shop when page loads
initPizzaShop();

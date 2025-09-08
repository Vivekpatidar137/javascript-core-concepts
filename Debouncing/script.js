const searchInput = document.getElementById("searchInput");
const realSearchInput = document.getElementById("realSearchInput");

const normalOutput = document.getElementById("normalOutput");
const debouncedOutput = document.getElementById("debouncedOutput");
const searchResults = document.getElementById("searchResults");

const normalCounter = document.getElementById("normalCounter");
const debouncedCounter = document.getElementById("debouncedCounter");

const normalStatus = document.getElementById("normalStatus");
const debouncedStatus = document.getElementById("debouncedStatus");
const searchStatus = document.getElementById("searchStatus");

let normalCount = 0;
let debouncedCount = 0;
let searchCount = 0;

// Mock user database for realistic demo
const mockUsers = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Edward Norton",
  "Fiona Apple",
  "George Lucas",
  "Helen Hunt",
  "Ivan Drago",
  "Julia Roberts",
  "Kevin Bacon",
  "Linda Hamilton",
  "Michael Jordan",
  "Nancy Drew",
  "Oscar Wilde",
  "Patricia Hill",
];

// Function without debouncing - fires on every keystroke
function normalSearch(query) {
  normalCount++;
  normalCounter.textContent = `API Calls: ${normalCount}`;
  normalStatus.textContent = "🔄 Searching...";

  const time = new Date().toLocaleTimeString();
  normalOutput.innerHTML += `<div class="api-call">${normalCount}. API Call at ${time} - Query: "${query}"</div>`;
  normalOutput.scrollTop = normalOutput.scrollHeight;

  setTimeout(() => {
    normalStatus.textContent = "✅ Search completed";
  }, 100);
}

// Function with debouncing - waits for user to stop typing
function debouncedSearch(query) {
  debouncedCount++;
  debouncedCounter.textContent = `API Calls: ${debouncedCount}`;
  debouncedStatus.textContent = "🔄 Searching...";

  const time = new Date().toLocaleTimeString();
  debouncedOutput.innerHTML += `<div class="api-call">${debouncedCount}. API Call at ${time} - Query: "${query}"</div>`;
  debouncedOutput.scrollTop = debouncedOutput.scrollHeight;

  setTimeout(() => {
    debouncedStatus.textContent = "✅ Search completed";
  }, 100);
}

// Realistic search function
function performRealSearch(query) {
  searchCount++;
  if (!query.trim()) {
    searchStatus.textContent = "Type to search users...";
    searchResults.innerHTML = "";
    return;
  }

  searchStatus.textContent = "🔄 Searching users...";

  // Simulate API delay
  setTimeout(() => {
    const results = mockUsers.filter((user) =>
      user.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length > 0) {
      searchStatus.textContent = `✅ Found ${results.length} users (API Call #${searchCount})`;
      searchResults.innerHTML = results
        .map(
          (user) =>
            `<div style="padding: 8px; background: white; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd;">
                            👤 ${user}
                        </div>`
        )
        .join("");
    } else {
      searchStatus.textContent = `❌ No users found for "${query}" (API Call #${searchCount})`;
      searchResults.innerHTML =
        '<div style="padding: 8px; color: #666;">No results found</div>';
    }
  }, 200);
}

// Debounce implementation
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Create debounced versions
const debouncedSearchHandler = debounce(debouncedSearch, 500);
const debouncedRealSearch = debounce(performRealSearch, 500);

// Add event listeners for comparison demo
searchInput.addEventListener("input", function (e) {
  const query = e.target.value;

  // Update status immediately for debounced version
  if (query.trim()) {
    debouncedStatus.textContent = "⏳ Waiting for you to stop typing...";
  } else {
    debouncedStatus.textContent = "Ready to search...";
  }

  // Call both functions
  normalSearch(query);
  debouncedSearchHandler(query);
});

// Add event listener for realistic search demo
realSearchInput.addEventListener("input", function (e) {
  const query = e.target.value;

  if (query.trim()) {
    searchStatus.textContent = "⏳ Waiting for you to stop typing...";
  }

  debouncedRealSearch(query);
});

// Utility functions
function clearAllOutputs() {
  normalOutput.innerHTML = "";
  debouncedOutput.innerHTML = "";
  searchResults.innerHTML = "";
  normalStatus.textContent = "Ready to search...";
  debouncedStatus.textContent = "Ready to search...";
  searchStatus.textContent = "Type to search users...";
}

function resetCounters() {
  normalCount = 0;
  debouncedCount = 0;
  searchCount = 0;
  normalCounter.textContent = "API Calls: 0";
  debouncedCounter.textContent = "API Calls: 0";
  clearAllOutputs();
}

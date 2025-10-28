# 🎬 Movie Rating Aggregator - Higher Order Functions Edition

An interactive demonstration of JavaScript Higher Order Functions through building a custom movie rating system. Create your own Rotten Tomatoes-style scoring algorithm while mastering the most powerful pattern in functional programming!

## 🎯 What are Higher Order Functions?

A **Higher Order Function (HOF)** is a function that either:

1. **Takes another function as an argument**
2. **Returns a function as output**
3. **Or both!**

**Simple explanation:** Functions that work with other functions. They're the "function factories" and "function transformers" of JavaScript.

```javascript
// Takes function as argument
const process = (fn, value) => fn(value);

// Returns function (Currying)
const multiplier = (x) => (y) => x * y;

// Both!
const enhance = (fn) => (value) => {
  console.log("Processing...");
  return fn(value);
};
```

---

## 🎬 The Movie Rating Analogy

Building a movie rating system is the **perfect metaphor** for understanding HOFs:

| Real Movie Ratings   | HOF Concept         | Why It Works                         |
| -------------------- | ------------------- | ------------------------------------ |
| ⭐ Weight sliders    | Currying            | Create specialized scoring functions |
| 🎭 Filter by genre   | Partial application | Pre-configure filter criteria        |
| 🔗 Scoring algorithm | Composition         | Combine multiple steps into pipeline |
| 📊 Calculate totals  | Reduce              | Aggregate scores into final result   |
| 🔄 Transform scores  | Map                 | Apply function to all movies         |
| 🎯 Preset algorithms | Factory pattern     | Generate custom scorers              |

---

## 🎮 Demo Features

### Interactive Scoring System

- **4 Weight Sliders** - Adjust IMDb, Rotten Tomatoes, Metacritic, and Audience weights
- **Real-time Calculation** - Watch scores update instantly as you adjust weights
- **Preset Algorithms** - Try Critics Choice, Audience Favorite, IMDb Focused, or Balanced
- **Custom Scoring** - Build your own unique rating algorithm

### 12 Popular Movies

Each movie includes scores from:

- ⭐ **IMDb** (out of 10)
- 🍅 **Rotten Tomatoes** (percentage)
- 📊 **Metacritic** (out of 100)
- 👥 **Audience Score** (percentage)

**Movies span multiple genres:**

- 💥 Action (The Dark Knight, Mad Max, John Wick)
- 🎭 Drama (Shawshank Redemption, Forrest Gump)
- 🚀 Sci-Fi (Inception, The Matrix, Interstellar)
- 😂 Comedy (The Hangover, Superbad)
- 😱 Thriller (Pulp Fiction, Goodfellas)

### HOF Demonstrations

Six interactive buttons showing different HOF patterns:

- 🔧 **Create Weight Function** - Currying in action
- 🎭 **Filter by Genre** - Partial application
- 🔗 **Compose Functions** - Function composition pipeline
- 🔄 **Map Transform** - Transforming arrays
- 📊 **Reduce Aggregate** - Calculating totals
- 🎯 **Currying Example** - Step-by-step currying

---

## 🧠 Core HOF Concepts Demonstrated

### 1. 🔧 Currying (Function Returns Function)

Weight sliders create specialized scoring functions:

```javascript
// HOF that returns a function
const createWeightFunction = (weight) => {
  return (score) => {
    return score * (weight / 100);
  };
};

// Create specialized functions
const imdbWeighter = createWeightFunction(40); // 40% weight
const rtWeighter = createWeightFunction(30); // 30% weight

// Use them
const weightedImdb = imdbWeighter(88); // 35.2
const weightedRT = rtWeighter(87); // 26.1
```

**Why it's powerful:**

- Pre-configure behavior
- Reusable specialized functions
- Clean, composable code

**Real-world uses:**

- Event handlers with preset parameters
- API clients with configured auth
- Formatters with preset options

---

### 2. 🎭 Partial Application (Pre-configured Functions)

Genre filters are created by partially applying criteria:

```javascript
// HOF that takes predicate function
const createFilter = (predicate) => {
  return (items) => {
    return items.filter(predicate);
  };
};

// Create specialized filters
const actionFilter = createFilter((m) => m.genre === "action");
const sciFiFilter = createFilter((m) => m.genre === "scifi");
const highRated = createFilter((m) => m.finalScore > 80);

// Use them
const actionMovies = actionFilter(allMovies);
const topMovies = highRated(allMovies);
```

**Why it's powerful:**

- Reusable filter logic
- Clean, readable code
- Easy to combine filters

**Real-world uses:**

- Search functionality
- Data validation
- Access control checks

---

### 3. 🔗 Function Composition (Pipeline Pattern)

Score calculation is a pipeline of composed functions:

```javascript
// Compose multiple functions into one
const compose = (...functions) => {
  return (value) => {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
};

// Build scoring pipeline
const calculateFinalScore = compose(
  roundToDecimal, // 4. Round final result
  normalizeToHundred, // 3. Convert to 0-100 scale
  applyWeights, // 2. Apply weight percentages
  extractScores // 1. Get raw scores (runs first!)
);

// Use the composed function
const score = calculateFinalScore(movie); // All steps execute!
```

**Why it's powerful:**

- Break complex logic into simple steps
- Each function does one thing
- Easy to test and maintain

**Real-world uses:**

- Data transformation pipelines
- Middleware chains
- Form validation sequences

---

### 4. 🔄 Map (Transform All Items)

Transform all movie scores with one function:

```javascript
// HOF: map takes a function and applies to all
const addFinalScores = (scoringFunction) => {
  return (movies) => {
    return movies.map((movie) => ({
      ...movie,
      finalScore: scoringFunction(movie),
    }));
  };
};

// Transform all 12 movies at once
const moviesWithScores = addFinalScores(calculateScore)(movies);
```

**Why it's powerful:**

- Transform entire dataset in one line
- Original data unchanged (immutable)
- Chainable with other methods

**Real-world uses:**

- Format data for display
- Add computed properties
- Currency conversion
- Image transformations

---

### 5. 📊 Reduce (Aggregate into Single Value)

Calculate statistics from all movies:

```javascript
// Calculate average score using reduce
const averageScore =
  movies.reduce((sum, movie) => {
    return sum + movie.finalScore;
  }, 0) / movies.length;

// Find highest rated using reduce
const topMovie = movies.reduce((best, current) => {
  return current.finalScore > best.finalScore ? current : best;
});

// Group by genre using reduce
const byGenre = movies.reduce((groups, movie) => {
  const genre = movie.genre;
  if (!groups[genre]) groups[genre] = [];
  groups[genre].push(movie);
  return groups;
}, {});
```

**Why it's powerful:**

- Most versatile array method
- Can build any data structure
- Single pass through array

**Real-world uses:**

- Calculate totals (cart, analytics)
- Group data (by category, date)
- Build lookup tables
- Flatten nested arrays

---

### 6. 🎯 Higher Order Pattern (Function Takes Function)

The scoring system takes different algorithms:

```javascript
// HOF that takes a scoring function as argument
const calculateScore = (movie, scoringFunction) => {
  return scoringFunction(movie.scores);
};

// Different scoring strategies
const simpleAverage = (scores) => {
  return (scores.imdb + scores.rt + scores.meta + scores.audience) / 4;
};

const weightedScore = (scores) => {
  return (
    scores.imdb * 0.4 +
    scores.rt * 0.3 +
    scores.meta * 0.2 +
    scores.audience * 0.1
  );
};

// Use different strategies
const score1 = calculateScore(movie, simpleAverage);
const score2 = calculateScore(movie, weightedScore);
```

**Why it's powerful:**

- Pluggable behavior
- Strategy pattern
- Highly flexible

**Real-world uses:**

- Sorting with custom comparators
- Event handlers
- Middleware
- Callbacks

---

## 💡 Key Learning Points

### When to Use Each Pattern

| Pattern                 | Use When                          | Example                        |
| ----------------------- | --------------------------------- | ------------------------------ |
| **Currying**            | Need variations of same function  | Weight calculators, formatters |
| **Partial Application** | Pre-configure with some arguments | Filters, validators            |
| **Composition**         | Multiple transformation steps     | Data pipelines, middleware     |
| **Map**                 | Transform every item              | Add properties, format data    |
| **Filter**              | Select subset of items            | Search, remove items           |
| **Reduce**              | Aggregate into single value       | Sum, average, grouping         |

### HOF vs Regular Functions

**Without HOFs (Repetitive):**

```javascript
function calculateImdb(score) {
  return score * 0.4;
}
function calculateRT(score) {
  return score * 0.3;
}
function calculateMeta(score) {
  return score * 0.2;
}
function calculateAudience(score) {
  return score * 0.1;
}
```

**With HOFs (DRY - Don't Repeat Yourself):**

```javascript
const createWeightFunction = (weight) => (score) => score * weight;

const calculateImdb = createWeightFunction(0.4);
const calculateRT = createWeightFunction(0.3);
const calculateMeta = createWeightFunction(0.2);
const calculateAudience = createWeightFunction(0.1);
```

**Benefits:**

- Less code
- Single source of truth
- Easier to maintain
- More flexible

---

## 🎓 Learning Progression

### Beginner Level

1. **Adjust weight sliders** - See scores recalculate
2. **Click preset buttons** - Try different algorithms
3. **Read theory cards** - Understand concepts
4. **Understand:** "HOFs create custom functions!"

### Intermediate Level

1. **Click demo buttons** - See currying in action
2. **Filter by genre** - Understand partial application
3. **Watch activity log** - See HOF execution
4. **Understand:** "Functions can create and transform other functions!"

### Advanced Level

1. **Click compose demo** - See function pipeline
2. **Examine the code** - Read JavaScript implementations
3. **Modify weights** - Build custom algorithms
4. **Understand:** "HOFs enable powerful abstractions and clean code!"

### Expert Level

1. **Study the source code** - See all patterns together
2. **Build your own HOFs** - Practice the patterns
3. **Chain multiple HOFs** - Combine techniques
4. **Understand:** "HOFs are the foundation of functional programming!"

---

## 🌟 Real-World Applications

Higher Order Functions are everywhere in modern JavaScript:

### Framework Usage

```javascript
// React - map to render lists
{movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}

// Vue - filter in template
<div v-for="movie in movies.filter(m => m.rating > 8)">

// Angular - async pipe (HOF internally)
movies$ | async
```

### Array Operations

```javascript
// E-commerce: Filter, map, reduce chain
const total = cart
  .filter((item) => item.inStock) // Only available items
  .map((item) => item.price * item.quantity) // Calculate line totals
  .reduce((sum, price) => sum + price, 0); // Sum everything
```

### Event Handling

```javascript
// Debounced search (HOF wrapping HOF!)
const debouncedSearch = debounce((query) => {
  api.search(query).then(displayResults);
}, 300);

searchInput.addEventListener("input", debouncedSearch);
```

### API Clients

```javascript
// Configured fetch with auth (Currying)
const createAuthFetch = (token) => {
  return (url) => {
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
};

const authFetch = createAuthFetch(userToken);
authFetch("/api/movies").then(/* ... */);
```

### Data Validation

```javascript
// Composable validators
const validate = compose(checkLength, checkFormat, checkUniqueness);

const isValid = validate(userInput);
```

---

## 🔧 Technical Implementation

### Creating Weight Functions (Currying)

```javascript
const createWeightFunction = (weight) => {
  return (score) => {
    return score * (weight / 100);
  };
};

// Usage in scoring system
const weightFunctions = {
  imdb: createWeightFunction(state.weights.imdb),
  rt: createWeightFunction(state.weights.rt),
  meta: createWeightFunction(state.weights.meta),
  audience: createWeightFunction(state.weights.audience),
};
```

### Filter Creator (Partial Application)

```javascript
const createFilter = (predicate) => {
  return (items) => {
    return items.filter(predicate);
  };
};

// Create reusable filters
const genreFilters = {
  action: createFilter((m) => m.genre === "action"),
  drama: createFilter((m) => m.genre === "drama"),
  scifi: createFilter((m) => m.genre === "scifi"),
};
```

### Function Composition

```javascript
const compose = (...functions) => {
  return (value) => {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
};

// Build scoring pipeline
const calculateFinalScore = compose(round, normalize, weight, extract);
```

---

## 📊 Common Patterns & Use Cases

### Pattern 1: Configuration Functions

```javascript
// Create configured instances
const createLogger = (prefix) => (message) => {
  console.log(`[${prefix}] ${message}`);
};

const movieLogger = createLogger("MOVIE");
const scoreLogger = createLogger("SCORE");

movieLogger("Loaded movies"); // [MOVIE] Loaded movies
scoreLogger("Calculated"); // [SCORE] Calculated
```

### Pattern 2: Predicate Builders

```javascript
// Build reusable test functions
const createRangeCheck = (min, max) => (value) => {
  return value >= min && value <= max;
};

const isValidScore = createRangeCheck(0, 100);
const isHighRating = createRangeCheck(80, 100);
```

### Pattern 3: Middleware Pattern

```javascript
// Chain of responsibility
const applyMiddleware =
  (...middlewares) =>
  (value) => {
    return middlewares.reduce((acc, fn) => fn(acc), value);
  };

const processScore = applyMiddleware(validateScore, normalizeScore, roundScore);
```

---

## 🎮 Interactive Learning Exercises

### Exercise 1: Build Your Algorithm

1. Set IMDb to 50%, RT to 25%, Metacritic to 25%, Audience to 0%
2. Sort by final score
3. Question: Which movies benefit most from this weighting?
4. Answer: Movies with high IMDb scores (Shawshank, Dark Knight)

### Exercise 2: Genre Analysis

1. Filter to show only Sci-Fi movies
2. Apply "Critics Choice" preset (RT 50%)
3. Sort by score
4. Question: How does critic preference affect sci-fi rankings?

### Exercise 3: Custom Scorer

1. Create your own weighting system
2. Try to make "The Hangover" score highest
3. Document what weights achieved this
4. Understand: Different algorithms favor different movies!

### Exercise 4: Code Reading

1. Open `script.js`
2. Find `createWeightFunction()`
3. Trace how it's used in score calculation
4. Identify: Where is the returned function actually called?

---

## 🌐 Try It Live

Open `index.html` in your browser and start learning!

**Tips:**

- Start with preset algorithms to see dramatic changes
- Click movie cards to see detailed score breakdowns
- Use demo buttons to understand each HOF pattern
- Watch the activity log to see function execution
- Try building an algorithm that ranks your favorite movie #1!

---

## 📁 Project Structure

```
movie-rating-hof/
├── index.html          # Structure + theory section
├── styles.css          # Styling and animations
├── script.js           # HOF implementations
└── README.md          # This file
```

No build process, no dependencies - just open and learn! 🎉

---

## 🚀 Quick Start

1. Download all files to the same folder
2. Open `index.html` in your browser
3. Adjust weight sliders to see scores change
4. Click demo buttons to learn HOF patterns
5. Filter and sort to explore the movies
6. Read the activity log to understand execution

---

## 💻 Code Examples to Study

### Example 1: Simple Currying

```javascript
const add = (a) => (b) => a + b;

const add5 = add(5);
console.log(add5(3)); // 8
console.log(add5(7)); // 12
```

### Example 2: Practical HOF

```javascript
const createMultiplier = (factor) => {
  return (numbers) => {
    return numbers.map((n) => n * factor);
  };
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

double([1, 2, 3]); // [2, 4, 6]
triple([1, 2, 3]); // [3, 6, 9]
```

### Example 3: Compose Utility

```javascript
const compose =
  (...fns) =>
  (val) =>
    fns.reduceRight((acc, fn) => fn(acc), val);

const addTax = (price) => price * 1.1;
const addShipping = (price) => price + 5;
const formatPrice = (price) => `$${price.toFixed(2)}`;

const calculateTotal = compose(formatPrice, addShipping, addTax);

calculateTotal(100); // "$115.00"
```

---

## 🎯 Key Takeaways

After completing this demo, you should understand:

✅ **What HOFs are** - Functions that work with functions  
✅ **Currying** - Creating specialized functions from general ones  
✅ **Partial Application** - Pre-configuring function arguments  
✅ **Composition** - Building complex functions from simple ones  
✅ **Map/Filter/Reduce** - The holy trinity of array HOFs  
✅ **Real-world uses** - Where HOFs appear in modern code  
✅ **Functional thinking** - How to approach problems functionally  
✅ **Code organization** - Using HOFs for cleaner architecture

---

## 📝 License

This project is open source and available for educational purposes. Feel free to use it for learning, teaching, or in your portfolio!

---

## 🌟 Other Demos in This Series

- 🔍 **Debouncing** - Search input optimization
- 🍕 **Closures** - Pizza chef memory system
- ✈️ **Array Methods** - Travel destination planner
- 🚗 **Promises & Async/Await** - Car wash simulator
- 🎬 **Higher Order Functions** - Movie rating aggregator (you are here!)

---

## 💬 Learning Resources

### Official Documentation

- [MDN: Higher Order Functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
- [MDN: Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

---

## 🎉 Final Words

Higher Order Functions are not just a fancy pattern - they're a **fundamental shift in how you think about code**. Instead of telling the computer _how_ to do something step by step, you describe _what_ you want to happen.

Next time you write code, ask yourself:

- Can I make this function more reusable by accepting a function argument?
- Can I create specialized versions by returning configured functions?
- Can I break this complex operation into a pipeline of simple functions?

**Master HOFs, and you'll write cleaner, more maintainable, more professional JavaScript!** 🚀

---

Made with ❤️ for JavaScript learners everywhere

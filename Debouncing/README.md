# 🔍 Debouncing Example

An interactive demonstration of JavaScript debouncing with real-world search functionality.

## 🎯 What is Debouncing?

Debouncing delays function execution until after a specified time has passed since the last time it was invoked. It's perfect for:

- Search inputs
- API calls
- Form validation
- Resize events

## 🚀 Demo Features

- **Side-by-side comparison**: Normal vs debounced behavior
- **Real-world search**: Simulated user search with mock data
- **Visual feedback**: Live API call counting and status updates
- **Performance showcase**: See how debouncing reduces unnecessary calls

## 💡 Key Learning Points

- **Without debouncing**: Function fires on every keystroke
- **With debouncing**: Function only fires after user stops typing (500ms delay)
- **Real impact**: Typing "hello" = 5 API calls vs 1 API call

## 🔧 Implementation

```javascript
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce(searchFunction, 500);
input.addEventListener("input", debouncedSearch);
```

## 🌐 Try It Live

Open `index.html` in your browser and start typing to see debouncing in action!

## 📊 When to Use Debouncing

| Use Case            | Why Debouncing Helps                   |
| ------------------- | -------------------------------------- |
| **Search Input**    | Reduces API calls while typing         |
| **Form Validation** | Validates only after user stops typing |
| **Resize Events**   | Prevents excessive layout calculations |
| **Button Clicks**   | Prevents accidental double-clicks      |

---

💡 **Tip**: Debouncing is about waiting for the user to "finish" an action, while throttling is about limiting how often an action can occur.

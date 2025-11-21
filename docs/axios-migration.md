# Axios Migration & Usage Guide

## Centralized API Handler (`src/app/lib/request.js`)
- Single axios instance with shared `baseURL`, default headers, and `withCredentials`.
- Request interceptor injects `Authorization` header when a browser token exists.
- Response interceptor normalizes errors so every caller can display consistent messaging.
- Helper `request` object exposes `.get/.post/.put/.patch/.delete`, each returning `response.data`.

## Using Axios In Different Contexts

### Server Components
```jsx
// Example: src/app/restaurantlist/[name]/page.js
import { request } from "@/app/lib/request";

const data = await request.get(`/api/restaurant/foods?name=${encodeURIComponent(category)}`);
```
- Safe to call during render because axios runs on the server runtime.
- Prefer absolute paths such as `/api/...` so the shared `baseURL` resolves correctly in every environment.

### Client Components
```jsx
"use client";
import { useEffect, useState } from "react";
import { request } from "@/app/lib/request";

const [restaurants, setRestaurants] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const loadRestaurants = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await request.get("/api/customer");
    if (data.success) setRestaurants(data.result);
  } catch (err) {
    setError(err.message ?? "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};
```
- Wrap calls in `try/catch` so UI can surface `err.message`.
- Track loading states with `useState` booleans to drive skeletons/spinners.

### Error Handling
```jsx
try {
  await request.post("/api/order", payload);
} catch (error) {
  const message = error?.message || "Unable to place order";
  toast.error(message);
}
```
- `request` rethrows the normalized error `{ message, status, data }`.
- Re-throw if a caller cannot resolve the issue so higher layers can handle it.

### Loading States
- Set a `loading` flag to `true` before awaiting the axios promise and reset it in `finally`.
- Disable submit buttons while loading to prevent duplicate requests.
- Provide optimistic UI updates (e.g., update local state after a successful mutation).

### Reusing The Same Instance
- Always import `{ request }` (or the default `api` instance) from `src/app/lib/request`.
- Never instantiate axios ad hoc inside components; that bypasses interceptors and shared config.
- For edge cases (e.g., file uploads) extend the shared instance with `api.create` rather than using `axios` directly.

## Migration Playbook (Fetch → Axios)
1. **Install axios** – `npm install axios` and ensure it appears in `package.json`.
2. **Create the wrapper** – add `src/app/lib/request.js` with shared config, interceptors, and helpers.
3. **Find existing fetch usage** – `rg "fetch(" src` to list every call site.
4. **Update imports** – add `import { request } from "@/app/lib/request";` (or a relative path) to each file.
5. **Swap call sites**  
   - `await fetch(url, { method, headers, body })` → `await request[method](url, data, config)`  
   - Remove manual `JSON.stringify`/`res.json()` because the wrapper handles serialization.
6. **Handle errors & loading** – wrap each call with `try/catch/finally` so UI states stay consistent.
7. **Test flows** – run `npm run dev`, exercise signup/login/order paths, and watch the terminal for API errors.
8. **Document the pattern** – keep this guide up to date so future contributors follow the same conventions.

Following these steps keeps networking logic centralized, predictable, and production-ready. 


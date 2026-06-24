# App Reset Behavior

## 🔄 Fresh Start on Every Refresh

The app now automatically clears all data and starts from scratch whenever you refresh the page.

## What Gets Cleared

On every page refresh (F5, Ctrl+R, or browser refresh):
- ✅ Vehicle information (model, mileage, fuel)
- ✅ Selected route data
- ✅ All localStorage data
- ✅ App resets to Vehicle Setup page

## User Flow

### 1. Page Refresh / First Load
```
Browser Refresh → Clear All Data → Vehicle Setup Page
```

### 2. Normal Flow (Without Refresh)
```
Vehicle Setup → Route Planning → Navigation → Trip Summary
```

### 3. From Trip Summary
- **"Start New Trip"** button:
  - Clears only route data
  - Keeps vehicle info
  - Goes back to Route Planning page
  
- **"Back to Setup"** button:
  - Clears ALL data
  - Reloads the page
  - Starts completely fresh

## Implementation Details

### App.jsx
```javascript
useEffect(() => {
  // Runs once on app mount (page load/refresh)
  localStorage.removeItem('vehicleInfo');
  localStorage.removeItem('selectedRoute');
  setCurrentPage('setup');
}, []);
```

### VehicleSetup.jsx
- Removed the useEffect that loaded saved data
- Always starts with empty form fields
- Fresh input required every time

### TripSummary.jsx
- "Back to Setup" button now calls `localStorage.clear()`
- Ensures complete reset before reload

## Benefits

✅ **Clean slate every time** - No stale data
✅ **Predictable behavior** - Always starts at step 1
✅ **No confusion** - Users know they're starting fresh
✅ **Easy testing** - Just refresh to reset
✅ **Data privacy** - No persistent storage between sessions

## Testing

1. **Test Fresh Start:**
   - Enter vehicle details
   - Refresh page (F5)
   - ✅ Should show empty Vehicle Setup form

2. **Test Normal Flow:**
   - Complete vehicle setup
   - Select a route
   - Navigate
   - ✅ Data should persist during the session

3. **Test Trip Summary Reset:**
   - Complete a trip
   - Click "Back to Setup"
   - ✅ Should reload with empty form

4. **Test New Trip:**
   - Complete a trip
   - Click "Start New Trip"
   - ✅ Should keep vehicle info, clear route

## Notes

- Data only persists during active session (no refresh)
- Perfect for demo/testing purposes
- Each user session is independent
- No data leakage between sessions

## If You Want Persistent Data

To make data persist across refreshes, you would need to:
1. Remove the `useEffect` cleanup in `App.jsx`
2. Restore the `useEffect` in `VehicleSetup.jsx` that loads saved data
3. Add a manual "Clear Data" button instead

But for now, the app provides a fresh start every time! 🎉

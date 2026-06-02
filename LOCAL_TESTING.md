# 🧪 CoffeeFriend PWA - Local Testing Guide

## Problem: "Access Denied" Error

This happens when:
1. Trying to open files directly (file:// protocol)
2. Service Worker paths are incorrect
3. Server not configured with proper headers

✅ **Fixed!** - We've updated the paths to use relative URLs that work anywhere.

---

## 🚀 How to Test Locally

### Option 1: Python (Recommended - Easiest)

**Windows:**
```cmd
cd "d:\Favorites\OneDrive\Desktop\coffeeapp"
python -m http.server 8000
```

**macOS/Linux:**
```bash
cd /path/to/coffeeapp
python3 -m http.server 8000
```

Then visit: `http://localhost:8000/install.html`

### Option 2: Node.js HTTP Server

```bash
cd coffeeapp
npx http-server -p 8000 -o
```

### Option 3: Node.js Express (Better for testing)

Create `server.js` in coffeeapp folder:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Security headers (lightweight)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Serve files
app.use(express.static(__dirname));

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'pageone.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`CoffeeFriend running at http://localhost:${PORT}`);
  console.log(`Test it: http://localhost:${PORT}/install.html`);
});
```

Then run:
```bash
node server.js
```

### Option 4: Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click `install.html`
3. Click "Open with Live Server"
4. Automatically opens in browser

---

## ✅ What to Test

### 1. **Installation Guide**
- [ ] Visit `http://localhost:8000/install.html`
- [ ] Page loads without errors
- [ ] All features visible
- [ ] Buttons clickable

### 2. **Main App**
- [ ] Visit `http://localhost:8000/pageone.html`
- [ ] Page loads quickly
- [ ] Theme toggle works (button in header)
- [ ] Navigation works

### 3. **Navigation**
- [ ] Click "Today's Coffee Mood" → goes to pagetwo.html
- [ ] Click "Items that pair well with coffee" → goes to pagethree.html
- [ ] Click "Fun facts" → goes to pagefour.html
- [ ] Can navigate back and forth

### 4. **Service Worker**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. Should show: `sw.js` with status "activated and running"
5. If not: Check **Console** for errors

### 5. **Cache Storage**
1. DevTools → **Application** → **Cache Storage**
2. Should see `coffeefriend-v1`
3. Expand it → should see cached files

### 6. **Offline Mode**
1. DevTools → **Application** → **Service Workers**
2. Check "Offline" checkbox
3. Refresh page
4. App should still work!
5. Uncheck "Offline"

### 7. **Console**
1. Open DevTools → **Console** tab
2. Should have no RED errors
3. Yellow warnings are okay

---

## 🐛 Troubleshooting

### Issue: "Service Worker failed to register"

**Cause:** HTTPS required (except localhost)

**Fix:** 
- Local testing: Use `http://localhost` (works for testing)
- Production: Must use HTTPS

### Issue: "Cache is empty"

**Cause:** Service Worker still installing

**Fix:**
- Refresh page (Ctrl+R or Cmd+R)
- Wait 5 seconds
- Check DevTools Application tab

### Issue: "Access Denied" or "Failed to fetch"

**Cause:** Incorrect file paths or CORS issue

**Fix:** ✅ Already fixed! Paths are now relative

### Issue: Offline mode not working

**Cause:** Service Worker not registered

**Fix:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check DevTools console for errors

### Issue: Old version still showing

**Cause:** Browser caching

**Fix:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear Application Cache → Clear storage
3. Close and reopen browser

---

## 📊 DevTools Checklist

✅ **Console Tab**
- No RED errors
- Yellow warnings okay
- "SW registration" message may appear

✅ **Application Tab**
- Service Workers: `sw.js` = "activated and running"
- Cache Storage: `coffeefriend-v1` contains files
- Manifest: `manifest.json` visible

✅ **Network Tab**
- All files load successfully
- Status codes are 200 (or 304 cached)
- No 404 errors

✅ **Offline Test**
1. Check "Offline" in Service Workers
2. Click to different pages
3. Should work without network
4. Uncheck "Offline"

---

## 🌐 Testing URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:8000/` | Root (redirects to pageone.html) |
| `http://localhost:8000/install.html` | Installation guide |
| `http://localhost:8000/pageone.html` | Home page |
| `http://localhost:8000/pagetwo.html` | Coffee moods |
| `http://localhost:8000/pagethree.html` | Pairings |
| `http://localhost:8000/pagefour.html` | Fun facts |
| `http://localhost:8000/manifest.json` | App manifest |
| `http://localhost:8000/sw.js` | Service Worker |

---

## 🔍 Console Commands

Helpful commands in DevTools Console:

```javascript
// Check if Service Worker is registered
navigator.serviceWorker.controller

// List all caches
caches.keys()

// Clear all caches
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})

// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)

// Get Service Worker registration
navigator.serviceWorker.ready.then(reg => console.log(reg))
```

---

## ✨ Success Indicators

✅ All pages load without "Access Denied"
✅ No RED errors in console
✅ Service Worker shows "activated and running"
✅ Cache Storage shows coffeefriend-v1
✅ Works in offline mode
✅ Theme toggle works
✅ Navigation between pages works
✅ All 4 content pages accessible

---

## 🚀 Next: Deploy to Production

Once local testing passes:

1. **Get HTTPS** (free: Let's Encrypt)
2. **Choose hosting** (Netlify, Vercel, GitHub Pages recommended)
3. **Upload files** to your server
4. **Add security headers** (see SECURITY_SETUP.md)
5. **Share install.html URL** with users

---

## 📱 Mobile Testing

### iOS:
1. Open Safari
2. Visit: `https://yourdomain.com/coffeeapp/install.html`
3. Tap Share (↗️)
4. Tap "Add to Home Screen"
5. App installs!

### Android:
1. Open Chrome
2. Visit: `https://yourdomain.com/coffeeapp/install.html`
3. Tap Menu (⋮)
4. Tap "Install app"
5. App installs!

---

## 💡 Pro Tips

1. **Use Incognito Mode** to test fresh (no cache interference)
2. **Test on actual mobile device** - simulator doesn't catch everything
3. **Test offline mode** - turn on airplane mode
4. **Clear cache between tests** - ensure clean slate
5. **Check mobile DevTools** - Safari/Chrome on phone have DevTools too

---

## 📞 Still Having Issues?

1. Check **Console** for error messages
2. Check **SECURITY_SETUP.md** for your server type
3. Verify all files are in same folder
4. Try hard refresh (Ctrl+Shift+R)
5. Clear browser cache completely

---

**Everything should work now!** ✨

Access Denied issue is fixed with relative paths. Test locally first, then deploy with HTTPS.

Enjoy! ☕

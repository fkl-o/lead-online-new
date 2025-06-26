# PWA Offline Testing Checklist

## ✅ **Pre-Testing Setup**

### 1. **Build and Serve the App**
```bash
# Build the production PWA
npm run build

# Serve the built app (with PWA features)
npm run preview
# OR use a simple HTTP server
npx serve dist -s
```

### 2. **Browser Setup** 
- Open Chrome DevTools
- Go to **Application** tab
- Check **Service Workers** section
- Verify service worker is registered and running

---

## 📱 **PWA Installation Testing**

### **Desktop (Chrome/Edge)**
1. ✅ Visit the app in browser
2. ✅ Look for install icon in address bar
3. ✅ Click install and verify app opens as standalone
4. ✅ Check Start Menu/Desktop shortcut creation
5. ✅ Verify app opens without browser UI

### **Mobile (Android)**
1. ✅ Open app in Chrome mobile
2. ✅ Wait for "Add to Home Screen" banner
3. ✅ Tap "Add to Home Screen"
4. ✅ Verify icon appears on home screen
5. ✅ Open from home screen and verify standalone mode

### **iOS (Safari)**
1. ✅ Open app in Safari
2. ✅ Tap Share button → "Add to Home Screen"
3. ✅ Verify standalone behavior

---

## 🌐 **Offline Functionality Testing**

### **Phase 1: Initial Load (Online)**
1. ✅ Load app with network enabled
2. ✅ Navigate through all major routes:
   - `/` (Home)
   - `/webentwicklung/*` 
   - `/marketing-automation/*`
   - `/digitalization/*`
   - `/contact`
   - `/login`
   - `/dashboard` (if logged in)
3. ✅ Verify all assets load correctly
4. ✅ Check DevTools → Application → Cache Storage
5. ✅ Confirm assets are cached

### **Phase 2: Go Offline**
1. ✅ **DevTools Method:**
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   
2. ✅ **System Method:**
   - Disable WiFi
   - Disconnect ethernet
   
3. ✅ **Service Worker Method:**
   - DevTools → Application → Service Workers
   - Check "Offline" simulation

### **Phase 3: Offline Navigation Testing**
1. ✅ Refresh the page (should load from cache)
2. ✅ Navigate to all cached routes:
   ```
   ✅ / (Home page)
   ✅ /webentwicklung
   ✅ /webentwicklung/responsive-design
   ✅ /webentwicklung/e-commerce
   ✅ /webentwicklung/cms-systeme
   ✅ /marketing-automation
   ✅ /marketing-automation/email-marketing
   ✅ /marketing-automation/lead-nurturing
   ✅ /marketing-automation/analytics
   ✅ /digitalization
   ✅ /digitalization/process-automation
   ✅ /digitalization/data-analytics
   ✅ /digitalization/ai-integration
   ✅ /contact
   ✅ /login
   ✅ /dashboard (if authenticated)
   ✅ /privacy-policy
   ✅ /imprint
   ```

3. ✅ Test browser back/forward buttons
4. ✅ Test direct URL navigation (address bar)
5. ✅ Verify no broken links or 404 errors

### **Phase 4: Offline Data Testing**
1. ✅ **Form Submissions:**
   - Fill out contact form offline
   - Verify data is queued for sync
   - Check IndexedDB storage

2. ✅ **API Interactions:**
   - Try login (should be queued)
   - Try dashboard actions (if applicable)
   - Verify offline queue in DevTools

3. ✅ **Data Persistence:**
   - Check DevTools → Application → Storage
   - Verify IndexedDB contains offline data
   - Confirm LocalStorage/SessionStorage works

### **Phase 5: Return Online Testing**
1. ✅ Re-enable network connection
2. ✅ Verify offline status indicator updates
3. ✅ Check automatic data synchronization
4. ✅ Confirm queued requests are processed
5. ✅ Verify no data loss occurred

---

## 🔧 **Advanced Testing Scenarios**

### **Cache Update Testing**
1. ✅ Make changes to app
2. ✅ Deploy new version
3. ✅ Open app (should show update notification)
4. ✅ Test "Update Later" functionality
5. ✅ Test "Update Now" functionality
6. ✅ Verify new version loads correctly

### **Network Intermittency**
1. ✅ Simulate slow network (DevTools → Network → Throttling)
2. ✅ Toggle online/offline rapidly
3. ✅ Verify app handles network state changes gracefully
4. ✅ Test request retrying behavior

### **Storage Limits Testing**
1. ✅ Fill cache with large amounts of data
2. ✅ Verify cache cleanup mechanisms work
3. ✅ Test app behavior when storage quota exceeded

### **Cross-Browser Testing**
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)  
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop)

---

## 🚨 **Common Issues to Check**

### **Navigation Issues**
- ❌ 404 errors on direct URL access
- ❌ Broken internal links
- ❌ Missing route caching
- ❌ Hash router conflicts

### **Asset Loading Issues**
- ❌ Missing images/icons offline
- ❌ Broken CSS/fonts
- ❌ Missing JavaScript chunks
- ❌ CORS issues with external resources

### **Data Issues**
- ❌ Form data loss
- ❌ Authentication state loss
- ❌ Sync failures when online
- ❌ Data corruption

### **Performance Issues**
- ❌ Slow offline loading
- ❌ Excessive cache size
- ❌ Memory leaks
- ❌ Battery drain

---

## 📊 **Success Criteria**

### **Minimum Requirements**
- ✅ App loads offline after initial visit
- ✅ All main navigation routes work offline
- ✅ Forms can be submitted offline (queued)
- ✅ Online/offline status is visible
- ✅ Data syncs when back online

### **Optimal Experience**
- ✅ InstantGötLoading (<200ms) for cached routes
- ✅ Seamless online/offline transitions
- ✅ No data loss in any scenario
- ✅ Update notifications work correctly
- ✅ Professional offline UI/UX

---

## 🛠️ **DevTools Commands for Testing**

```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations().then(console.log);

// Check cache contents
caches.keys().then(console.log);
caches.open('cache-name').then(cache => cache.keys()).then(console.log);

// Check IndexedDB
// Open DevTools → Application → Storage → IndexedDB

// Simulate offline
// DevTools → Network → Offline checkbox

// Clear all app data
// DevTools → Application → Storage → Clear storage
```

---

## 📝 **Test Report Template**

```
PWA Offline Test Report
Date: [DATE]
Tester: [NAME]
Browser: [BROWSER + VERSION]
Device: [DEVICE]

INSTALLATION TESTING:
□ Desktop Install: PASS/FAIL
□ Mobile Install: PASS/FAIL
□ Standalone Mode: PASS/FAIL

OFFLINE NAVIGATION:
□ Route Caching: PASS/FAIL
□ Navigation Works: PASS/FAIL
□ Assets Load: PASS/FAIL

DATA HANDLING:
□ Offline Forms: PASS/FAIL
□ Data Sync: PASS/FAIL
□ No Data Loss: PASS/FAIL

PERFORMANCE:
□ Load Speed: [TIME]
□ Cache Size: [SIZE]
□ Memory Usage: [USAGE]

ISSUES FOUND:
[List any issues discovered]

OVERALL RESULT: PASS/FAIL
```

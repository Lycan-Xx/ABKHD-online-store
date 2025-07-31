# Troubleshooting 426 Upgrade Required Error

The "426 Upgrade Required" error you're experiencing is a common issue in cloud development environments like Replit, especially with Vite's Hot Module Replacement (HMR) feature.

## Quick Fixes to Try

### Option 1: Use the Replit-specific config
```bash
npm run dev:replit
```

### Option 2: Disable HMR completely
```bash
npm run dev:no-hmr
```

### Option 3: Restart with cleared cache
```bash
# Stop the current dev server (Ctrl+C)
# Then run:
npm run dev -- --force
```

## Root Cause
The error occurs because:
1. Vite tries to establish a WebSocket connection for HMR
2. Replit's proxy doesn't properly handle WebSocket upgrade requests
3. The server returns a 426 status code indicating it needs a protocol upgrade

## Configuration Changes Made

### 1. Updated `vite.config.js`
- Added `host: '0.0.0.0'` to bind to all interfaces
- Set `clientPort: 443` for HTTPS environments
- Configured proper HMR settings for cloud environments

### 2. Created `vite.config.replit.js`
- Completely disables HMR (`hmr: false`)
- Optimized for Replit environment
- Use with `npm run dev:replit`

### 3. Added Environment Variables
- `VITE_HMR_PORT=443` for proper port handling

## Alternative Solutions

### If the above doesn't work, try:

1. **Disable HMR in main config:**
   ```js
   // In vite.config.js, change:
   hmr: {
     port: 5173,
     clientPort: 443,
     overlay: false,
   },
   // To:
   hmr: false,
   ```

2. **Use a different port:**
   ```bash
   npm run dev -- --port 3000
   ```

3. **Force IPv4:**
   ```bash
   npm run dev -- --host 127.0.0.1
   ```

## Testing Your Fix

1. Stop any running dev server
2. Try one of the solutions above
3. Open your Replit preview URL
4. Check if the React app loads properly

## If Still Having Issues

The problem might be:
1. **Strapi not running**: Make sure your Strapi backend is running on port 1337
2. **CORS issues**: Check Strapi's CORS configuration
3. **Environment variables**: Verify your `.env` file is correct
4. **Network issues**: Try refreshing the Replit environment

## Recommended Approach for Replit

For the most stable experience in Replit, use:
```bash
npm run dev:replit
```

This completely disables HMR, which eliminates the WebSocket upgrade issues but means you'll need to manually refresh the browser to see changes.

# 🎨 Background Image Setup Instructions

## Quick Setup (2 Steps)

### Step 1: Save the Background Image
1. **Right-click** the red moon image I showed you
2. **Save image as...** `background.jpg`
3. **Save location:** `c:\game\assets\background.jpg`

### Step 2: Refresh the Game
- Reload your browser (press `F5`)
- The epic red moon background will appear with animated dark red clouds!

---

## What I've Updated

✅ Modified game to load background image from `assets/background.jpg`
✅ Added animated dark red clouds that move across the background
✅ Adjusted cloud transparency and colors to match the theme
✅ Updated ground platform with red glow effects
✅ Changed border colors to match the red/dark theme
✅ 7 clouds instead of 5 for more atmosphere

---

## Features

- **Background Image:** Epic red moon Japanese landscape
- **Animated Clouds:** Dark red clouds slowly drifting across
- **Cloud Effects:** Semi-transparent with gradient effects
- **Random Heights:** Clouds reset at different heights for variety
- **Fallback:** Red gradient displays while image loads

---

## Alternative: Use PowerShell to Download

If you have the image URL, you can use PowerShell:

```powershell
# Example (replace URL with actual image URL)
Invoke-WebRequest -Uri "YOUR_IMAGE_URL" -OutFile "c:\game\assets\background.jpg"
```

---

## Troubleshooting

**Image not showing?**
- Check file is named exactly: `background.jpg`
- Check location: `c:\game\assets\background.jpg`
- Try hard refresh: `Ctrl + F5`
- Open browser console (F12) to check for errors

**Clouds not visible?**
- They're semi-transparent (40% opacity)
- Look for dark red moving shapes
- Adjust `cloudOpacity` in game.js if needed

---

That's it! Save the image and refresh to see your epic new background! 🌕🔴

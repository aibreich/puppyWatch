# 🐕 Puppy Watch

A beautiful and functional web application to help you keep track of your puppy's potty schedule and daily activities.

## How to Use

### Getting Started

1. Open `index.html` in your web browser
2. Allow notifications when prompted (optional but recommended)
3. Fill in your dog's information and click "Save Information"

### Using the Timer

- **Start Timer**: Click "Start Timer" to begin the 1-hour countdown
- **Pause/Resume**: Use the pause button to temporarily stop the timer
- **Reset**: Click "Reset" to return to 1:00:00
- **Timer Complete**: When the timer reaches 0:00:00, you'll get a notification and the timer will automatically log a potty break

### Logging Activities

- **Potty Break**: Logs the activity and automatically resets/restarts the timer
- **Walk**: Records walk activities
- **Feeding**: Tracks feeding times
- All activities are saved with timestamps and displayed in the activity log

### Keyboard Shortcuts

- **Ctrl/Cmd + Space**: Start/Pause timer
- **Ctrl/Cmd + R**: Reset timer
- **Ctrl/Cmd + P**: Log potty break

## Technical Details

### Browser Compatibility

- Modern browsers with ES6+ support
- Local Storage for data persistence
- Web Notifications API (optional)

### Data Storage

- All data is stored locally in the browser
- No server required - works completely offline
- Data persists between browser sessions

## Features

### ⏰ Potty Timer

- **1-hour countdown timer** for potty breaks
- **Pause/Resume** functionality
- **Visual progress bar** showing timer progress
- **Automatic notifications** when timer completes
- **Auto-restart** when potty break is logged

### 📝 Dog Information Tracking

- Store your dog's **name**, **breed**, and **age**
- Track **last potty time**
- **Local storage** - your data persists between sessions
- **Easy form** for quick updates

### 📊 Activity Logging

- **Log potty breaks**, **walks**, and **feedings**
- **Timestamped entries** with full date/time
- **Scrollable activity history** (last 50 activities)
- **Automatic timer reset** when potty break is logged

### 🎨 Modern UI/UX

- **Responsive design** - works on desktop and mobile
- **Beautiful gradient background**
- **Smooth animations** and hover effects
- **Clean, intuitive interface**
- **Toast notifications** for user feedback

### File Structure

```
puppyWatch/
├── index.html      # Main HTML structure
├── styles.css      # Modern CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Installation

1. Download or clone the files to your computer
2. Open `index.html` in any modern web browser
3. No additional setup required!

## Customization

### Changing Timer Duration

To modify the timer duration, edit the `timerDuration` property in `script.js`:

```javascript
this.timerDuration = 60 * 60 * 1000; // 1 hour in milliseconds
```

### Adding New Activity Types

To add new activity types, modify the HTML and JavaScript:

1. Add a new button in `index.html`
2. Add an event listener in `script.js`
3. The activity logging system will handle the rest automatically

## Browser Notifications

The app will request permission to show notifications when you first load it. If granted, you'll receive desktop notifications when:

- The potty timer completes
- Activities are logged successfully

## Mobile Usage

The application is fully responsive and works great on mobile devices:

- Touch-friendly buttons
- Optimized layout for small screens
- All features work on mobile browsers

## Privacy

- All data is stored locally on your device
- No data is sent to external servers
- No tracking or analytics
- Your puppy's information stays private

---

**Made with ❤️ for puppy parents everywhere!**

# 🚀 Knight-MD Bot - Quick Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js v20 or higher installed
- ✅ Active WhatsApp account
- ✅ Stable internet connection
- ✅ Terminal/Command Prompt access

## 🎯 Quick Start (5 Minutes)

### Step 1: Extract & Navigate

```bash
# Extract the bot folder
# Navigate to bot directory
cd knight-md-bot
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`

### Step 3: Start Bot

**Option A: Using NPM**
```bash
npm start
```

**Option B: Using Start Script (Linux/Mac)**
```bash
./start.sh
```

**Option C: Direct Node**
```bash
node index.js
```

### Step 4: Pairing Process

1. Bot will detect no session and start pairing mode
2. Terminal will prompt: `📱 Enter your WhatsApp number`
3. Type your number with country code (e.g., `918075169545`)
4. Press Enter
5. Bot will generate a pairing code like: `ABCD-1234`
6. Open WhatsApp on your phone
7. Go to: **Settings → Linked Devices → Link a Device**
8. Tap: **Link with phone number instead**
9. Enter the code from terminal
10. Wait for connection...

### Step 5: Success!

Once connected, you'll see:

```
═══════════════════════════════════════════════════
✅ 🇦🇱  𓊈   K͓̽ N͓̽ I͓̽ G͓̽ H͓̽ T͓̽   - M͓̽D͓̽  𓊉  🇦🇱 CONNECTED!
📱 Number: 918075169545
👤 Name: Your Name
═══════════════════════════════════════════════════

📢 Attempting to join channel...
✅ Successfully joined channel!
✅ Reacted with 🔥 to channel message
```

Bot will automatically:
- ✅ Join the official Knight-MD channel
- ✅ React to the latest channel message
- ✅ Update config with your number as owner
- ✅ Start listening for commands

## 🎮 Test Your Bot

Send these commands to bot:

1. `.menu` - Show all commands
2. `.ping` - Test response time
3. `.alive` - Check bot status

## ⚙️ Configuration (Optional)

Edit `config.js` to customize:

```javascript
BotName: "Your Bot Name",
Mode: "public",  // or "private"
Prefix: [".", "!"],  // Change command prefixes
TimeZone: "Asia/Kolkata",  // Your timezone
AntiDelete: true,  // Enable/disable anti-delete
```

## 📱 Features

### Automatic Features
- ✅ Auto-join official channel on first start
- ✅ Auto-react to channel messages
- ✅ Anti-delete message detection
- ✅ Auto-read status updates
- ✅ Day/Night theme switching

### Manual Commands
- 🎵 YouTube downloader (`.play`, `.ytmp3`, `.ytmp4`)
- 🖼️ Sticker maker (`.sticker`, `.s`)
- 👥 Group management (`.tagall`, `.kick`, `.promote`)
- 🔐 Owner controls (`.public`, `.private`, `.restart`)

## 🔧 Troubleshooting

### Bot Won't Start
```bash
# Check Node.js version
node -v

# Should show v20.x.x or higher
# If lower, update Node.js

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Pairing Failed
```bash
# Delete session folder
rm -rf session

# Restart bot
npm start

# Get new pairing code
```

### Commands Not Working

1. Check bot mode (should be `public` for everyone)
   ```
   .mode public
   ```

2. Verify prefix (default is `.`)
   ```
   .ping  ← Correct
   ping   ← Wrong (missing prefix)
   ```

3. For group commands, ensure bot is admin

### Connection Drops

Bot will auto-reconnect in 5 seconds. If it keeps disconnecting:
- Check internet connection
- Restart bot
- Delete session and re-pair

## 📂 File Structure

```
knight-md-bot/
├── index.js          # Main bot file
├── main.js           # Command handler
├── config.js         # Bot configuration
├── package.json      # Dependencies
├── README.md         # Documentation
├── SETUP.md          # This file
├── start.sh          # Start script
├── lib/
│   ├── smsg.js       # Message serializer
│   └── database.js   # Database handler
├── assets/           # Images
├── session/          # Auth data (auto-created)
└── plugins/          # Custom plugins

```

## 🎯 Next Steps

1. **Join Official Channel**  
   https://whatsapp.com/channel/0029Vb6jJ1h2UPBIiqvzpg3O

2. **Customize Bot**  
   Edit `config.js` with your preferences

3. **Add Custom Image**  
   Put `menu.jpg` in `assets/` folder

4. **Learn Commands**  
   Type `.menu` to see all available commands

## 💡 Pro Tips

- Keep bot running 24/7 using PM2:
  ```bash
  npm install -g pm2
  pm2 start index.js --name knight-md
  pm2 save
  ```

- Enable auto-restart:
  ```bash
  pm2 startup
  ```

- View logs:
  ```bash
  pm2 logs knight-md
  ```

## 🆘 Support

Need help?
- 📢 Join our channel: [Knight-MD Official](https://whatsapp.com/channel/0029Vb6jJ1h2UPBIiqvzpg3O)
- 👨‍💻 Contact owner: +91 80751 69545

## ⚠️ Important Notes

- ✅ Bot uses **pairing code** (no QR scanning)
- ✅ Owner number auto-updates on first pair
- ✅ Bot auto-joins official channel
- ✅ Session persists (no need to re-pair)
- ✅ Anti-delete saves last 100 messages
- ❌ Don't share session folder
- ❌ Don't run multiple instances with same session

## 🌟 Enjoy Your Bot!

Your Knight-MD bot is now ready to use. Have fun! 🎉

---

**🇦🇱 Made with ❤️ by KaaXhunteR 🇦🇱**

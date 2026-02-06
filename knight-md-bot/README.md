# 🇦🇱 𓊈 K͓̽ N͓̽ I͓̽ G͓̽ H͓̽ T͓̽ - M͓̽D͓̽ 𓊉 🇦🇱

> Advanced WhatsApp Bot with Baileys 2026 Pro

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vb6jJ1h2UPBIiqvzpg3O)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

## ✨ Features

- 🔐 **Pairing Code** - No QR scanning needed
- 📢 **Auto Channel Join** - Automatically joins official channel
- 🚫 **Anti-Delete** - Detects and notifies deleted messages
- 🎵 **Media Downloader** - YouTube audio/video downloads
- 🖼️ **Sticker Maker** - Image/video to sticker conversion
- 👥 **Group Management** - Advanced admin commands
- ⚡ **Fast & Stable** - Built with latest Baileys
- 🌙 **Day/Night Theme** - Automatic theme switching
- 📱 **Multi-Device** - Works on multiple devices
- 🔄 **Auto Update** - Self-updating configuration

## 📋 Requirements

- Node.js v20 or higher
- WhatsApp account
- Internet connection
- 1GB RAM minimum

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/kaaxmaybe/knight-MD
cd knight-md-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Bot

```bash
npm start
```

### 4. Pairing Process

1. Bot will ask for your WhatsApp number
2. Enter number with country code (e.g., `918075169545`)
3. Bot will generate a pairing code
4. Open WhatsApp → Linked Devices → Link a Device
5. Tap "Link with phone number instead"
6. Enter the code shown in terminal
7. Bot will automatically connect and join the official channel

## 🎮 Commands

### General Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.menu` | Show all commands | `.menu` |
| `.ping` | Check bot speed | `.ping` |
| `.runtime` | Check bot uptime | `.runtime` |
| `.alive` | Check bot status | `.alive` |
| `.owner` | Get owner contact | `.owner` |
| `.info` | Bot information | `.info` |

### Media Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.play` | Download YouTube audio | `.play faded` |
| `.ytmp3` | YouTube to MP3 | `.ytmp3 <url>` |
| `.ytmp4` | YouTube to MP4 | `.ytmp4 <url>` |
| `.sticker` | Create sticker | `.sticker` (reply to image/video) |
| `.toimage` | Sticker to image | `.toimage` (reply to sticker) |
| `.tovideo` | Animated sticker to video | `.tovideo` (reply to sticker) |

### Group Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.groupinfo` | Group information | `.groupinfo` |
| `.tagall` | Tag all members | `.tagall <message>` |
| `.hidetag` | Hidden tag | `.hidetag <message>` |
| `.add` | Add member | `.add 628xxx` |
| `.kick` | Remove member | `.kick` (reply/tag) |
| `.promote` | Make admin | `.promote` (reply/tag) |
| `.demote` | Remove admin | `.demote` (reply/tag) |
| `.mute` | Close group | `.mute` |
| `.unmute` | Open group | `.unmute` |

### Owner Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.public` | Set bot to public | `.public` |
| `.private` | Set bot to private | `.private` |
| `.restart` | Restart bot | `.restart` |
| `.join` | Join group | `.join <link>` |
| `.leave` | Leave group | `.leave` |

## ⚙️ Configuration

Edit `config.js` to customize:

```javascript
module.exports = {
  BotName: "🇦🇱  𓊈   K͓̽ N͓̽ I͓̽ G͓̽ H͓̽ T͓̽   - M͓̽D͓̽  𓊉  🇦🇱",
  OwnerNumber: ["918075169545"],
  OwnerName: "KaaXhunteR",
  Mode: "public",
  Prefix: [".", "!", "/", "#", "$"],
  TimeZone: "Asia/Kolkata",
  AntiDelete: true,
  AutoReadStatus: true,
  // ... more settings
}
```

## 🔧 Troubleshooting

### Bot won't connect
- Delete `session` folder
- Run `npm start` again
- Get new pairing code

### Commands not working
- Check if bot is in public mode
- Verify you're using correct prefix
- Check bot admin status (for group commands)

### Installation errors
- Update Node.js to v20+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

## 📢 Official Channel

Join our WhatsApp channel for:
- Bot updates
- New features
- Tips & tricks
- Support

[Join Channel](https://whatsapp.com/channel/0029Vb6jJ1h2UPBIiqvzpg3O)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Developer

**KaaXhunteR**
- WhatsApp: [+91 80751 69545](https://wa.me/918075169545)
- Channel: [Knight-MD Official](https://whatsapp.com/channel/0029Vb6jJ1h2UPBIiqvzpg3O)

## ⚠️ Disclaimer

This bot is for educational purposes only. Use responsibly and respect WhatsApp Terms of Service.

## 🌟 Credits

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Baileys Pro](https://github.com/hamxyztmvn/baileys-pro) - Enhanced Baileys
- All contributors and supporters

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/kaaxmaybe/knight-MD?style=social)
![GitHub forks](https://img.shields.io/github/forks/kaaxmaybe/knight-MD?style=social)

---

<div align="center">

**🇦🇱 Made with ❤️ by KaaXhunteR 🇦🇱**

⭐ Star this repo if you like it!

</div>

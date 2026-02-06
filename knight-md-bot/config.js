// ═══════════════════════════════════════════════════
//           KNIGHT-MD BOT CONFIGURATION
// ═══════════════════════════════════════════════════

module.exports = {
  // Bot Information
  BotName: "🇦🇱  𓊈   K͓̽ N͓̽ I͓̽ G͓̽ H͓̽ T͓̽   - M͓̽D͓̽  𓊉  🇦🇱",
  BotVersion: "2.0.0",
  
  // Owner Information (Main Developer)
  OwnerNumber: ["918075169545"], // Will be updated on first pairing
  OwnerName: "KaaXhunteR",
  
  // Bot Mode (public/private)
  Mode: "public",
  
  // Prefix Settings
  Prefix: [".", "!", "/", "#", "$"],
  
  // Session Folder
  SessionFolder: "./session",
  
  // Timezone
  TimeZone: "Asia/Kolkata",
  
  // Pairing Mode
  isPairing: true,
  
  // Channel Settings
  AutoJoinChannel: true,
  ChannelLink: "https://whatsapp.com/channel/0029Vb6jJ1h2UPBIiqvzpg3O",
  ChannelJid: "0029Vb6jJ1h2UPBIiqvzpg3O@newsletter",
  
  // Auto React Emojis (for channel)
  ReactEmojis: ["❤️", "🔥", "⚡", "💯", "✨", "🎯", "👑", "🚀", "💪", "🌟", "😍", "🤩", "💎", "🏆", "🎉"],
  
  // Anti-Delete Settings
  AntiDelete: true,
  SaveDeletedMessages: true,
  
  // Welcome Message
  WelcomeMessage: false,
  
  // Auto Read Status
  AutoReadStatus: true,
  
  // Auto React to Status
  AutoReactStatus: true,
  StatusReaction: "🤍",
  
  // Auto Type & Recording
  AutoTyping: false,
  AutoRecording: false,
  
  // Response Delay (milliseconds)
  ResponseDelay: 1000,
  
  // APIs (Free & Public)
  APIs: {
    YtDl: "https://api.davidcyriltech.my.id",
    ImageGen: "https://api.davidcyriltech.my.id",
    Sticker: "https://api.davidcyriltech.my.id"
  }
}

// Make config globally accessible
global.BotName = module.exports.BotName
global.OwnerNumber = module.exports.OwnerNumber
global.OwnerName = module.exports.OwnerName
global.Mode = module.exports.Mode
global.Prefix = module.exports.Prefix
global.SessionFolder = module.exports.SessionFolder
global.TimeZone = module.exports.TimeZone
global.isPairing = module.exports.isPairing
global.ChannelJid = module.exports.ChannelJid
global.ChannelLink = module.exports.ChannelLink

// ═══════════════════════════════════════════════════
//           KNIGHT-MD BOT - MAIN INDEX
// ═══════════════════════════════════════════════════

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  jidDecode,
  delay,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const chalk = require("chalk")
const readline = require("readline")
const fs = require("fs")
const path = require("path")

require("./config")

const { smsg } = require("./lib/smsg")
const database = require("./lib/database")
const main = require("./main")

// Global variables
let rl

// Decode JID helper
function decodeJid(jid) {
  if (!jid) return jid
  const decode = jidDecode(jid) || {}
  return (decode.user && decode.server) 
    ? `${decode.user}@${decode.server}`
    : jid
}

// Auto-join channel and react
async function autoJoinChannel(sock) {
  if (!global.ChannelJid) return
  
  try {
    console.log(chalk.cyan('📢 Attempting to join channel...'))
    
    // Try to follow the channel
    await sock.newsletterFollow(global.ChannelJid)
    console.log(chalk.green('✅ Successfully joined channel!'))
    
    // Get channel metadata and react to last message
    await delay(2000)
    
    try {
      const metadata = await sock.newsletterMetadata("invite", global.ChannelJid)
      
      if (metadata && metadata.id) {
        // Get random emoji
        const emojis = ["❤️", "🔥", "⚡", "💯", "✨", "🎯", "👑", "🚀", "💪", "🌟"]
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        
        // Try to get and react to recent messages
        const messages = await sock.newsletterFetchMessages(global.ChannelJid, 1)
        
        if (messages && messages.length > 0) {
          await sock.sendMessage(global.ChannelJid, {
            react: {
              text: randomEmoji,
              key: messages[0].key
            }
          })
          console.log(chalk.green(`✅ Reacted with ${randomEmoji} to channel message`))
        }
      }
    } catch (reactErr) {
      console.log(chalk.yellow('⚠️ Could not react to channel message'))
    }
    
  } catch (err) {
    console.log(chalk.yellow('⚠️ Could not join channel:', err.message))
  }
}

// Update config with pairing number
function updateConfigOwner(phoneNumber) {
  try {
    const configPath = path.join(__dirname, 'config.js')
    let configContent = fs.readFileSync(configPath, 'utf8')
    
    // Update OwnerNumber array
    configContent = configContent.replace(
      /OwnerNumber:\s*\[.*?\]/,
      `OwnerNumber: ["918075169545", "${phoneNumber}"]`
    )
    
    fs.writeFileSync(configPath, configContent)
    console.log(chalk.green(`✅ Config updated with owner number: ${phoneNumber}`))
  } catch (err) {
    console.log(chalk.yellow('⚠️ Could not update config file'))
  }
}

// Ignored errors
const ignoredErrors = [
  'Socket connection timeout',
  'EKEYTYPE',
  'item-not-found',
  'rate-overlimit',
  'Connection Closed',
  'Timed Out',
  'Value not found',
  'ConflictError'
]

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.SessionFolder)
  const { version } = await fetchLatestBaileysVersion()

  const KnightAssistant = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
    },
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu("Chrome"),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    getMessage: async (key) => {
      return { conversation: "Hi" }
    }
  })

  KnightAssistant.decodeJid = decodeJid
  KnightAssistant.ev.on("creds.update", saveCreds)

  // Connection handler
  KnightAssistant.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    try {
      if (lastDisconnect?.error) {
        const errMsg =
          lastDisconnect.error?.message ||
          lastDisconnect.error?.output?.payload?.message ||
          ''

        if (ignoredErrors.some(e => errMsg.includes(e))) {
          console.log(chalk.yellow(`⚠️ Ignored error: ${errMsg}`))
          return
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode

        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
          console.log(chalk.red('❌ Logged out from WhatsApp. Delete session & pair again.'))
          try {
            fs.rmSync(global.SessionFolder, { recursive: true, force: true })
          } catch {}
          process.exit(1)
        }

        console.log(chalk.yellow('🔄 Connection closed. Reconnecting in 5s...'))
        setTimeout(() => startBot(), 5000)
      }

      else if (connection === 'open') {
        KnightAssistant.user.jid = KnightAssistant.user.id.split(':')[0] + '@s.whatsapp.net'
        
        console.log(chalk.green('\n' + '═'.repeat(50)))
        console.log(chalk.green.bold(`✅ ${global.BotName} CONNECTED!`))
        console.log(chalk.cyan(`📱 Number: ${KnightAssistant.user.id.split(':')[0]}`))
        console.log(chalk.cyan(`👤 Name: ${KnightAssistant.user.name || 'Unknown'}`))
        console.log(chalk.green('═'.repeat(50) + '\n'))

        try { if (rl) rl.close() } catch {}

        // Auto-join channel
        if (global.ChannelJid) {
          await autoJoinChannel(KnightAssistant)
        }
      }

    } catch (err) {
      console.log(chalk.red('❌ connection.update error prevented'))
      console.error(err)
    }
  })

  // Pairing code handler
  try {
    const registered = Boolean(state?.creds?.registered)
    
    if (!registered && global.isPairing) {
      console.log(chalk.cyan("\n📲 No session found. Starting pairing flow...\n"))
      
      await delay(3000)
      
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      const question = (q) => new Promise(res => rl.question(q, res))

      try {
        const rawNumber = await question(
          chalk.yellow("📱 Enter your WhatsApp number (with country code, e.g., 918075169545): ")
        )
        
        const phoneNumber = rawNumber.replace(/[^0-9]/g, "")
        
        if (!phoneNumber || phoneNumber.length < 10) {
          console.log(chalk.red("❌ Invalid phone number"))
          rl.close()
          process.exit(1)
        }
        
        rl.close()
        console.clear()
        
        const code = await KnightAssistant.requestPairingCode(phoneNumber)
        
        console.log(chalk.green("\n" + "═".repeat(50)))
        console.log(chalk.green.bold(`🔑 PAIRING CODE: ${code}`))
        console.log(chalk.green("═".repeat(50) + "\n"))
        
        console.log(chalk.cyan("📱 Follow these steps:"))
        console.log(chalk.cyan("1. Open WhatsApp on your phone"))
        console.log(chalk.cyan("2. Tap Menu (3 dots) → Linked Devices"))
        console.log(chalk.cyan("3. Tap 'Link a Device'"))
        console.log(chalk.cyan("4. Tap 'Link with phone number instead'"))
        console.log(chalk.cyan(`5. Enter this code: ${code}\n`))
        console.log(chalk.yellow("⏳ Waiting for you to enter the code...\n"))
        
        // Update config with pairing number
        updateConfigOwner(phoneNumber)
        
      } catch (err) {
        console.log(chalk.red("❌ Pairing failed:"))
        console.error(err.message || err)
        if (err.message?.includes("not connected")) {
          console.log(chalk.yellow("⚠️ Please restart the bot and try again"))
        }
        process.exit(1)
      }
    }
  } catch (err) {
    console.log(chalk.red("❌ Pairing init error:"))
    console.error(err)
  }

  // Message handler
  KnightAssistant.ev.on("messages.upsert", async ({ messages, type }) => {
    try {
      if (type !== "notify") return
      
      const msg = messages[0]
      if (!msg || !msg.message) return

      // Auto read & react to status
      if (msg.key.remoteJid === 'status@broadcast') {
        try {
          await KnightAssistant.readMessages([msg.key])
          await KnightAssistant.sendMessage(
            'status@broadcast',
            {
              react: {
                key: msg.key,
                text: '🤍'
              }
            },
            { statusJidList: [msg.key.participant] }
          )
        } catch (e) {
          // Ignore status errors
        }
        return
      }

      // Process message
      const m = smsg(KnightAssistant, msg)
      await main(KnightAssistant, m)

    } catch (err) {
      console.log(chalk.red("Error in messages.upsert:"), err)
    }
  })

  // Anti-delete handler
  KnightAssistant.ev.on("messages.update", async (updates) => {
    try {
      for (const update of updates) {
        if (update.update.message === null) {
          // Message was deleted
          const deletedMsg = database.getLastDeleted(update.key.remoteJid)
          
          if (deletedMsg && global.AntiDelete) {
            const text = `🚫 *ANTI-DELETE DETECTED*\n\n` +
              `👤 Sender: @${deletedMsg.sender.split('@')[0]}\n` +
              `📝 Message: ${deletedMsg.message || 'Media/Sticker'}\n` +
              `🕐 Time: ${new Date(deletedMsg.timestamp).toLocaleString()}`
            
            await KnightAssistant.sendMessage(deletedMsg.chat, {
              text,
              mentions: [deletedMsg.sender]
            })
          }
        }
      }
    } catch (err) {
      console.log(chalk.yellow('⚠️ Anti-delete error:'), err.message)
    }
  })

  // Store all messages for anti-delete
  KnightAssistant.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg || !msg.message) return
      
      const m = smsg(KnightAssistant, msg)
      
      if (m.text || m.msg) {
        database.saveDeletedMessage({
          id: m.id,
          chat: m.chat,
          sender: m.sender,
          message: m.text,
          type: m.type
        })
      }
    } catch (err) {
      // Silent fail for storing messages
    }
  })
}

// Start bot
startBot()

// Watch for file changes
fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename)
  console.log(chalk.yellow("♻️ index.js updated"))
  delete require.cache[require.resolve(__filename)]
  require(__filename)
})

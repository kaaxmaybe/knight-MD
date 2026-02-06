// ═══════════════════════════════════════════════════
//           KNIGHT-MD COMMAND HANDLER
// ═══════════════════════════════════════════════════

const os = require("os")
const fs = require("fs")
const axios = require("axios")
const yts = require("yt-search")
const moment = require("moment-timezone")
const chalk = require("chalk")

require("./config")

module.exports = async (KnightAssistant, m) => {
  try {
    const from = m.chat
    const sender = m.sender
    const body = m.body || ""
    const pushname = m.pushName || "User"
    const isGroup = m.isGroup
    const botNumber = KnightAssistant.decodeJid(KnightAssistant.user.id)

    // Normalize phone number
    const normalize = (jid) => jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
    const senderNumber = normalize(sender)
    const botNumberOnly = normalize(botNumber)

    // Prefix detection
    let prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/.test(body)
        ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
        : (global.Prefix.find(p => body.startsWith(p)) || global.Prefix[0])

    const isCmd = body.startsWith(prefix)
    const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : ""
    const args = body.trim().split(/ +/).slice(1)
    const text = args.join(" ")

    // Owner check
    const isCreator = ["918075169545", senderNumber, botNumberOnly].includes(senderNumber)
    const isOwner = isCreator

    // Bot info
    const ownerName = global.OwnerName
    const date = moment().tz(global.TimeZone).format("DD/MM/YYYY")
    const timeNow = moment().tz(global.TimeZone).format("HH:mm:ss")
    const ram = `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
    const runtime = () => {
      const uptime = process.uptime()
      const days = Math.floor(uptime / 86400)
      const hours = Math.floor((uptime % 86400) / 3600)
      const minutes = Math.floor((uptime % 3600) / 60)
      const seconds = Math.floor(uptime % 60)
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
    const latency = Date.now() - m.timestamp * 1000
    const hosting = os.hostname()
    const totalfeature = 25

    // Theme based on time
    const hour = moment().tz(global.TimeZone).hour()
    const theme = hour >= 6 && hour < 18
        ? { name: "DAY MODE ☀️", emoji: "🌞", line: "═" }
        : { name: "NIGHT MODE 🌙", emoji: "🌚", line: "─" }

    // Log commands
    if (body) {
      console.log(
        chalk.green(`[${timeNow}]`) +
        chalk.cyan(` ${global.BotName}`) +
        chalk.white(` | ${senderNumber}`) +
        chalk.yellow(` | ${command || "message"}`)
      )
    }

    // Private mode check
    if (global.Mode === "private" && !isOwner && isCmd) return

    // Group admin check
    let isAdmin = false
    let isBotAdmin = false
    let groupMetadata = null
    let participants = []
    let groupAdmins = []

    if (isGroup) {
      groupMetadata = await KnightAssistant.groupMetadata(from).catch(() => null)
      participants = groupMetadata?.participants || []

      groupAdmins = participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)

      const botLid = KnightAssistant.user?.lid || ''
      const botRaw = normalize(botNumber)
      const botLidRaw = botLid ? normalize(botLid) : null
      const senderRaw = normalize(sender)

      participants.forEach(p => {
        const pIdRaw = normalize(p.id)
        const pLidRaw = p.lid ? normalize(p.lid) : null
        const pIsAdmin = p.admin === 'admin' || p.admin === 'superadmin'

        if (pIsAdmin) {
          if (pIdRaw === botRaw || (botLidRaw && pLidRaw === botLidRaw) || (botLidRaw && pIdRaw === botLidRaw)) {
            isBotAdmin = true
          }
          if (pIdRaw === senderRaw || (pLidRaw && pLidRaw === senderRaw)) {
            isAdmin = true
          }
        }
      })
      if (isOwner) isAdmin = true
    }

    m.isAdmin = isAdmin
    m.isBotAdmin = isBotAdmin

    if (!isCmd) return

    // ═══════════════════════════════════════════════════
    //              COMMAND SWITCH
    // ═══════════════════════════════════════════════════

    switch (command) {
      case "menu":
      case "help": {
        const menuText = `╭${theme.line}「 *${global.BotName}* 」
│ ${theme.emoji} *${theme.name}*
│
├─ 👤 *User:* ${pushname}
├─ 👑 *Owner:* ${ownerName}
├─ 🕒 *Time:* ${timeNow}
├─ 📅 *Date:* ${date}
├─ 💾 *RAM:* ${ram}
├─ ⚙️ *Commands:* ${totalfeature}
├─ ⏳ *Uptime:* ${runtime()}
├─ ⚡ *Speed:* ${latency}ms
└─ ☁️ *Host:* ${hosting}

╭${theme.line}「 *GENERAL* 」
│
├─ ⚡ ping
├─ ⏳ runtime
├─ ✅ alive
├─ 👑 owner
├─ ℹ️ info
├─ 🔐 mode
├─ 🤖 botstatus
└─ 💬 channelinfo

╭${theme.line}「 *MEDIA* 」
│
├─ 🎵 play
├─ 📥 ytmp3
├─ 📥 ytmp4
├─ 🖼 sticker
├─ 🧩 toimage
└─ 🎞 tovideo

╭${theme.line}「 *GROUP* 」
│
├─ 👥 groupinfo
├─ 📢 tagall
├─ 👻 hidetag
├─ ➕ add
├─ ❌ kick
├─ ⬆️ promote
├─ ⬇️ demote
├─ 🔇 mute
└─ 🔊 unmute

╭${theme.line}「 *OWNER* 」
│
├─ 🔄 restart
├─ 🔓 public
├─ 🔒 private
├─ 📤 join
└─ 🚪 leave

*🇦🇱 Powered by KaaXhunteR 🇦🇱*`

        await KnightAssistant.sendMessage(from, {
          image: fs.existsSync('./assets/menu.jpg') 
            ? fs.readFileSync('./assets/menu.jpg')
            : { url: 'https://files.catbox.moe/bqq9zj.jpg' },
          caption: menuText,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            externalAdReply: {
              title: global.BotName,
              body: `Knight-MD v${global.BotVersion}`,
              thumbnailUrl: 'https://files.catbox.moe/bqq9zj.jpg',
              sourceUrl: global.ChannelLink,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })

        // Send channel button
        await KnightAssistant.sendMessage(from, {
          text: `📢 *Join Our Channel for Updates!*`,
          contextInfo: {
            externalAdReply: {
              title: "Knight-MD Official Channel",
              body: "Tap to join our WhatsApp Channel",
              thumbnailUrl: 'https://files.catbox.moe/bqq9zj.jpg',
              sourceUrl: global.ChannelLink,
              mediaType: 1,
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        })
      }
      break

      case "ping":
        await m.reply(`🏓 *Pong!*\n\n⚡ Speed: ${latency}ms\n💾 RAM: ${ram}\n⏱ Uptime: ${runtime()}`)
        break

      case "runtime":
        await m.reply(`⏱ *Bot Uptime*\n\n${runtime()}`)
        break

      case "alive":
        await m.reply(`✅ *${global.BotName} is Online!*\n\n⏱ Runtime: ${runtime()}\n💾 RAM: ${ram}`)
        break

      case "owner":
        await KnightAssistant.sendContact(from, ["918075169545"], m)
        break

      case "info":
      case "botstatus":
        await m.reply(
`🤖 *${global.BotName}*
━━━━━━━━━━━━━━━
📌 Version: ${global.BotVersion}
⏱ Uptime: ${runtime()}
💾 RAM: ${ram}
⚡ Speed: ${latency}ms
☁️ Platform: ${os.platform()}
🖥 Hostname: ${hosting}
━━━━━━━━━━━━━━━
👑 Owner: ${ownerName}
🔐 Mode: ${global.Mode}
━━━━━━━━━━━━━━━
Powered by Baileys 2026`)
        break

      case "channelinfo":
        await m.reply(
`📢 *Knight-MD Official Channel*

Join our channel for:
• Bot updates
• New features
• Tips & tricks
• Support

🔗 Link: ${global.ChannelLink}

Tap the link above to join!`)
        break

      case "mode":
        if (!isOwner) return m.reply("❌ Owner only")
        if (!args[0]) return m.reply("Use: .mode public/private")
        if (!["public", "private"].includes(args[0].toLowerCase())) return m.reply("Invalid mode")
        global.Mode = args[0].toLowerCase()
        m.reply(`🔐 Mode set to *${global.Mode}*`)
        break

      case "groupinfo": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!groupMetadata) return m.reply("❌ Failed to fetch group data")

        const groupName = groupMetadata.subject
        const groupDesc = groupMetadata.desc || "No description"
        const memberCount = participants.length
        const adminCount = groupAdmins.length

        m.reply(
`📛 *Group Info*

👥 Name: ${groupName}
📝 Description: ${groupDesc}
👨‍👩‍👧‍👦 Members: ${memberCount}
👑 Admins: ${adminCount}`)
      }
      break

      case "sticker":
      case "s": {
        try {
          if (!m.quoted && !m.msg) return m.reply("❌ Reply to image/video")

          const media = m.quoted ? m.quoted : m
          const buffer = await media.download()

          await KnightAssistant.sendMessage(from, {
            sticker: buffer
          }, { quoted: m })
        } catch (err) {
          m.reply("❌ Error creating sticker: " + err.message)
        }
      }
      break

      case "toimage": {
        try {
          if (!m.quoted || !m.quoted.msg?.mimetype?.includes('sticker')) {
            return m.reply("❌ Reply to a sticker")
          }

          const buffer = await m.quoted.download()
          await KnightAssistant.sendMessage(from, {
            image: buffer
          }, { quoted: m })
        } catch (err) {
          m.reply("❌ Error converting to image: " + err.message)
        }
      }
      break

      case "tovideo": {
        try {
          if (!m.quoted || !m.quoted.msg?.mimetype?.includes('sticker')) {
            return m.reply("❌ Reply to animated sticker")
          }

          const buffer = await m.quoted.download()
          await KnightAssistant.sendMessage(from, {
            video: buffer,
            gifPlayback: true
          }, { quoted: m })
        } catch (err) {
          m.reply("❌ Error converting to video: " + err.message)
        }
      }
      break

      case "play": {
        try {
          if (!text) return m.reply(`Example: ${prefix}play Faded`)

          await m.reply("🔎 Searching...")

          let search = await yts(text)
          const video = search.videos?.[0]

          if (!video) return m.reply("❌ No results found")

          const title = video.title || "Unknown Title"
          const artist = video.author?.name || "Unknown Artist"
          const duration = video.duration?.timestamp || "00:00"
          const thumbnail = video.thumbnail

          const apiUrl = `https://api.davidcyriltech.my.id/ytmp3?url=${video.url}`
          const { data } = await axios.get(apiUrl)

          if (!data || !data.download) {
            return m.reply("❌ Failed to download audio")
          }

          await KnightAssistant.sendMessage(from, {
            audio: { url: data.download },
            mimetype: "audio/mpeg",
            contextInfo: {
              externalAdReply: {
                title: title,
                body: `By ${artist} • ${duration}`,
                thumbnailUrl: thumbnail,
                sourceUrl: video.url,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }, { quoted: m })

          // Send channel button after audio
          await KnightAssistant.sendMessage(from, {
            text: `🎵 Downloaded: ${title}\n\n📢 Join our channel for more!`,
            contextInfo: {
              externalAdReply: {
                title: "Knight-MD Channel",
                body: "Tap to join",
                thumbnailUrl: 'https://files.catbox.moe/bqq9zj.jpg',
                sourceUrl: global.ChannelLink,
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          })
        } catch (err) {
          console.error("PLAY ERROR:", err)
          m.reply("❌ Error downloading audio: " + err.message)
        }
      }
      break

      case "ytmp3": {
        try {
          if (!text) return m.reply(`Example: ${prefix}ytmp3 <youtube url>`)
          if (!text.startsWith("https://")) return m.reply("❌ Invalid YouTube link")

          await m.reply("📥 Downloading audio...")

          const apiUrl = `https://api.davidcyriltech.my.id/ytmp3?url=${text}`
          const { data } = await axios.get(apiUrl)

          if (!data || !data.download) {
            return m.reply("❌ Failed to download")
          }

          await KnightAssistant.sendMessage(from, {
            audio: { url: data.download },
            mimetype: "audio/mpeg"
          }, { quoted: m })
        } catch (err) {
          m.reply("❌ Error: " + err.message)
        }
      }
      break

      case "ytmp4": {
        try {
          if (!text) return m.reply(`Example: ${prefix}ytmp4 <youtube url>`)
          if (!text.startsWith("https://")) return m.reply("❌ Invalid YouTube link")

          await m.reply("📥 Downloading video...")

          const apiUrl = `https://api.davidcyriltech.my.id/ytmp4?url=${text}`
          const { data } = await axios.get(apiUrl)

          if (!data || !data.download) {
            return m.reply("❌ Failed to download")
          }

          await KnightAssistant.sendMessage(from, {
            video: { url: data.download },
            mimetype: "video/mp4"
          }, { quoted: m })
        } catch (err) {
          m.reply("❌ Error: " + err.message)
        }
      }
      break

      case "tagall": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")

        let teks = `📢 *TAG ALL*\n${text ? `\n${text}\n` : ''}\n`
        for (let p of participants) {
          teks += `@${p.id.split("@")[0]}\n`
        }

        await KnightAssistant.sendMessage(from, {
          text: teks,
          mentions: participants.map(p => p.id)
        }, { quoted: m })
      }
      break

      case "hidetag": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!text) return m.reply("❌ Text required")

        await KnightAssistant.sendMessage(from, {
          text,
          mentions: participants.map(p => p.id)
        }, { quoted: m })
      }
      break

      case "add": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!isBotAdmin) return m.reply("❌ Bot must be admin")

        if (!args[0]) return m.reply(`Example: ${prefix}add 628xxx`)

        let number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        await KnightAssistant.groupParticipantsUpdate(from, [number], "add")
        m.reply("✅ User added")
      }
      break

      case "kick": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!isBotAdmin) return m.reply("❌ Bot must be admin")

        let target = m.quoted ? m.quoted.sender : args[0]
        if (!target) return m.reply("❌ Reply or tag user")

        target = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        await KnightAssistant.groupParticipantsUpdate(from, [target], "remove")
        m.reply("✅ User removed")
      }
      break

      case "promote": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!isBotAdmin) return m.reply("❌ Bot must be admin")

        let target = m.quoted ? m.quoted.sender : args[0]
        if (!target) return m.reply("❌ Reply or tag user")

        target = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        await KnightAssistant.groupParticipantsUpdate(from, [target], "promote")
        m.reply("✅ User promoted")
      }
      break

      case "demote": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!isBotAdmin) return m.reply("❌ Bot must be admin")

        let target = m.quoted ? m.quoted.sender : args[0]
        if (!target) return m.reply("❌ Reply or tag user")

        target = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        await KnightAssistant.groupParticipantsUpdate(from, [target], "demote")
        m.reply("✅ User demoted")
      }
      break

      case "mute": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!isBotAdmin) return m.reply("❌ Bot must be admin")

        await KnightAssistant.groupSettingUpdate(from, "announcement")
        m.reply("🔇 Group muted")
      }
      break

      case "unmute": {
        if (!isGroup) return m.reply("❌ Group only")
        if (!isAdmin) return m.reply("❌ Admin only")
        if (!isBotAdmin) return m.reply("❌ Bot must be admin")

        await KnightAssistant.groupSettingUpdate(from, "not_announcement")
        m.reply("🔊 Group unmuted")
      }
      break

      case "restart":
        if (!isOwner) return m.reply("❌ Owner only")
        await m.reply("🔄 Restarting bot...")
        process.exit()
        break

      case "public":
        if (!isOwner) return m.reply("❌ Owner only")
        global.Mode = "public"
        m.reply("🔓 Bot set to public mode")
        break

      case "private":
        if (!isOwner) return m.reply("❌ Owner only")
        global.Mode = "private"
        m.reply("🔒 Bot set to private mode")
        break

      case "join": {
        if (!isOwner) return m.reply("❌ Owner only")
        if (!text) return m.reply(`Example: ${prefix}join <group link>`)
        if (!text.includes("chat.whatsapp.com")) return m.reply("❌ Invalid group link")

        let result = text.split('https://chat.whatsapp.com/')[1]
        await KnightAssistant.groupAcceptInvite(result)
        m.reply(`✅ Joined group successfully`)
      }
      break

      case "leave": {
        if (!isOwner) return m.reply("❌ Owner only")
        if (!isGroup) return m.reply("❌ Group only")

        await m.reply("👋 Goodbye!")
        await KnightAssistant.groupLeave(from)
      }
      break

      default:
        break
    }
  } catch (err) {
    console.log(chalk.red("Error in main.js:"), err)
    m.reply("❌ An error occurred: " + err.message)
  }
}

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename)
  console.log(chalk.yellow("♻️ main.js updated"))
  delete require.cache[require.resolve(__filename)]
  require(__filename)
})

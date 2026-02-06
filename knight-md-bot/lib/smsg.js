// ═══════════════════════════════════════════════════
//         MESSAGE SERIALIZATION (SMSG)
// ═══════════════════════════════════════════════════

const { 
  downloadContentFromMessage, 
  getContentType, 
  jidDecode 
} = require('@whiskeysockets/baileys')

const fs = require('fs')
const chalk = require('chalk')

function smsg(conn, m) {
  if (!m) return m
  
  let M = m.message ? m : m
  
  if (M.key) {
    M.id = M.key.id
    M.isGroup = M.key.remoteJid.endsWith('@g.us')
    M.chat = M.key.remoteJid
    M.sender = M.key.fromMe 
      ? (conn.user.id.split(':')[0] + '@s.whatsapp.net') 
      : M.isGroup 
        ? M.key.participant 
        : M.key.remoteJid
    M.fromMe = M.key.fromMe
  }

  if (M.message) {
    M.type = getContentType(M.message)
    M.msg = (M.type === 'viewOnceMessage') 
      ? M.message[M.type].message[getContentType(M.message[M.type].message)] 
      : M.message[M.type]
    
    M.body = M.message.conversation 
      || M.msg?.caption 
      || M.msg?.text 
      || (M.type === 'listResponseMessage' && M.msg.singleSelectReply.selectedRowId) 
      || (M.type === 'buttonsResponseMessage' && M.msg.selectedButtonId) 
      || (M.type === 'templateButtonReplyMessage' && M.msg.selectedId) 
      || ''
    
    M.text = M.body
    M.pushName = M.pushName || 'No Name'
    M.quoted = M.msg?.contextInfo?.quotedMessage ? M.msg.contextInfo : null
    
    if (M.quoted) {
      M.quoted.type = getContentType(M.quoted.quotedMessage)
      M.quoted.msg = M.quoted.quotedMessage[M.quoted.type]
      M.quoted.sender = M.quoted.participant
      M.quoted.id = M.quoted.stanzaId
      M.quoted.text = M.quoted.msg?.text 
        || M.quoted.msg?.caption 
        || M.quoted.msg?.conversation 
        || ''
      
      M.quoted.download = () => downloadMedia(M.quoted.msg)
    }
    
    M.mentionedJid = M.msg?.contextInfo?.mentionedJid || []
    
    M.download = () => downloadMedia(M.msg)
  }

  M.reply = (text, options = {}) => {
    return conn.sendMessage(M.chat, { text }, { quoted: M, ...options })
  }

  M.isAdmin = false
  M.isBotAdmin = false
  
  return M
}

async function downloadMedia(msg) {
  let type = Object.keys(msg)[0]
  let stream = await downloadContentFromMessage(msg, type.replace('Message', ''))
  let buffer = Buffer.from([])
  
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }
  
  return buffer
}

module.exports = { smsg }

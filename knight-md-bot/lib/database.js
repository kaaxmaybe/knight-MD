// ═══════════════════════════════════════════════════
//           DATABASE MANAGEMENT
// ═══════════════════════════════════════════════════

const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, 'database')

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true })
}

// Database files
const files = {
  deletedMessages: path.join(dbPath, 'deleted_messages.json'),
  groups: path.join(dbPath, 'groups.json'),
  users: path.join(dbPath, 'users.json')
}

// Initialize database files
Object.values(files).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2))
  }
})

class Database {
  constructor() {
    this.deletedMessages = this.load('deletedMessages')
    this.groups = this.load('groups')
    this.users = this.load('users')
  }

  load(name) {
    try {
      const data = fs.readFileSync(files[name], 'utf8')
      return JSON.parse(data)
    } catch (err) {
      console.error(`Error loading ${name}:`, err)
      return []
    }
  }

  save(name) {
    try {
      fs.writeFileSync(files[name], JSON.stringify(this[name], null, 2))
      return true
    } catch (err) {
      console.error(`Error saving ${name}:`, err)
      return false
    }
  }

  // Save deleted message
  saveDeletedMessage(messageData) {
    try {
      this.deletedMessages.push({
        id: messageData.id,
        chat: messageData.chat,
        sender: messageData.sender,
        message: messageData.message,
        timestamp: Date.now(),
        messageType: messageData.type
      })
      
      // Keep only last 100 deleted messages
      if (this.deletedMessages.length > 100) {
        this.deletedMessages = this.deletedMessages.slice(-100)
      }
      
      this.save('deletedMessages')
      return true
    } catch (err) {
      console.error('Error saving deleted message:', err)
      return false
    }
  }

  // Get last deleted message from chat
  getLastDeleted(chatId) {
    return this.deletedMessages
      .filter(msg => msg.chat === chatId)
      .slice(-1)[0]
  }
}

module.exports = new Database()

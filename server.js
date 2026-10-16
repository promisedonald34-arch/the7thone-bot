import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import P from 'pino'

const PREFIX = process.env.PREFIX || '.'
const BOT_NAME = process.env.BOT_NAME || 'THE7THONE'
const OWNER = process.env.OWNER_NUMBER || '2348141216819'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: [BOT_NAME, 'Chrome', '1.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'open') {
      console.log(`✅ ${BOT_NAME} ONLINE on Render! Owner ${OWNER} Prefix ${PREFIX}`)
    }
    if (connection === 'close') {
      console.log('Connection closed, restarting...')
      startBot()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    const jid = msg.key.remoteJid
    if (!text) return

    if (text.toLowerCase() === 'hi' || text === PREFIX + 'hi') {
      await sock.sendMessage(jid, { text: `Hey! ${BOT_NAME} online 🤖\nOwner: ${OWNER}\nPrefix: ${PREFIX}\nTry ${PREFIX}menu` })
    }
    if (text === PREFIX + 'menu' || text.toLowerCase() === 'menu') {
      await sock.sendMessage(jid, { text: `*${BOT_NAME} MENU*\n${PREFIX}hi - hello\n${PREFIX}menu - this menu\n${PREFIX}ping - speed` })
    }
    if (text === PREFIX + 'ping') {
      await sock.sendMessage(jid, { text: `Pong! ${BOT_NAME} fast ⚡` })
    }
  })
}

startBot()

import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'

const PREFIX = process.env.PREFIX || '.'
const BOT_NAME = process.env.BOT_NAME || 'THE7THONE'
const OWNER = process.env.OWNER_NUMBER || '2348141216819'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ 
    auth: state, 
    logger: P({level:'silent'}),
    printQRInTerminal: true 
  })
  
  sock.ev.on('creds.update', saveCreds)
  
  sock.ev.on('connection.update', (u) => {
    if(u.connection === 'open') console.log('✅ '+BOT_NAME+' ONLINE on Render!')
  })

  sock.ev.on('messages.upsert', async ({messages}) => {
    const msg = messages[0]
    if(!msg.message || msg.key.fromMe) return
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    const jid = msg.key.remoteJid
    
    if(text.toLowerCase() === 'hi' || text === PREFIX+'hi'){
      await sock.sendMessage(jid, { text: `Hey! ${BOT_NAME} online 🤖\nOwner: ${OWNER}\nPrefix: ${PREFIX}\nTry ${PREFIX}menu` })
    }
    if(text === PREFIX+'menu'){
      await sock.sendMessage(jid, { text: `*${BOT_NAME} MENU*\n${PREFIX}hi - hello\n${PREFIX}ping - speed\n${PREFIX}menu - this menu` })
    }
  })
}
startBot()

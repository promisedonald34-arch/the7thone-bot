console.log("Starting THE7THONE Bot...");
console.log("PREFIX:", process.env.PREFIX);
console.log("BOT_NAME:", process.env.BOT_NAME);
console.log("OWNER:", process.env.OWNER_NUMBER);
console.log("NODE_VERSION:", process.version);

import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'

const start = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }), printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (u) => {
    if(u.connection === 'open') console.log("✅ THE7THONE IS LIVE!")
  })
}
start()

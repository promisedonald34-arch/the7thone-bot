const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
const express = require('express')

// Fake web server to keep Render happy
const app = express()
const PORT = process.env.PORT || 10000
app.get('/', (req, res) => res.send('THE7THONE BOT IS LIVE!'))
app.listen(PORT, () => console.log(`Server on port ${PORT}`))

const PREFIX = process.env.PREFIX || '.'
const BOT_NAME = process.env.BOT_NAME || 'THE7THONE'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: [BOT_NAME, 'Chrome', '1.0']
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (u) => {
    if(u.connection === 'open') console.log(`✅ ${BOT_NAME} IS LIVE! Scan QR above`)
  })
}
startBot()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => {
  res.send('THE7THONE BOT IS LIVE - Scan QR in Render Logs!')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on port ${PORT}`)
})

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const qrcode = require('qrcode-terminal')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['THE7THONE', 'Chrome', '1.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) {
      console.log('==== SCAN THIS QR ====')
      qrcode.generate(qr, { small: true })
    }
    if (connection === 'open') {
      console.log('✅ THE7THONE CONNECTED SUCCESSFULLY!')
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) startBot()
    }
  })
}

startBot()

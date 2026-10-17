const express = require('express')
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => res.send('THE7THONE BOT IS LIVE'))
app.listen(PORT, '0.0.0.0', () => console.log(`Server on port ${PORT}`))

console.log('Loading bot modules...')

async function startBot(){
  try{
    console.log('Starting THE7THONE bot...')
    const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
    const P = require('pino')
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    console.log('Auth loaded, creating socket...')
    const sock = makeWASocket({
      auth: state,
      logger: P({level:'silent'}),
      printQRInTerminal: true,
      browser: ['THE7THONE','Chrome','1.0']
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async(update)=>{
      console.log('Connection update:', update)
      const { connection } = update
      if(connection === 'open') console.log('✅ THE7THONE CONNECTED!')
    })
    console.log('Bot started, waiting for QR...')
  }catch(e){
    console.log('BOT CRASH ERROR:', e)
  }
}
startBot()

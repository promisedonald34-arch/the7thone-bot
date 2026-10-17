import express from 'express'
import { default as makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => res.send('THE7THONE BOT IS LIVE'))
app.listen(PORT, '0.0.0.0', () => console.log(`Server on port ${PORT}`))

console.log('Starting THE7THONE bot...')

async function startBot(){
  try{
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    console.log('Auth loaded, creating socket...')
    const sock = makeWASocket({
      auth: state,
      logger: pino({level:'silent'}),
      printQRInTerminal: true,
      browser: ['THE7THONE','Chrome','1.0']
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update)=>{
      console.log('Connection update:', update)
      if(update.connection === 'open') console.log('✅ THE7THONE CONNECTED!')
      if(update.connection === 'close'){
        const code = update.lastDisconnect?.error?.output?.statusCode
        if(code !== DisconnectReason.loggedOut) startBot()
      }
    })
    console.log('Bot started, waiting for QR...')
  }catch(e){
    console.log('BOT CRASH ERROR:', e)
  }
}
startBot()

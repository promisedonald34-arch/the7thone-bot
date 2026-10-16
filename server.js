const express = require('express')
const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req,res)=> res.send('THE7THONE BOT IS LIVE!'))

app.listen(PORT, '0.0.0.0', ()=> {
  console.log(`Server on port ${PORT}`)
})

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({
    auth: state,
    logger: P({level: 'silent'}),
    printQRInTerminal: true,
    browser: ['THE7THONE','Chrome','1.0']
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (update)=>{
    const { connection } = update
    if(connection === 'open'){
      console.log('✅ THE7THONE CONNECTED!')
    }
  })
  sock.ev.on('messages.upsert', async ({messages})=>{
    // your commands here
  })
}
startBot()

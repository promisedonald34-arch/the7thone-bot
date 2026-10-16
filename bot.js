import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import P from 'pino';

const PHONE_NUMBER = '2348141216819'; // <--- PUT YOUR BUSINESS NUMBER HERE, with country code, no +. Example 2348123456789

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ['The7thOne Bot', 'Chrome', '1.0.0']
    });
    sock.ev.on('creds.update', saveCreds);

    if (!state.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(PHONE_NUMBER);
                console.log(`\n\n>>> YOUR PAIRING CODE IS: ${code} <<<\n`);
                console.log(`Go to WhatsApp > Linked Devices > Link with phone number > Enter this code\n\n`);
            } catch (e) {
                console.log('Error getting pairing code:', e.message);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ The7thOne Bot is LIVE!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase().trim();
        let reply = '';
        if (['hi','hello','menu','0'].includes(text)) {
            reply = `Welcome to *THE 7TH ONE* 🖤\n\nHow can we help you today?\n\n*1* - View Products\n*2* - Place Order\n*3* - Track Order\n*4* - Customer Care`;
        } else if (text === '1') {
            reply = `🛍️ Our Collection - send what you need or check our Instagram`;
        } else if (text === '2') {
            reply = `📦 Send Product + Size + Address + Phone`;
        } else if (text === '3') {
            reply = `🚚 Send Order ID`;
        } else if (text === '4') {
            reply = `👤 Agent will reply soon`;
        } else {
            reply = `Type *MENU* for options 🖤`;
        }
        await sock.sendMessage(from, { text: reply });
    });
}
startBot();

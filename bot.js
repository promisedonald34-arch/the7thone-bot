import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import P from 'pino';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['The7thOne Bot', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (update.qr) {
            console.log('Scan this QR with your business WhatsApp:');
            qrcode.generate(update.qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
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
            reply = `Welcome to *THE 7TH ONE* 🖤\n\nHow can we help you today?\n\n*1* - View Products / Catalog\n*2* - Place an Order\n*3* - Track Order\n*4* - Talk to Customer Care\n\nReply with a number.`;
        } else if (text === '1') {
            reply = `🛍️ *Our Collection*\n\nCheck our catalog here: [Paste your Instagram/Website link]\n\nOr tell us what you need: Shirts, Pants, Sets?\n\nReply *2* to Order.`;
        } else if (text === '2') {
            reply = `📦 *To Place Order*\n\nSend:\n- Product Name / Screenshot\n- Size\n- Delivery Address\n- Phone Number\n\nWe will confirm price + delivery fee.`;
        } else if (text === '3') {
            reply = `🚚 *Track Order*\n\nPlease send your Order ID or Phone Number used to order.`;
        } else if (text === '4') {
            reply = `👤 *Customer Care*\n\nAn agent will attend to you shortly. Please describe your issue.`;
        } else {
            reply = `Thanks for reaching us at *THE 7TH ONE* 🖤\n\nType *MENU* to see options.`;
        }

        if (reply) {
            await sock.sendMessage(from, { text: reply });
        }
    });
}

startBot();

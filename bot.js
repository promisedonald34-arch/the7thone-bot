const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client(
        puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth(),
    webversionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1015901307-alpha.html',
    }
});

client.on('qr', qr => qrcode.generate(qr, {small: true}));
client.on('ready', () => console.log('🔥 ICONIC BOT READY!'));

const ICONIC = {
    hi: `╭━━━━━━━🔥 THE Gr8 ONE 🔥━━━━━━━╮
┃
┃  Yo! Welcome to the wave
┃  You just tapped the realest store in Lagos!
┃
┃  What you wanna do?
┃  MENU - See drip
┃  PRICE - Check cost  
┃  LOCATION
┃  ORDER - Get 10% OFF on first order
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

    menu: `🔥 THE Gr8 ONE - DRIP MENU 🔥

TOPS
- Gucci Tee - 15k
- Balenciaga - 22k
- Vintage - 10k

BOTTOMS
- Cargo - 18k
- Jean - 16k
- Shorts - 8k

FOOTWEAR
- Sneakers - 25k+
- Slides - 12k

PAYMENT: Transfer / Cash on Delivery
DELIVERY: Lagos same day

Type PRICE to order`,

    price: `PRICE LIST

STARTER PACK - 35k (Tee + Cargo + Cap)
BOSS PACK - 60k (Full drip + Sneakers)
SINGLE ITEMS - 8k to 25k

Want discount? Type ORDER and say The Gr8 ONE for 10% OFF!`,

    location: `WE ARE IN LAGOS!

Main: Yaba, Lagos
Delivery:
- Lagos - 2k-4k (Today)
- Ibadan - 3k
- Abuja - 5k

Type ORDER to drop your location`,

    order: `Get discount 10% then drop your order and location!

WhatsApp: wa.me/2347045816469
IG: @the7thones
Active: 9AM - 7PM Daily

Send your order now!`
};

client.on('message', async msg => {
    if (msg.fromMe) return;
    const text = msg.body.toLowerCase().trim();

    if (['hi','hello','hey','yo','sup'].includes(text)) {
        msg.reply(ICONIC.hi);
    } else if (text.includes('menu')) {
        msg.reply(ICONIC.menu);
    } else if (text.includes('price') || text.includes('cost') || text.includes('how much')) {
        msg.reply(ICONIC.price);
    } else if (text.includes('location') || text.includes('where')) {
        msg.reply(ICONIC.location);
    } else if (text.includes('order') || text.includes('boss') || text.includes('order')) {
        msg.reply(ICONIC.order);
    } else {
        msg.reply('You said: ' + msg.body + '\n\nI only understand: MENU | PRICE | LOCATION | OWNER');
    }
});

client.initialize();

const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅", 
    desc: "Get owner number",
    category: "owner",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumberRaw = config.OWNER_NUMBER; // eg: "+13058962443"
        if (!ownerNumberRaw) throw new Error('OWNER_NUMBER not set in config.');

        const ownerNumber = ownerNumberRaw.replace(/\D/g, ''); // retire + oswa lòt karaktè pou WhatsApp jid
        const ownerName = config.OWNER_NAME || 'Unknown';

        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${ownerName}\n` +
            `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumberRaw}\n` +
            'END:VCARD';

        // Helper pou retry voye mesaj
        async function safeSendMessage(msg) {
            try {
                await conn.sendMessage(from, msg, { quoted: mek });
            } catch (e) {
                console.error('Failed to send owner message, retrying...', e);
                await new Promise(r => setTimeout(r, 1500));
                try {
                    await conn.sendMessage(from, msg, { quoted: mek });
                } catch (err) {
                    console.error('Retry failed:', err);
                }
            }
        }

        // Voye vCard
        await safeSendMessage({
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Voye imaj + caption ak mention nan caption la
        await safeSendMessage({
            image: { url: 'https://files.catbox.moe/z4do8f.jpeg' },
            caption: `╭━━━〔 👑 *OWNER INFORMATION* 〕━━━╮
┃
┃ 👤 *Name*   : ${ownerName}
┃ 📞 *Number* : +${ownerNumber}
┃ 🧩 *Bot Ver*: 1.0.0 Beta
┃ ⚙️ *Powered By*: MKE BOY TECH
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯
📌 *MKE-X MD* | *Official Bot*
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ MKE BOY TECH*`,
            contextInfo: {
                mentionedJid: [`${ownerNumber}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: 'MKE-X MD',
                    serverMessageId: 143
                }
            }
        });

    } catch (error) {
        console.error('Owner command error:', error);
        reply(`❌ Erè: ${error.message}`);
    }
});

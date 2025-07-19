const converter = require('../data/converter');
const stickerConverter = require('../data/sticker-converter');
const { cmd } = require('../command');

cmd({
    pattern: 'toimg',
    alias: ['sticker2img', 'photo', 'stickertoimage', 's2i'],
    desc: 'Convert stickers to images',
    category: 'main',
    react: '🖼️',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!message.quoted) {
        return await client.sendMessage(from, {
            text: "✨ *sᴛɪᴄᴋᴇʀ ᴄᴏɴᴠᴇʀᴛᴇʀ*\n\n*ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀ sᴛɪᴄᴋᴇʀ ᴍᴇssᴀɢᴇ*\n\nExample: `.convert` (reply to sticker)"
        }, { quoted: message });
    }

    if (message.quoted.mtype !== 'stickerMessage') {
        return await client.sendMessage(from, {
            text: "*❌ ᴏɴʟʏ sᴛɪᴄᴋᴇʀ ᴍᴇssᴀɢᴇs ᴄᴀɴ ʙᴇ ᴄᴏɴᴠᴇʀᴛᴇᴅ*"
        }, { quoted: message });
    }

    // Send processing message
    await client.sendMessage(from, {
        text: "*🔄 ᴄᴏɴᴠᴇʀᴛɪɴɢ sᴛɪᴄᴋᴇʀ ᴛᴏ ɪᴍᴀɢᴇ...*"
    }, { quoted: message });

    try {
        const stickerBuffer = await message.quoted.download();
        const imageBuffer = await stickerConverter.convertStickerToImage(stickerBuffer);

        // Send result
        await client.sendMessage(from, {
            image: imageBuffer,
            caption: "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ MKE BOY TECH*",
            mimetype: 'image/png'
        }, { quoted: message });

    } catch (error) {
        console.error('Conversion error:', error);
        await client.sendMessage(from, {
            text: "❌ Please try with a different sticker."
        }, { quoted: message });
    }
});

cmd({
    pattern: 'tomp3',
    desc: 'Convert media to audio',
    category: 'main',
    react: '🎵',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🔊 Please reply to a video/audio message*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 300) {
        return await client.sendMessage(from, {
            text: "⏱️ Media too long (max 5 minutes)"
        }, { quoted: message });
    }

    // Send processing message and store it
    await client.sendMessage(from, {
        text: "🔄 Converting to audio..."
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const audio = await converter.toAudio(buffer, ext);

        // Send result
        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });

    } catch (e) {
        console.error('Conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
    }
});

cmd({
    pattern: 'toptt',
    desc: 'Convert media to voice message',
    category: 'main',
    react: '🎙️',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🗣️ Please reply to a video/audio message*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 60) {
        return await client.sendMessage(from, {
            text: "⏱️ Media too long for voice (max 1 minute)"
        }, { quoted: message });
    }

    // Send processing message
    await client.sendMessage(from, {
        text: "🔄 Converting to voice message..."
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const ptt = await converter.toPTT(buffer, ext);

        // Send result
        await client.sendMessage(from, {
            audio: ptt,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: message });

    } catch (e) {
        console.error('PTT conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to create voice message"
        }, { quoted: message });
    }
});


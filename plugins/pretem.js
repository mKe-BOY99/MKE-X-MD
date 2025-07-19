const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: 'pretem',
  desc: 'Re-send any sticker, image, or short video as yours (max 20s video)',
  category: 'main',
  react: '🎭',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const quoted = mek.quoted;

    if (!quoted || !['stickerMessage', 'videoMessage', 'imageMessage'].includes(quoted.mtype)) {
      return reply('❌ Reply to a *sticker*, *image*, or *short video* (max 200s).');
    }

    // For video, check duration
    if (quoted.mtype === 'videoMessage' && quoted.message.videoMessage.seconds > 200) {
      return reply('❌ Video is longer than 200 seconds. Please use a shorter one.');
    }

    const media = await bot.downloadMediaMessage(quoted);
    if (!media) return reply('❌ Failed to download media.');

    const userName = mek.pushName || 'Unknown';
    const packname = userName;
    const author = `𝐌𝗞𝚵`;

    const sticker = new Sticker(media, {
      pack: packname,
      author,
      type: StickerTypes.FULL,
      quality: 100,
      fps: 120,
      loop: 0,
    });

    const stickerBuffer = await sticker.toBuffer();
    await bot.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

  } catch (err) {
    console.error('[PRETEM ERROR]', err);
    reply('❌ Erè pandan konvèsyon. Tanpri eseye ankò.');
  }
});

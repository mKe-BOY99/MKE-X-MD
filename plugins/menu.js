const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
  pattern: 'menu',
  alias: ['help', 'm'],
  desc: 'Show command menu',
  category: 'main',
  react: '📜',
  filename: __filename
}, async (conn, mek, m, { from, pushname }) => {
  try {
    const botName = config.BOT_NAME || 'MKE-X MD';
    const ownerName = config.OWNER_NAME || 'Mr MKE BOY';
    const menuImage = config.MENU_IMAGE_URL || 'https://files.catbox.moe/z4do8f.jpeg';
    const userName = pushname || 'User';
    const prefix = config.PREFIX || '.';
    const mode = config.MODE || 'default';

    // Grouper commands pa kategori
    const grouped = {};
    for (const plugin of commands) {
      const category = plugin.category || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(plugin);
    }

    // Kree header meni an
    let text = `╭───〔 *${botName} MENU* 〕───⬣
│ 🤖 Bot de: ${ownerName}
│ 💬 User: ${userName}
│ ⏺️ Mode: ${mode}
│ 🔰 Prefix: ${prefix}
╰──────────────⬣\n`;

    // Ajoute commands yo pa kategori
    for (const category in grouped) {
      text += `\n╭─⟪ *${category.toUpperCase()}* ⟫\n`;
      for (const cmdItem of grouped[category]) {
        const name = cmdItem.pattern;
        const desc = cmdItem.desc ? `╰┈➤ ${cmdItem.desc}` : '';
        text += `│ 🜲 ${name}\n│ ${desc}\n`;
      }
      text += `╰──────────────⬣\n`;
    }

    // Voye mesaj meni an avèk imaj ak contextInfo
    await conn.sendMessage(from, {
      image: { url: menuImage },
      caption: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 777,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: botName,
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("Menu Error:", e);
    await conn.sendMessage(from, { text: `❌ Error generating menu:\n${e.message}` });
  }
});

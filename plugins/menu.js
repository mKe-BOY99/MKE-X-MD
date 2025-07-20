const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
  pattern: 'menu',
  alias: ['allmenu', 'mke'],
  desc: 'Show command menu',
  category: 'menu',
  react: '📜',
  filename: __filename
}, async (conn, mek, m, { from, pushname, isOwner }) => {

  // ✅ Check if user is the owner
  if (!isOwner) return reply("❌ This command is for the bot *owner only*.");
  
  try {
    const botName = config.BOT_NAME || 'MKE-X MD';
    const ownerName = config.OWNER_NAME || 'Mr MKE BOY';
    const menuImage = config.MENU_IMAGE_URL || 'https://files.catbox.moe/z4do8f.jpeg';
    const userName = pushname || 'User';
    const prefix = config.PREFIX || '.';
    const mode = config.MODE || 'default';

    const stages = [
      '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0%',
      '🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜  10%',
      '🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜  25%',
      '🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜  50%',
      '🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜  75%',
      '🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩  100%'
    ];
    let loadingMsg = await conn.sendMessage(from, { text: `🖤 Loading...\n${stages[0]}` }, { quoted: mek });

    for (let i = 1; i < stages.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      await conn.sendMessage(from, {
        edit: loadingMsg.key,
        text: `🖤 Loading...\n${stages[i]}`
      });
    }

    await new Promise(r => setTimeout(r, 900));
    await conn.sendMessage(from, {
      edit: loadingMsg.key,
      text: `✅ Loading complete! Preparing menu...`
    });

    // Grouper commands pa kategori
    const grouped = {};
    for (const plugin of commands) {
      const category = plugin.category || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(plugin);
    }

    // Uptime fonksyon
    const uptime = () => {
      const sec = process.uptime();
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    // Stats
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1);

    // Kree header meni an
    let text = `╭───〔 *${botName} MENU* 〕───⬣
│ 🤖 Bot de: *${ownerName}*
│ 💬 User: *${userName}*
│ ⏱️ Uptime: *${uptime()}*
│ ⏺️ Mode: *${mode}*
│ 🛠️ RAM: *${ramUsage}MB / ${totalRam}MB*
│ 🔰 Prefix: *${prefix}*
╰──────────────⬣\n`;

    // Ajoute commands yo pa kategori
    for (let k of keys) {
  menuText += `\n\n╔═══❖•ೋ 🌐 *${k.toUpperCase()} MENU* ೋ•❖═══╗\n`;

  const cmds = categoryMap[k]
    .filter(c => c.pattern)
    .sort((a, b) => a.pattern.localeCompare(b.pattern));

  cmds.forEach((cmd) => {
    const usage = cmd.pattern.split('|')[0];
    menuText += `║ ➤ ${usedPrefix}${toSmallCaps(usage)}\n`;
  });

  menuText += `╚════════════════════╝`;
}

    menuText += `\n\n🔋 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 ꯭𝐌𝗞𝚵 𝐁𝐎𝐘`;
    
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

 const audioOptions = [
      'https://files.catbox.moe/3cj1e3.mp4',
      'https://files.catbox.moe/vq3odo.mp4',
      'https://files.catbox.moe/fo2kz0.mp4',
      'https://files.catbox.moe/31os2j.mp4',
      'https://files.catbox.moe/2auhjw.mp4',
      'https://files.catbox.moe/czk8mu.mp4'
    ];

    const randomAudio = audioOptions[Math.floor(Math.random() * audioOptions.length)];

        try {
      await conn.sendMessage(from, {
        audio: { url: randomAudio },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: mek });
    } catch (e) {
      console.error('⚠️ Audio send failed:', e.message);
    }

  } catch (e) {
    console.error('❌ Menu error:', e.message);
    await reply(`❌ Menu Error: ${e.message}`);
  }
});

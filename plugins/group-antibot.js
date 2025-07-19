const { cmd } = require('../command');
const config = require('../config');

const antibotDB = new Map();

cmd({
  pattern: "antibot",
  desc: "Antibot system that auto-detects and removes users using bot commands",
  category: "group",
  use: "antibot on / antibot off",
  react: "🛡️",
  onlyGroup: true,
  fromMe: false,
}, async (m, gss) => {
  try {
    const body = m.body?.toLowerCase().trim();
    if (!body) return;
    if (body === "antibot on") {
      const groupMetadata = await gss.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const senderAdmin = participants.find(p => p.id === m.sender)?.admin;
      if (!senderAdmin) return m.reply("*⛔ Only admins can enable antibot.*");
      antibotDB.set(m.from, true);
      return m.reply("*✅ Antibot is now enabled in this group.*\n\n> *Do not use bot commands here.*");
    }
    if (body === "antibot off") {
      const groupMetadata = await gss.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const senderAdmin = participants.find(p => p.id === m.sender)?.admin;
      if (!senderAdmin) return m.reply("*⛔ Only admins can disable antibot.*");
      antibotDB.delete(m.from);
      return m.reply("*🧯 Antibot disabled.*");
    }
    if (antibotDB.get(m.from)) {
      const botCommandRegex = /\.(menu|help|ping|play|owner|img|repo|sc|start|command)/i;
      if (botCommandRegex.test(body)) {
        if (m.key) await gss.sendMessage(m.from, { delete: m.key });
        const warnedKey = m.from + "_warned";
        const warnedUsers = antibotDB.get(warnedKey) || new Set();
        if (warnedUsers.has(m.sender)) {
          await gss.groupParticipantsUpdate(m.from, [m.sender], 'remove');
          return m.reply(`*🚫 ${m.sender.split('@')[0]} has been removed for using bot commands repeatedly.*`);
        } else {
          warnedUsers.add(m.sender);
          antibotDB.set(warnedKey, warnedUsers);
          return m.reply(`*❌ Bot commands are forbidden here!*\n> *First warning for ${m.sender.split('@')[0]}.*`);
        }
      }
    }
  } catch (err) {
    console.error("❌ Antibot Error:", err);
    m.reply("*⚠️ An error occurred in the antibot system.*");
  }
});

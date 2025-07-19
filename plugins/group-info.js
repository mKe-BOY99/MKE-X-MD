const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: "ginfo",
  alias: ["groupinfo", "groupstats"],
  desc: "Afficher les infos du groupe.",
  category: "group",
  react: "📊",
  filename: __filename
}, async (conn, mek, m, {
  from, isGroup, isAdmins, isBotAdmins, participants, groupMetadata, reply, isOwner, isDev
}) => {
  try {
    // ⚙️ Default messages
    let msg = {
      only_gp: "❗ This command works only in groups.",
      you_adm: "❗ You must be an *admin* to use this command.",
      give_adm: "❗ Please give *admin* to the bot first."
    };

    // 🔄 Try to fetch custom message templates (optional)
    try {
      const remote = await fetchJson('https://raw.githubusercontent.com/JawadTech3/KHAN-DATA/refs/heads/main/MSG/mreply.json');
      if (remote?.replyMsg) msg = remote.replyMsg;
    } catch (e) {
      console.log("⚠️ Failed to fetch remote messages, using defaults.");
    }

    // 🔐 Basic checks
    if (!isGroup) return reply(msg.only_gp);
    if (!isAdmins && !isDev && !isOwner) return reply(msg.you_adm);
    if (!isBotAdmins) return reply(msg.give_adm);

    // 📸 Get group photo
    let groupPP;
    try {
      groupPP = await conn.profilePictureUrl(from, 'image');
    } catch {
      groupPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
    }

    // 📊 Group data
    const metadata = await conn.groupMetadata(from);
    const adminList = participants.filter(p => p.admin);
    const adminsMention = adminList.map(v => v.id);
    const adminNames = adminList.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');

    const owner = metadata.owner || adminList[0]?.id || 'unknown';
    const ownerTag = owner !== 'unknown' ? `@${owner.split('@')[0]}` : 'undefined';

    const desc = metadata.desc?.toString() || 'No description.';
    const groupName = metadata.subject || 'Unknown';
    const memberCount = metadata.participants.length;

    // 📝 Final output
    const caption = `
╭─❏ *GROUP INFORMATION* ❏
│ 👥 *Name:* ${groupName}
│ 🆔 *ID:* ${metadata.id}
│ 👤 *Owner:* ${ownerTag}
│ 📌 *Members:* ${memberCount}
│ 📝 *Description:* 
│ ${desc}
╰───────────────

🛡 *Admins:*
${adminNames}
`.trim();

    await conn.sendMessage(from, {
      image: { url: groupPP },
      caption,
      mentions: [...adminsMention, owner]
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply(`❌ *Error occurred!*\n\`\`\`${err.message}\`\`\``);
  }
});

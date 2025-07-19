const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "Join a group using an invite link",
    category: "group",
    use: '.join <Group Link>',
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, isOwner, reply }) => {
    try {
        if (!isOwner) return reply("❌ You don't have permission to use this command.");

        let groupLink;
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink || groupLink.length !== 22) {
            return reply("❌ *Invalid group link format*");
        }

        reply(`⏳ Attempting to join group using code: *${groupLink}*`);
        await conn.groupAcceptInvite(groupLink);
        reply(`✔️ Successfully joined the group!`);

    } catch (e) {
        console.error("Join Error:", e);
        if (e.message && e.message.includes('not-authorized')) {
            reply(`❌ *Error: Not authorized to join the group.*\n\nPossible Reasons:\n- The bot's WhatsApp account is restricted or banned\n- The session has expired or been logged out\n- The invite link is invalid or expired\n\nSolutions:\n- Try with a different WhatsApp number\n- Make sure the link is still valid\n- Reconnect or regenerate the bot session.`);
        } else {
            reply(`❌ *Unexpected error occurred:*\n\n${e.message || e}`);
        }
    }
});

// plugin by DAWENS-BOY96
// do not copy my plugin
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

// List of allowed owner JIDs
const owners = ['50942241547@s.whatsapp.net']; // Replace with your own number (include @s.whatsapp.net)
const isOwner = (sender) => owners.includes(sender);

const filePath = path.join(__dirname, '../data/password.json');

function setPassword(newPass) {
    fs.writeFileSync(filePath, JSON.stringify({ send_password: newPass }, null, 2));
}

// Command: .setpassword
cmd({
    pattern: "setpassword",
    desc: "Change password for .share command",
    category: "owner",
    filename: __filename,
    react: "🔐",
    owner: true
}, async (conn, mek, m, { q, reply }) => {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }
    if (!q || q.trim().length < 4) {
        return reply("❗ Usage: .setpassword <new_password> (min 4 characters)");
    }

    try {
        setPassword(q.trim());
        reply(`✅ New password saved: *${q.trim()}*`);
    } catch (e) {
        console.error(e);
        reply("❌ Error saving the password.");
    }
});

// Command: .share
const delay = ms => new Promise(res => setTimeout(res, ms));

cmd({
    pattern: "share",
    desc: "Send a text message to all groups (protected by password)",
    category: "owner",
    filename: __filename,
    react: "📢",
    owner: true
}, async (conn, mek, m, { q, reply }) => {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner/sudo-only command.*"
      }, { quoted: message });
    }
    
    if (!q) return reply("⚠️ Usage: .share <password> <message>");

    const [pass, ...msgParts] = q.trim().split(" ");
    const message = msgParts.join(" ");

    // Load password from file
    let savedPassword = "";
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath));
        savedPassword = data.send_password || "";
    }

    if (pass !== savedPassword) return reply("❌ Incorrect password!");
    if (!message) return reply("✏️ Please enter a message to send.");

    try {
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        if (groupIds.length === 0) return reply("❌ I'm not in any group.");

        await reply(`🚀 Sending message to ${groupIds.length} groups...`);

        let sent = 0;
        let failed = 0;

        for (const jid of groupIds) {
            try {
                await conn.sendMessage(jid, {
                    text: message,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363401051937059@newsletter",
                            newsletterName: "JESUS-CRASH-V1",
                            serverMessageId: 123
                        }
                    }
                }, { quoted: mek });
                sent++;
            } catch (err) {
                failed++;
                console.error(`Error sending to ${jid}: ${err.message}`);
            }

            await delay(200); // short delay to avoid rate limits
        }

        await reply(`✅ Done:\n✔️ Success: ${sent}\n❌ Failed: ${failed}`);
    } catch (e) {
        console.error("Error in share command:", e);
        await reply(`❌ Error: ${e.message}`);
    }
});

// Command: .viewpassword
cmd({
    pattern: "viewpassword",
    desc: "View current password",
    category: "owner",
    filename: __filename,
    react: "🛡️",
    owner: true
}, async (conn, mek, m, { reply }) => {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }
    try {
        if (!fs.existsSync(filePath)) return reply("❌ No password found.");
        const data = JSON.parse(fs.readFileSync(filePath));
        reply(`🔐 Current password: *${data.send_password}*`);
    } catch (e) {
        console.error(e);
        reply("❌ Error reading password.");
    }
});

// *Powered by DAWENS-BOY96*
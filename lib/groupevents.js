// Credits MKE-BOY99 - MKE-X MD‬ 💜 
// https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

function isBotUser(jid) {
  // Customize selon bezwen ou: sa a bloke prefix + suspicion jid
  return jid.startsWith('90') || jid.includes('@bot') || jid.includes('webhook') || jid.includes('test');
}

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363419768812867@newsletter',
        newsletterName: 'MKE-X MD',
        serverMessageId: 143,
    },
});

async function safeSendMessage(conn, jid, msg) {
  try {
    await conn.sendMessage(jid, msg);
  } catch (err) {
    console.error('Failed to send message, retrying...', err);
    try {
      await new Promise(r => setTimeout(r, 1500));
      await conn.sendMessage(jid, msg);
    } catch (e) {
      console.error('Retry failed:', e);
    }
  }
}

// Lis admin ki gen dwa demote/promote
const allowedAdmins = new Set([
  '50938091691@s.whatsapp.net',  // Mete nimewo ou la a
  '50941350366@s.whatsapp.net',   // ✅ Korek
]);

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupDesc = metadata.desc || 'No description available.';
        const memberCount = metadata.participants.length;

        let groupPP;
        try {
            groupPP = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            groupPP = fallbackPP;
        }

        // Jwenn lis admin aktyèl gwoup la (k ap gen 'admin' oubyen 'superadmin')
        const groupAdmins = metadata.participants
          .filter(p => p.admin !== null)
          .map(p => p.id);

        for (const user of update.participants) {
            const username = user.split('@')[0];
            const time = new Date().toLocaleString();
            let userPP;

console.log(`[EVENT] ${update.action} - ${user}`);

            try {
                userPP = await conn.profilePictureUrl(user, 'image');
            } catch {
                userPP = groupPP;
            }

            const sendMessage = async (caption, withImage = false, mentions = [user]) => {
                const contextInfo = {
                  mentionedJid: mentions,
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: 'MKE-X MD',
                    serverMessageId: 143,
                  },
                };

                let msg;
                if (withImage) {
                    msg = {
                      image: { url: userPP },
                      caption,
                      contextInfo,
                      mentions,
                    };
                } else {
                    msg = {
                      text: caption,
                      contextInfo,
                      mentions,
                    };
                }
                await safeSendMessage(conn, update.id, msg);
            };

    // --- ANTIBOT + KICK --- //
if (update.action === 'add') {
    if (isBotUser(user)) {
        await conn.groupParticipantsUpdate(update.id, [user], 'remove');
        const kickBotMsg = 
`🚫 @${username} was detected as a bot and has been removed automatically.
🛡️ AntiBot Protection is active.`;

        await sendMessage(kickBotMsg, false, [user]);
        continue;
    }

    if (config.WELCOME === 'true') {
        const welcome = 
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🎉 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 🎉
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 User      : @${username}
┃ 📅 Joined    : ${time}
┃ 👥 Members   : ${memberCount}
┃ 🏷️ Group     : ${groupName}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📋 Description:
┃ ${groupDesc.length > 70 ? groupDesc.slice(0, 70) + '...' : groupDesc}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💬 Please read the group rules and enjoy your stay!
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

        await sendMessage(welcome, true);

            // Goodbye
            } else if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbye = 
`╭─────────────◇
│ 👋 𝐌𝐄𝐌𝐁𝐄𝐑 𝐄𝐗𝐈𝐓𝐄𝐃
├─────────────────────
│ 👤 ᴜꜱᴇʀ: @${username}
│ 🕓 ʟᴇꜰᴛ ᴀᴛ: ${time}
│ 👥 ɴᴏᴡ ᴍᴇᴍʙᴇʀꜱ: ${memberCount}
╰───────────────◆`;

                await sendMessage(goodbye, true);

            // Promote event
            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author ? update.author.split('@')[0] : 'Inconnu';

                // Anti-promote si moun k ap fè aksyon an pa nan allowedAdmins
                if (!allowedAdmins.has(update.author)) {
                  // Redemote moun ki te promote a imedyatman
                  await conn.groupParticipantsUpdate(update.id, [user], 'demote');
                  const antiPromoteMsg = 
`🛡️ *ANTI-PROMOTE ALERT!*
👤 User: @${username}
🎯 Unauthorized promotion
🛡️ Demotion enforced
👑 Only Owner or Sudo can promote members.`;

                  await sendMessage(antiPromoteMsg, false, [user, update.author].filter(Boolean));
                  continue; // Skip reste a
                }

                // Si otorize, voye mesaj normal
                const promoteMsg = 
`▂▃▄▅▆▇█⟩ 𝗣𝗥𝗢𝗠𝗢𝗧𝗘𝗗 🎖️
┃ 👤 @${username}
┃ 👑 By: @${promoter}
┃ ⏰ Time: ${time}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

                await sendMessage(promoteMsg, false, [user, update.author].filter(Boolean));

            // Demote event ak kick si pa sudo/owner
            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author ? update.author.split('@')[0] : 'Inconnu';

                // Anti-demote si moun k ap fè aksyon an pa nan allowedAdmins
                if (!allowedAdmins.has(update.author)) {
                  // Repromote moun ki te demote a imedyatman
                  await conn.groupParticipantsUpdate(update.id, [user], 'promote');

                  const antiDemoteMsg = 
`🛡️ *ANTI-DEMOTE ALERT!*
👤 User: @${username}
🎯 Unauthorized demotion
🛡️ Re-promotion enforced
🚫 Demoter @${demoter} will be kicked!
👑 Only Owner or Sudo can demote members.`;

                  await sendMessage(antiDemoteMsg, false, [user, update.author].filter(Boolean));

                  // Kick demoter
                  await conn.groupParticipantsUpdate(update.id, [update.author], 'remove');
                  continue; // Skip rest
                }

                // Si otorize, voye mesaj normal
                const demoteMsg = 
`╔═════ ∘◦ ❴ ⚠️ 𝗗𝗘𝗠𝗢𝗧𝗘𝗗 ❵ ◦∘ ═════╗
║ 🧑‍💼 𝗨𝘀𝗲𝗿   : @${username}
║ 😞 𝗗𝗲𝗺𝗼𝘁𝗲𝗱 𝗕𝘆 : @${demoter}
║ ⏰ 𝗧𝗶𝗺𝗲   : ${time}
╚═══════════════════════════╝`;

                await sendMessage(demoteMsg, false, [user, update.author].filter(Boolean));
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
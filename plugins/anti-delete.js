const config = require("../config");
const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'antid'],
    desc: "Configure le système AntiDelete",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { reply, q, isOwner }) => {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }
    try {
        const command = q?.toLowerCase();

        switch (command) {
            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete activé pour les groupes et messages privés._');

            case 'off gc':
                await setAnti('gc', false);
                return reply('_AntiDelete désactivé pour les groupes._');

            case 'off dm':
                await setAnti('dm', false);
                return reply('_AntiDelete désactivé pour les messages privés._');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`_AntiDelete groupe maintenant ${!gcStatus ? 'activé' : 'désactivé'}._`);

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`_AntiDelete DM maintenant ${!dmStatus ? 'activé' : 'désactivé'}._`);

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete activé pour tous les chats._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                return reply(`_Statut AntiDelete_\n\n*DM:* ${currentDmStatus ? 'Activé' : 'Désactivé'}\n*Groupes:* ${currentGcStatus ? 'Activé' : 'Désactivé'}`);

            default:
                return reply(`-- *Guide des commandes AntiDelete* --
• \`\`.antidelete on\`\` – Active AntiDelete globalement
• \`\`.antidelete off gc\`\` – Desactivate for group
• \`\`.antidelete off dm\`\` – Desactivat for DM
• \`\`.antidelete set gc\`\` – Activate/Desactivate for groups
• \`\`.antidelete set dm\`\` – Activate/Desactivate for DM
• \`\`.antidelete set all\`\` – Activate for all chats
• \`\`.antidelete status\`\` – Vérifie le statut actuel`);
        }
    } catch (e) {
        console.error("Erreur antidelete:", e);
        return reply("Une erreur est survenue.");
    }
});
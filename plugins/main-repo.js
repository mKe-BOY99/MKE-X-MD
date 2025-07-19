 const axios = require('axios');
const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Obtenir les infos du dépôt GitHub",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {

    const githubRepoURL = 'https://github.com/dawens8/JESUS-CRASH-V1';
    const sender = m.sender;

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Lien GitHub invalide.");

        const [, username, repoName] = match;

        const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);

        const repoData = await res.json();

        const info = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            author: repoData.owner.login,
            created: new Date(repoData.created_at).toLocaleDateString(),
            updated: new Date(repoData.updated_at).toLocaleDateString(),
            url: repoData.html_url,
        };

        const msg = `
╭─────『 *JESUS-CRASH-V1* 』─────╮
│👤 *Owner:* ${info.author}
│🌟 *Stars:* ${info.stars}
│🍴 *Forks:* ${info.forks}
│📅 *Créé:* ${info.created}
│♻️ *Mis à jour:* ${info.updated}
│🌐 *Repo:* ${info.url}
│🔗 *Session:* https://sessions-jesus.onrender.com
╰────────────────────────────╯

*➤ JESUS-CRASH-V1 est un bot WhatsApp rapide, puissant et blindé par Dawens Tech. Fork-le et laisse une 🌟 !*
        `.trim();

        const imgBuffer = await axios.get('https://files.catbox.moe/22rydb.jpeg', {
            responseType: 'arraybuffer'
        }).then(res => res.data);

        await conn.sendMessage(from, {
            image: imgBuffer,
            caption: msg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: 'JESUS-CRASH-V1',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Repo Error:", e);
        reply(`❌ Erreur : ${e.message}`);
    }
});

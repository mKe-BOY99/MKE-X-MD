const thanksCommand = async (m, Matrix) => {
  const prefix = "."; // Si gen yon lòt prefix, chanje li isit la
  const body = m.body || "";
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  const validCommands = ["thanks", "thanksto", "dev"];
  if (!validCommands.includes(cmd)) return;

  try {
    await m.React("👤");

    const message = `
╭━━━━━━━━━━━━━❰ *DEVELOPER INFO* ❱━━━━━━━━━━━━━╮
┃ 👤 Developer : *© MKE BOY*               
┃ 📱 Contact   : +50938091691                 
┃ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃
┃ 🤖 Bot       : *MKE-X MD*                
┃ 🌐 Version   : 1.0.0                        
┃ 📅 Updated   : ${new Date().toLocaleDateString()}  
┃ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃
┃ 👋 Hello, @${senderUsername}!                
┃ 🔰 Ready to serve you with the best!        
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━❯
`;

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: "https://files.catbox.moe/z4do8f.jpeg" },
        caption: message,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363419768812867@newsletter",
            newsletterName: "MKE-X MD",
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );

    await m.React("✅");
  } catch (err) {
    console.error("Thanks Command Error:", err);
    await Matrix.sendMessage(m.from, { text: `❌ Error: ${err.message}` }, { quoted: m });
    await m.React("❌");
  }
};

export default thanksCommand;

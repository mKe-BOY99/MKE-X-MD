const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "welcome",
  desc: "Enable or disable welcome/left message in group",
  category: "group",
  use: "welcome [on/off]",
  filename: __filename,
  execute: async (m, Matrix) => {
    const prefix = config.PREFIX;
    const cmdName = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmdName.length).trim();

    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    
    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    let responseMessage;

    if (text === "on") {
      config.WELCOME = true;
      responseMessage = "✅ WELCOME & LEFT message has been *enabled*.";
    } else if (text === "off") {
      config.WELCOME = false;
      responseMessage = "❌ WELCOME & LEFT message has been *disabled*.";
    } else {
      responseMessage = "📝 Usage:\n• `welcome on`: Enable welcome messages\n• `welcome off`: Disable welcome messages";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error in welcome command:", error);
      await Matrix.sendMessage(m.from, { text: "❗ Error processing your request." }, { quoted: m });
    }
  }
});
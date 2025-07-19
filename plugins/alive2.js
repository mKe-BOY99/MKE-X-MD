const fs = require('fs');
const path = require("path");
const { cmd } = require("../command");
const config = require('../config')

const ALIVE2_JSON = path.join(__dirname, '../lib/alive2.json');

function getAlive2Settings() {
  if (fs.existsSync(ALIVE2_JSON)) {
    try {
      return JSON.parse(fs.readFileSync(ALIVE2_JSON, "utf8"));
    } catch {
      return null;
    }
  }
  return null;
}

function setAlive2Settings(img, msg) {
  fs.writeFileSync(ALIVE2_JSON, JSON.stringify({ img, msg }, null, 2));
}

// Commande `.alive2`
cmd({
  pattern: "alive2",
  desc: "Check bot online or no.",
  category: 'main',
  filename: __filename
}, async (client, quotedMsg, message, { from, reply }) => {
  const settings = getAlive2Settings();
  if (!settings || !settings.img || !settings.msg) {
    return reply("Alive2 message/image not set yet!\nUse ${config.PREFIX} setalive <image/video_url> | <caption>\nEx: ${config.Prefix}setalive https://example.com/image.jpg | Hello, I am alive! 🌟");
  }

  try {
    // Envoie une réaction
    await client.sendMessage(message.key.remoteJid, {
      react: { text: '🌐', key: message.key }
    });

    // Remplace {runtime}
    const runtime = require("../lib/functions").runtime(process.uptime());
    const msgText = settings.msg.replace(/\{runtime\}/gi, runtime);
    const mediaUrl = settings.img;
    const isVideo = /\.(mp4|mov|webm|mkv)$/i.test(mediaUrl);

    const content = isVideo
      ? { video: { url: mediaUrl }, caption: msgText }
      : { image: { url: mediaUrl }, caption: msgText };

    await client.sendMessage(from, content, { quoted: quotedMsg });
  } catch (err) {
    console.log(err);
    reply(String(err));
  }
});

// Commande `.setalive`
cmd({
  pattern: "setalive",
  desc: "Set the alive2 image and message. Usage: ${config.PREFIX}setalive <image/video_url> | <caption>",
  category: "main",
  filename: __filename
}, async (client, quotedMsg, message, { from, args, isOwner, reply }) => {
  if (!isOwner) return reply("Only the bot owner can use this command!");

  const input = args.join(" ");
  if (!input.includes('|')) {
    return reply("❌ Usage: ${config.PREFIX}setalive <image/video_url> | <caption>\nUse .tourl to convert image to URL\nUse {runtime} to show bot uptime.");
  }

  const [url, ...captionParts] = input.split('|');
  const caption = captionParts.join('|').trim();

  if (!url.trim() || !caption) {
    return reply("❌ Both URL and caption are required.\nUsage: ${config.PREFIX}setalive <image/video_url> | <caption>");
  }

  setAlive2Settings(url.trim(), caption);
  reply("✅ Alive2 message and image saved! Use $config.PREFIX} alive2 to test.");
});
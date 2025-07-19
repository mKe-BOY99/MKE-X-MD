const axios = require('axios');
const { cmd } = require('../command');

// Model 1: ViewOnce Plus - fetch image, video, audio from viewOnceMessage
cmd({
  pattern: "vv3",
  alias: ['retrieve', '🔥', 'viewonce'],
  desc: "Fetch and resend a ViewOnce media message (image, video, audio).",
  category: "misc",
  use: '<reply_to_viewonce>',
  filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
  try {
    const quoted = m.quoted || m.msg?.contextInfo?.quotedMessage;
    if (!quoted) return reply("⚠️ Please reply to a ViewOnce message.");

    let messageObj = null;

    if (quoted.viewOnceMessageV2) {
      messageObj = quoted.viewOnceMessageV2.message;
    } else if (quoted.mtype === "viewOnceMessage") {
      messageObj = quoted.message;
    } else if (m.msg?.contextInfo?.quotedMessage?.viewOnceMessageV2) {
      messageObj = m.msg.contextInfo.quotedMessage.viewOnceMessageV2.message;
    }

    if (!messageObj) return reply("❌ Not a valid ViewOnce message.");

    if (messageObj.imageMessage) {
      const cap = messageObj.imageMessage.caption || "";
      const filePath = await conn.downloadAndSaveMediaMessage(messageObj.imageMessage);
      return await conn.sendMessage(from, { image: { url: filePath }, caption: cap }, { quoted: mek });
    } 
    else if (messageObj.videoMessage) {
      const cap = messageObj.videoMessage.caption || "";
      const filePath = await conn.downloadAndSaveMediaMessage(messageObj.videoMessage);
      return await conn.sendMessage(from, { video: { url: filePath }, caption: cap }, { quoted: mek });
    }
    else if (messageObj.audioMessage) {
      const filePath = await conn.downloadAndSaveMediaMessage(messageObj.audioMessage);
      return await conn.sendMessage(from, { audio: { url: filePath } }, { quoted: mek });
    } 
    else {
      return reply("⚠️ Unsupported ViewOnce media type.");
    }

  } catch (error) {
    console.error("ViewOnce fetch error:", error);
    return reply("❌ Error while fetching ViewOnce message.");
  }
});

// Model 2: ViewOnce Full - supports image, video, audio, sticker, document
cmd({
  pattern: "vv3full",
  alias: ['viewoncefull', 'vfull'],
  desc: "Fetch and resend any ViewOnce message (image, video, audio, sticker, document).",
  category: "misc",
  use: '<reply_to_viewonce>',
  filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
  try {
    const quoted = m.quoted || m.msg?.contextInfo?.quotedMessage;
    if (!quoted) return reply("Please reply to a ViewOnce message.");

    let msg = quoted.viewOnceMessageV2?.message || quoted.message || null;
    if (!msg) return reply("Not a valid ViewOnce message.");

    if (msg.imageMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.imageMessage);
      return conn.sendMessage(from, { image: { url: file }, caption: msg.imageMessage.caption || "" }, { quoted: mek });
    }
    if (msg.videoMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.videoMessage);
      return conn.sendMessage(from, { video: { url: file }, caption: msg.videoMessage.caption || "" }, { quoted: mek });
    }
    if (msg.audioMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.audioMessage);
      return conn.sendMessage(from, { audio: { url: file } }, { quoted: mek });
    }
    if (msg.stickerMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.stickerMessage);
      return conn.sendMessage(from, { sticker: { url: file } }, { quoted: mek });
    }
    if (msg.documentMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.documentMessage);
      return conn.sendMessage(from, { document: { url: file, mimetype: msg.documentMessage.mimetype, filename: msg.documentMessage.fileName || 'file' } }, { quoted: mek });
    }

    return reply("Unsupported ViewOnce media type.");
  } catch (e) {
    console.error("Error fetching ViewOnce Full:", e);
    reply("An error occurred fetching ViewOnce message.");
  }
});

// Model 3: ViewOnce with Expiry Notification
cmd({
  pattern: "vv3notify",
  alias: ['viewoncealert', 'viewonceinfo'],
  desc: "Fetch ViewOnce content and notify about expiration.",
  category: "misc",
  use: '<reply_to_viewonce>',
  filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
  try {
    const quoted = m.quoted || m.msg?.contextInfo?.quotedMessage;
    if (!quoted) return reply("Please reply to a ViewOnce message.");

    let msg = quoted.viewOnceMessageV2?.message || quoted.message || null;
    if (!msg) return reply("Not a valid ViewOnce message.");

    const expireWarning = "⚠️ Note: ViewOnce messages are ephemeral and may disappear soon.";

    if (msg.imageMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.imageMessage);
      await conn.sendMessage(from, { image: { url: file }, caption: msg.imageMessage.caption || "" }, { quoted: mek });
      return reply(expireWarning);
    }
    if (msg.videoMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.videoMessage);
      await conn.sendMessage(from, { video: { url: file }, caption: msg.videoMessage.caption || "" }, { quoted: mek });
      return reply(expireWarning);
    }
    if (msg.audioMessage) {
      const file = await conn.downloadAndSaveMediaMessage(msg.audioMessage);
      await conn.sendMessage(from, { audio: { url: file } }, { quoted: mek });
      return reply(expireWarning);
    }

    return reply("Unsupported ViewOnce media type.");
  } catch (e) {
    console.error("Error fetching ViewOnce with notify:", e);
    return reply("An error occurred fetching the ViewOnce message.");
  }
});

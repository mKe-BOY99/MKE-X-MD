const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  desc: "Convert media to Catbox URL",
  category: "whatsapp",
  react: "🖇",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const quoted = message.quoted || message;
    const mime = (quoted.msg || quoted)?.mimetype;

    if (!mime) return reply("❌ *Please reply to a media file (image, video, or audio).*");

    // Download media buffer
    const mediaBuffer = await quoted.download();
    const extension = mimeToExtension(mime);
    const tempFile = path.join(os.tmpdir(), `catbox_${Date.now()}${extension}`);
    
    fs.writeFileSync(tempFile, mediaBuffer);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(tempFile));

    const res = await postToCatbox(form); // Retry + timeout handled inside

    if (!res?.data || !res.data.startsWith("https://")) throw new Error("❌ *Catbox response is invalid.*");

    fs.unlinkSync(tempFile); // Clean up

    const mediaType = mime.split("/")[0]; // image / video / audio
    const typeLabel = mediaType[0].toUpperCase() + mediaType.slice(1);

    await reply(
      `✅ *${typeLabel} uploaded successfully!*\n\n` +
      `📦 *Size:* ${formatBytes(mediaBuffer.length)}\n` +
      `🔗 *URL:* ${res.data}\n\n` +
      `> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ MKE BOY_ 🤍`
    );

  } catch (err) {
    console.error("Upload error:", err);
    if (err.code === "ETIMEDOUT") {
      await reply("❌ *Catbox server timeout. Please try again later.*");
    } else if (err.code === "ENOTFOUND") {
      await reply("❌ *Catbox host not found. Check your internet/server connection.*");
    } else {
      await reply(`❌ *Error:* ${err.message || err}`);
    }
  }
});

// Function with retry logic
async function postToCatbox(form) {
  const options = {
    headers: form.getHeaders(),
    timeout: 10000,
  };

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await axios.post("https://catbox.moe/user/api.php", form, options);
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }
}

// Utility: Detect extension from MIME
function mimeToExtension(mime) {
  if (mime.includes("jpeg")) return ".jpg";
  if (mime.includes("png")) return ".png";
  if (mime.includes("mp4")) return ".mp4";
  if (mime.includes("mp3")) return ".mp3";
  if (mime.includes("webp")) return ".webp";
  return "";
}

// Utility: Format file size
function formatBytes(bytes) {
  const units = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`;
}

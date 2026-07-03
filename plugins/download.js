
const { cmd } = require("../command");
const { ytmp3, ytmp4, tiktok } = require("sadaslk-dlcore");
const yts = require("yt-search");


async function getYoutube(query) {
  const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
  if (isUrl) {
    const id = query.split("v=")[1] || query.split("/").pop();
    const info = await yts({ videoId: id });
    return info;
  }

  const search = await yts(query);
  if (!search.videos.length) return null;
  return search.videos[0];
}

cmd(
  {
    pattern: "ytmp3",
    alias: ["yta", "song"],
    desc: "Download YouTube MP3 by name or link",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*🎵 Please provide a song name or YouTube link!*");

      reply("*🔎 Searching for your song...*");
      const video = await getYoutube(q);
      if (!video) return reply("*❌ No results found for your query.*");

      const caption = 
        `╭───「 *VEXTER-MD MUSIC* 」───⊷\n` +
        `│\n` +
        `│ 🎵 *Title:* ${video.title}\n` +
        `│ 👤 *Channel:* ${video.author.name}\n` +
        `│ ⏱ *Duration:* ${video.timestamp}\n` +
        `│ 👀 *Views:* ${video.views.toLocaleString()}\n` +
        `│ 🔗 *Link:* ${video.url}\n` +
        `│\n` +
        `╰──────────────────────────⊷\n` +
        `> _*POWERED BY RANU* 🧬`;

      await bot.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: mek });
      reply("*⬇️ Downloading your music...*");

      const data = await ytmp3(video.url);
      if (!data?.url) return reply("*❌ Failed to download audio.*");

      await bot.sendMessage(from, { 
        audio: { url: data.url }, 
        mimetype: "audio/mpeg",
        contextInfo: { externalAdReply: { title: video.title, body: "POWERED BY RANU", thumbnailUrl: video.thumbnail, mediaType: 1 } }
      }, { quoted: mek });

    } catch (e) {
      console.log("YTMP3 ERROR:", e);
      reply("*❌ Error while downloading MP3.*");
    }
  }
);


// --- YTMP4 COMMAND ---
cmd(
  {
    pattern: "ytmp4",
    alias: ["ytv", "video"],
    desc: "Download YouTube MP4 by name or link",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply, sender }) => {
    try {
      if (!q) return reply("*🎬 Please provide a video name or YouTube link!*");

      reply("*🔎 Searching for your video...*");
      const video = await getYoutube(q);
      if (!video) return reply("*❌ No results found for your query.*");

      // ලස්සනට සකස් කළ caption එක
      const caption = 
        `╭───「 *VEXTER-MD YOUTUBE* 」───⊷\n` +
        `│\n` +
        `│ 🎬 *Title:* ${video.title}\n` +
        `│ 👤 *Channel:* ${video.author.name}\n` +
        `│ ⏱ *Duration:* ${video.timestamp}\n` +
        `│ 👀 *Views:* ${video.views.toLocaleString()}\n` +
        `│ 📅 *Uploaded:* ${video.ago}\n` +
        `│ 🔗 *Link:* ${video.url}\n` +
        `│\n` +
        `╰──────────────────────────⊷\n` +
        `> _*POWERED BY RANU* 🧬`;

      // Thumbnail පෙන්වීම
      await bot.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: mek });

      // Quality මෙනු එක පෙන්වීම (ඔයාගේ index.js logic එකට)
      const qualities = ["360p", "480p", "720p"];
      let menu = `╭───「 *QUALITY SELECTION* 」───⊷\n│\n`;
      qualities.forEach((val, i) => { menu += `│ *${i + 1}* - ${val}\n`; });
      menu += `│\n│ _Reply with the number (1-3)_\n╰──────────────────────────⊷\n> *POWERED BY RANU* 🧬`;

      const msg = await bot.sendMessage(from, { text: menu }, { quoted: mek });

      // Global state එක save කිරීම (index.js එකෙන් download කරන්න)
      global.ytPendingQuality = global.ytPendingQuality || {};
      global.ytPendingQuality[sender] = {
        video: video,
        qualities: qualities
      };

    } catch (e) {
      console.log("YTMP4 ERROR:", e);
      reply("*❌ An error occurred while processing your request.*");
    }
  }
);

cmd(
  {
    pattern: "tiktok",
    alias: ["tt"],
    desc: "Download TikTok video",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*📱 Please send a TikTok video link!*");
      if (!q.includes("tiktok.com")) return reply("*⚠️ Invalid TikTok link!*");

      reply("*⬇️ Downloading TikTok video...*");

      const data = await tiktok(q);
      if (!data?.no_watermark) return reply("*❌ Failed to download video.*");

      const caption = 
        `╭───「 *VEXTER-MD TIKTOK* 」───⊷\n` +
        `│\n` +
        `│ 🎵 *Title:* ${data.title || "TikTok Video"}\n` +
        `│ 👤 *Author:* ${data.author || "Unknown"}\n` +
        `│ ⏱ *Duration:* ${data.runtime}s\n` +
        `│\n` +
        `╰──────────────────────────⊷\n` +
        `> _*POWERED BY RANU* 🧬`;

      await bot.sendMessage(from, { 
        video: { url: data.no_watermark }, 
        caption: caption 
      }, { quoted: mek });

    } catch (e) {
      console.log("TIKTOK ERROR:", e);
      reply("*❌ Error while downloading TikTok video.*");
    }
  }
);

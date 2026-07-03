const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    desc: "Check if the bot is active",
    category: "main",
    react: "🧬",
    filename: __filename
},
async(conn, mek, m, { from, reply, prefix }) => {
    try {
        const uptime = runtime(process.uptime());
        
        // පණිවිඩය වඩාත් ආකර්ෂණීය කිරීමට
        let aliveMsg = `
╭───「 *VEXTER-MD SYSTEM* 」───⊷
│
│ 🧬 *Status:* Online
│ 👤 *Owner:* Dexter
│ ⏳ *Runtime:* ${uptime}
│ 🌐 *Mode:* ${config.workMode || 'Public'}
│ 🛠️ *Prefix:* [ ${prefix} ]
│ 📅 *Date:* ${new Date().toLocaleDateString()}
│
├──────────────────────────⊷
│
│ *VEXTER-MD Multi-Device Bot is fully*
│ *operational and ready to serve.*
│
│ _Stay connected with the future._
╰──────────────────────────⊷
> *Powered By Ranu* 🧬`;

        await conn.sendMessage(from, { 
            image: { url: "https://i.ibb.co/nM0qZzx6/23d08aa6-1288-42a6-b705-a8b1e830487a.png" }, 
            caption: aliveMsg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "🧬 VEXTER-MD IS ACTIVE",
                    body: "Click here for support",
                    mediaType: 1,
                    thumbnailUrl: "https://i.ibb.co/nM0qZzx6/23d08aa6-1288-42a6-b705-a8b1e830487a.png",
                    sourceUrl: "https://wa.me/94783462955"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});

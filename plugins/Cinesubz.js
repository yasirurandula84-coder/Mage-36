const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "inspect",
    desc: "Check Sinhalasub structure",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        const url = `https://sinhalasub.lk/?s=Avatar`; 
        const res = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
        });

        // මුළු HTML එකෙන් අකුරු 30,000ක් විතරක් ගමු (Memory එක බේරගන්න)
        const partialHtml = res.data.substring(0, 40000);

        await conn.sendMessage(from, { 
            document: Buffer.from(partialHtml), 
            fileName: 'sinhalasub_inspect.txt', 
            mimetype: 'text/plain',
            caption: `🔍 Sinhalasub සයිට් එකේ පේජ් එකේ මුල් කොටස මෙන්න. මේක බලලා අපි නියම Class එක අල්ලගමු.`
        }, { quoted: mek });

    } catch (e) {
        reply("Error: " + e.message);
    }
});

const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "inspect",
    desc: "Inspect site structure",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        const url = `https://cinesubz.co/?s=Avatar`; // අපි Avatar සර්ච් කරලා බලමු
        const res = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });

        await conn.sendMessage(from, { 
            document: Buffer.from(res.data), 
            fileName: 'cinesubz_source.txt', 
            mimetype: 'text/plain',
            caption: `මෙන්න සයිට් එකේ ඇතුලේ තියෙන කෝඩ් එක. මේක මට එවන්න.`
        }, { quoted: mek });

    } catch (e) {
        reply("Error: " + e.message);
    }
});

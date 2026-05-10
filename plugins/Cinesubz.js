const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

cmd({
    pattern: "debugsite",
    desc: "Check site structure safely",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        const url = `https://cinesubz.co/?s=Avatar`;
        const res = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
        });

        const $ = cheerio.load(res.data);
        let debugInfo = "*🔍 Site Debug Results:*\n\n";

        // පේජ් එකේ තියෙන පළමු ලින්ක් 5 සහ ඒවායේ classes බලමු
        $('a').slice(0, 15).each((i, el) => {
            const link = $(el).attr('href');
            const parentClass = $(el).parent().attr('class') || "No Class";
            const text = $(el).text().trim().substring(0, 20);

            if (link && link.includes('/movies/')) {
                debugInfo += `🔹 *Text:* ${text}\n`;
                debugInfo += `🔹 *Parent Class:* ${parentClass}\n`;
                debugInfo += `🔹 *Link:* ${link}\n\n`;
            }
        });

        if (debugInfo === "*🔍 Site Debug Results:*\n\n") {
            debugInfo += "කිසිදු ලින්ක් එකක් හමු වූයේ නැත. සයිට් එක බ්ලොක් කරලා ඇති.";
        }

        await reply(debugInfo);

    } catch (e) {
        reply("Error: " + e.message);
    }
});

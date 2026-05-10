const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "cinesub",
    alias: ["movie","cs"],
    desc: "Search and get movie links from Cinesubz",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න! (Example: .cinesub Avatar)");

        // 1. Search Section
        const searchUrl = `https://cinesubz.co/?s=${encodeURIComponent(q)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        
        let movies = [];
        $('.result-item').each((i, el) => {
            const title = $(el).find('.title a').text();
            const link = $(el).find('.title a').attr('href');
            if (title && link) {
                movies.push({ title, link });
            }
        });

        if (movies.length === 0) return reply("කණගාටුයි, ඔබ සෙවූ චිත්‍රපටය හමු වූයේ නැත.");

        // පළමු ප්‍රතිඵලය පෙන්වීම (මෙහිදී ඔබට කැමති නම් ලැයිස්තුවක් පෙන්විය හැක)
        let msg = `🎬 *CINESUBZ MOVIE SEARCH* 🎬\n\n`;
        movies.forEach((mov, index) => {
            msg += `${index + 1}. ${mov.title}\n🔗 ${mov.link}\n\n`;
        });

        msg += `පිටපත් ලබා ගැනීමට link එක පාවිච්චි කරන්න.`;
        return reply(msg);

    } catch (e) {
        console.log(e);
        reply("Error: " + e.message);
    }
});

const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

cmd({
    pattern: "movie",
    alias: ["cinesub", "dlmovie"],
    desc: "Download movies from Cinesubz",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න! 🎬");

        await reply("🔎 *VEXTER-MD* සෙවුම් කරමින් පවතී...");

        // Browser එකකින් යනවා වගේ පෙන්වීමට Headers එකතු කිරීම
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        const searchUrl = `https://cinesubz.co/?s=${encodeURIComponent(q)}`;
        const response = await axios.get(searchUrl, { headers });
        const $ = cheerio.load(response.data);
        
        // අලුත්ම Cinesubz structure එකට අනුව සෙවීම
        let movieLink = "";
        let movieTitle = "";

        $('article').each((i, el) => {
            const title = $(el).find('h2.entry-title a').text() || $(el).find('.title a').text();
            const link = $(el).find('h2.entry-title a').attr('href') || $(el).find('.title a').attr('href');
            
            if (link) {
                movieLink = link;
                movieTitle = title;
                return false; // පළමු එක හමු වූ පසු නතර කරන්න
            }
        });

        if (!movieLink) return reply("❌ කණගාටුයි, චිත්‍රපටය හමු වූයේ නැත. කරුණාකර නම නිවැරදිදැයි පරීක්ෂා කරන්න.");

        // 2. Movie Page එකට ගොස් විස්තර ගැනීම
        const moviePage = await axios.get(movieLink, { headers });
        const $$ = cheerio.load(moviePage.data);
        
        await reply(`🎬 *Movie Found:* ${movieTitle}\n\nපිටපත සකසමින් පවතී...`);

        // Pixeldrain ලින්ක් එක සෙවීමේ වඩාත් සාර්ථක ක්‍රමයක්
        let downloadLink = "";
        $$('a').each((i, el) => {
            const href = $$(el).attr('href');
            if (href && href.includes('pixeldrain.com/u/')) {
                downloadLink = href.replace('/u/', '/api/file/');
                return false;
            }
        });

        if (!downloadLink) {
            return reply(`සමාවෙන්න, Direct Download Link එකක් හමු වුණේ නැහැ. මෙන්න පිටුව: ${movieLink}`);
        }

        // 3. File එක එවීමට උත්සාහ කිරීම
        await conn.sendMessage(from, { 
            document: { url: downloadLink }, 
            fileName: `${movieTitle}.mp4`, 
            mimetype: 'video/mp4',
            caption: `🎬 *${movieTitle}*\n\n*VEXTER-MD MOVIE DOWNLOADER*`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error: " + e.message);
    }
});

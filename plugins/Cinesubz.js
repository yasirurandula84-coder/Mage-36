const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

cmd({
    pattern: "movie",
    alias: ["cinesub", "dlmovie"],
    desc: "Download movies from Cinesubz as a file",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න! 🎬");

        await reply("🔎 සෙවුම් කරමින් පවතී... කරුණාකර රැඳී සිටින්න.");

        // 1. Search Section
        const searchUrl = `https://cinesubz.co/?s=${encodeURIComponent(q)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        
        const movieLink = $('.result-item').first().find('.title a').attr('href');
        const movieTitle = $('.result-item').first().find('.title a').text();

        if (!movieLink) return reply("කණගාටුයි, චිත්‍රපටය හමු වූයේ නැත.");

        // 2. Scrape Movie Page for Download Links
        const moviePage = await axios.get(movieLink);
        const $$ = cheerio.load(moviePage.data);
        
        // සාමාන්‍යයෙන් Cinesubz වල Pixeldrain හෝ Direct ලින්ක් එකක් තියෙන තැන බලන්න
        // දැනට මම මේ ලොජික් එක දාන්නේ Pixeldrain ලින්ක් එකක් හමු වුණොත් ඒක ගන්න
        let downloadLink = "";
        $$('a').each((i, el) => {
            const href = $$(el).attr('href');
            if (href && href.includes('pixeldrain.com/u/')) {
                downloadLink = href.replace('/u/', '/api/file/'); // Direct Download API Link එකට හැරවීම
            }
        });

        if (!downloadLink) {
            return reply(`සමාවෙන්න, Direct Link එකක් හමු වුණේ නැහැ. මෙන්න පිටුව: ${movieLink}`);
        }

        await reply(`📥 *${movieTitle}* සොයාගත්තා. දැන් File එක එවීමට සූදානම් වෙනවා...`);

        // 3. Send as Document (File)
        await conn.sendMessage(from, { 
            document: { url: downloadLink }, 
            fileName: `${movieTitle}.mp4`, 
            mimetype: 'video/mp4',
            caption: `🎬 *${movieTitle}*\n\nPowered by VEXTER-MD`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});

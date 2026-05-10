const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "checksite",
    desc: "Check website structure",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {
        const url = `https://cinesubz.co/?s=${encodeURIComponent(q || 'Avatar')}`;
        const res = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
        });

        // HTML එක ඇතුළේ තියෙන වැදගත් Classes කිහිපයක් Search කරනවා
        const html = res.data;
        let info = "🔍 *Site Analysis:*\n\n";
        
        if (html.includes('result-item')) info += "✅ Found: result-item\n";
        if (html.includes('entry-title')) info += "✅ Found: entry-title\n";
        if (html.includes('article')) info += "✅ Found: article\n";
        if (html.includes('post-title')) info += "✅ Found: post-title\n";

        // HTML එකෙන් කෑල්ලක් එවන්න (අපිට බලන්න)
        const snippet = html.substring(html.indexOf('<body'), html.indexOf('<body') + 1000);
        
        await reply(info + "\n*Snippet:*\n" + "```" + snippet + "
```");

    } catch (e) {
        reply("Error: " + e.message);
    }
});

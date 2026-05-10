const { cmd } = require("../command");
const Settings = require("../lib/settings");
const config = require("../config");

// පැනල් එක පෙන්වන කමාන්ඩ් එක
cmd({
    pattern: "settings",
    alias: ["panel", "set"],
    desc: "VEXTER-MD Advanced Setting Panel",
    category: "owner",
    filename: __filename,
},
async (danuwa, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ *Access Denied:* Owner only.");

    const panelMsg = `*「 SETTING PANEL 」*

*🔢 Reply below number*

*\`[1] MODE\`*
*⚙️ 1.1* ❯❯◦ *PUBLIC* 
*⚙️ 1.2* ❯❯◦ *PRIVATE* 
*⚙️ 1.3* ❯❯◦ *GROUPS* 
*⚙️ 1.4* ❯❯◦ *INBOX* 

*\`[2] AUTO READ STATUS\`*
*⚙️ 2.1* ❯❯◦ *True*
*⚙️ 2.2* ❯❯◦ *False*

*\`[3] ALLWAYS ONLINE\`*
*⚙️ 3.1* ❯❯◦ *Online*
*⚙️ 3.2* ❯❯◦ *Offline*

*\`[4] READ COMMAND\`*
*⚙️ 4.1* ❯❯◦ *True*
*⚙️ 4.2* ❯❯◦ *False*

*\`[5] TYPING & RECORDING\`*
*⚙️ 5.1* ❯❯◦ *Recording*
*⚙️ 5.2* ❯❯◦ *Typing*
*⚙️ 5.3* ❯❯◦ *OFF*

*\`[6] AUTO STATUS REACT\`*
*⚙️ 6.1* ❯❯◦ *True*
*⚙️ 6.2* ❯❯◦ *False*

*\`[7] ANTI DELETE\`*
*⚙️ 7.1* ❯❯◦ *Only Inbox*
*⚙️ 7.2* ❯❯◦ *Only Group*
*⚙️ 7.3* ❯❯◦ *Both*
*⚙️ 7.4* ❯❯◦ *False*

*Example:* Reply with *3.2* to change mode.`;

    return reply(panelMsg);
});

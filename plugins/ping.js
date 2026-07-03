const { cmd } = require("../command");

cmd(
  {
    pattern: "ping",
    react: "🏓",
    desc: "Bot response speed test",
    category: "main",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, reply }) => {
    const start = Date.now();
    
    // මුලින්ම පණිවිඩය යවලා ඒකේ key එක ගන්නවා
    const sentMsg = await reply("🏓 Pinging...");
    
    const end = Date.now();
    const speed = end - start;

    // දැන් අර යවපු message එක Edit කරනවා
    await danuwa.sendMessage(from, { 
        text: `🏓 Pong! \n\n*Response speed:* ${speed}ms`,
        edit: sentMsg.key 
    });
  }
);

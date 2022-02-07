require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client({partials:["MESSAGE"]});

client.on("ready",async ()=>{
    console.log("Connected as", client.user.username)
})

client.on("message",async(msg)=>{
    if(!msg.content.startsWith("-spoiler")) return;
    if(msg.attachments.size < 1){
        await msg.react("⚠")
        await msg.react("🖼")
        return 
    }
    if(!msg.guild.me.permissionsIn(msg.channel).has("MANAGE_MESSAGES")){
        await msg.react("⚠")
        await msg.react("🗑")
        return
    }
    let attachments = []
    msg.attachments.forEach(attachment => {
        let atc = new Discord.MessageAttachment(attachment.url, "SPOILER_"+attachment.name)
        attachments.push(atc)
    });
    await sleep(500)
    if(msg.deleted)return
    await msg.channel.send(`<@!${msg.author.id}> spoilered an image${msg.cleanContent.substring(8).length ?" with the text: " + msg.cleanContent.substring(8):":"}`,{files:attachments, disableEveryone:!(msg.member.hasPermission("MENTION_EVERYONE"))})
    msg.delete().catch((reason)=>{console.log(reason)})
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

client.login(process.env.TOKEN)

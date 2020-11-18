// let logMessage = `[${time}] 🗑 Proxied Message by ${proxyName} (system: \`${systemID}\`, member: \`${memberID}\` account: ${accountName} (\`${accountID}\`)) in ${channel} has been removed.
// **Content:** ${content}`
require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client({partials:["MESSAGE"]});
const fetch = require("node-fetch")

client.on("ready",()=>{
    console.log("Connected")
})
// --Unneeded--
// client.on("message",()=>{
//     //this is a workaroudn for an api bug, if a message doesnt get checked before it is deleted, then it will appear as "no message found" in the api. due to this bot only running on a minmal amount of servers, essentally it can not detect messages sent while offline but deleted while online
//     fetch("https://api.pluralkit.me/v1/msg/"+message.id)
// })
client.on("messageDelete", async (message)=>{
    // console.log(message);
    let logChannel = await client.channels.fetch(process.env.CHANNEL).catch(()=>{console.error("⚠ Cannot Fetch Log Channel");});
    if(!logChannel) return
    if(!logChannel.permissionsFor(client.user).has("SEND_MESSAGES")) return console.log("⚠ Missing send messages permission in log channel!")

    // console.log("a")

    // console.log(message.id.toString())

    let pkMessage = await fetch("https://api.pluralkit.me/v1/msg/"+message.id).then(b=>{
        // console.log(b)
        if(!b.ok) return null
        return b.json()
    })
    if(pkMessage == null) return;
    if(message.id == pkMessage.original) return;
    // console.log(pkMessage)
    // console.log(message.id == pkMessage.original)
    // console.log(pkMessage);


    let time = new Date().toLocaleTimeString('en-US',{hour12: false, hour: '2-digit', minute: '2-digit', timeZone: process.env.TIMEZONE})
    let systemID = pkMessage.system.id
    let memberID = pkMessage.member.id
    let sender = await client.users.fetch(pkMessage.sender)
    let accountName = sender.tag
    let accountID = pkMessage.sender
    let channel = message.channel.toString()
    let content = message.cleanContent

    let logMessage = `[${time}] 🗑 Proxied Message by ${accountName} (\`${accountID}\`)\n(system: \`${systemID}\`, member: \`${memberID}\` member: ${pkMessage.member.name} )\nin ${channel} has been removed.\n**Content:** ${content}`

    console.log("Proxy Message Deleted")

    logChannel.send(logMessage, {disableMentions: "all"}).catch(console.error)
})

client.login(process.env.TOKEN)
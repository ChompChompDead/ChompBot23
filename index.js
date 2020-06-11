const {Collection, Client, Discord} = require("discord.js");
const fs = require("fs")
const bot = new Client({
    disableEveryone: true
});
const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;
bot.prefix = "c!"
bot.commands = new Collection();
bot.aliases = new Collection();
bot.catergories = fs.readdirSync("./commands/");
["command"].forEach(handler =>{
    require(`./handlers/${handler}`)(bot);
})
bot.on('ready', () => {
    bot.user.setActivity(`Version 0.1 | ${prefix}help`, {type: 'WATCHING'})
    console.log(`${bot.user.username} is now online!`)
});
bot.on('message', async message=>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    const command = bot.commands.get(cmd)
    if(!command) command = bot.commands.get(bot.aliases.get(cmd));
    if(command) command.run(bot,message,args)
})

bot.login(process.env.token)

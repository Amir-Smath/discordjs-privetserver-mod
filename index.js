const LIB = require('discord.js')
const config = require('./Main-configs.json')
const client = new LIB.Client({ intents: '32767' })

client.login(config.token)

process.on("unhandledRejection", console.error);

client.on('ready', () => {
    var { joinVoiceChannel } = require('@discordjs/voice');

    console.log(`Connecting as ${client.user.tag}`)
setInterval(() => {
    client.user.setPresence({
        status: 'dnd',
        activities: [{
            type: 'WATCHING',
            name: `${config.guildname}`,
        }]
    });
//─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 
    client.channels.fetch(config.voiceconnect).then((channel) => {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
    });
}, 20000);
})

client.on('guildMemberAdd', member => {
    const iu = member.guild.channels.cache.get(config.welcomechannel);
    var embed = new LIB.MessageEmbed()
    .setAuthor(iu.guild.name, iu.guild.iconURL())
    .setColor('AQUA')
    .setThumbnail(member.user.displayAvatarURL())
    .setTitle(iu.guild.name + " Server")
    .setImage('https://cdn.discordapp.com/attachments/984511428130127953/1038488665858519070/welcome.jpg')
    .setDescription(`👋Hi ${member.user.username} Welcome To ${iu.guild.name} i hope you have a good time on our server`)
    iu.send({ content: `<@${message.author.id}>`, embeds: [embed] })
})

client.on('messageCreate', async message => {
    let MessageArry = message.content.split(" ")
    let command = MessageArry[0]

    if(command == config.prefix + 'verify'||command == config.prefix + 'v'){
        let member = message.mentions.members.first() ;
        config.adminrole.forEach(adrole => {
            if (message.member.roles.cache.some(role => role.id === adrole)) {
                if (!member) return message.reply('MENTION USER')
                member.roles.remove(config.notverify)
                member.roles.add(config.memberole)
                message.reply(`${member} WAS VERIFYED`)
                let embed = new LIB.MessageEmbed()
                .setColor('AQUA')
                .setThumbnail(member.displayAvatarURL())
                .setFooter(`VERIFYED BY ${message.author.username}`, message.author.displayAvatarURL())
                .setTimestamp()
                .setTitle('VERIFYED LOGS SYSTEM')
                .setDescription(`${member} WAS VERIFYED BY <@${message.author.id}>`)
                message.guild.channels.cache.get(config.verifylog).send({ embeds: [embed] })
            } else {
                return message.react('❌') ;
            }
        })
    }

    if(command == config.prefix + 'ban'||command == config.prefix + 'b'){
        let member = message.mentions.members.first() ;
        let reason = message.content.split(' ').slice(2).join(' ') ;
        config.adminrole.forEach(adrole => {
            if (message.member.roles.cache.some(role => role.id === adrole)) {
                if (!member) return message.reply('MENTION USER') ;
                if(member.id === message.guild.ownerId) return message.reply('YOU CAN NOT BAN OWNER') ;
                if(!reason) return message.reply('BAN REASON') ;
                message.guild.members.ban(member.id, { reason: `BANNED BY ${message.author.username}` }).then(a => {
                    message.reply(`${member} WAS BANNED`)
                    let embed = new LIB.MessageEmbed()
                    .setColor('AQUA')
                    .setThumbnail(member.displayAvatarURL())
                    .setFooter(`BANNED BY ${message.author.username}`, message.author.displayAvatarURL())
                    .setTimestamp()
                    .setTitle('BAN LOGS SYSTEM')
                    .setDescription(`${member} WAS BANNED BY <@${message.author.id}>
REASON: ${reason}`)
                    message.guild.channels.cache.get(config.banlog).send({ embeds: [embed] })
                })
            } else {
                return message.react('❌') ;
            }
        })
    }
})


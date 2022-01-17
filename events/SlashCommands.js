const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = require('../index');
const {
    EveryoneRoleId,
    CategoryId,
    StaffRoleId,
    TranscriptCID
} = require('../ticket.json');
const { createTranscript } = require('discord-html-transcripts');
 
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        let cmd = client.slash_commands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({
            content: 'This command no longer exists'
        }) && client.slash_commands.delete(interaction.commandName)

        await interaction.deferReply().catch(e => {});
        let options = []
        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) options.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) options.push(x.value);
                });
            } else if (option.value) options.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, options)
    }

    // Button Handling
    if (interaction.isButton()) {
        await interaction.deferUpdate()
        if (interaction.customId === "ticket-open") {
            if (interaction.guild.channels.cache.find(e => e.topic == interaction.user.id)) { // Checking if the user has already have a open ticket
                return interaction.followUp({
                    content: 'You already have a ticket open',
                    ephemeral: true
                })
            }

            const c = interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                parent: CategoryId,
                topic: interaction.user.id,
                permissionOverwrites: [{
                    id: interaction.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                }, {
                    id: client.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                }, {
                    id: StaffRoleId,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                }, {
                    id: EveryoneRoleId,
                    deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    },],
                type: 'GUILD_TEXT'
            }).then(async c => {
                interaction.followUp({ content: `Ticket Created! <${c.id}>`, ephemeral: true });
                
                const newtic = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription('New Ticket!')
                
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ticket-close')
                            .setLabel('Close Ticket')
                            .setEmoji('🔒')
                        .setStyle('DANGER') // Red color button
                )

                c.send({
                    content: `<@${interaction.user.id}>, <@&${StaffRoleId}>`, // gotta add & since its  a role
                    embeds: [newtic],
                    components: [row]
                }).then((msg) => msg.pin()) // to pin the message
            })
            
            
        } else if (interaction.customId === "ticket-close") {
            interaction.channel.send({content: 'cloding ticket pls wait'})
            if (((interaction.channel.topic === interaction.user.id)) === interaction.user.id && StaffRoleId !== interaction.user.id) {
                return interaction.followUp({
                    content: 'Only staff can close tickets',
                    ephemeral: true
                })
            }
            const user = await client.users.fetch(interaction.channel.topic);
            const transcript = await createTranscript(interaction.channel, {
                limit: -1,
                fileName: `ticket-${interaction.channel.topic}.html`, // remember to put .html
                returnBuffer: false
            });

            const embedclosedtic = new MessageEmbed()
                .setColor('RED')
                .setDescription('Ticket has been closed')
            // You can add more info in this embed :) like username, user who closed and all that..

            client.channels.cache.get(TranscriptCID).send({
                embeds: [embedclosedtic],
                files: [transcript]
            }).then(() => {
                interaction.channel.delete()
            })
        }
    }
}) // now we will make a add user and remove user command.. 
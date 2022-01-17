const {
    MessageButton,
    MessageActionRow,
    CommandInteraction,
    MessageEmbed,
} = require('discord.js');
const {
    EveryoneRoleId,
    CategoryId,
    StaffRoleId,
    TranscriptCID
} = require('../../ticket.json');
const {
    required
} = require('nodemon/lib/config');

module.exports = {
    name: "ticket",
    description: "Ticket system!",
    options: [{
        name: 'add',
        type: 'SUB_COMMAND',
        description: 'add a user to the ticket',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user to add to the ticket',
            required: true
        }]
    }, {
        name: 'remove',
        type: 'SUB_COMMAND',
        description: 'remove a user from the ticket',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user to remove from the ticket',
            required: true
        }]
    }, ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String} args 
     * @returns 
     */
    run: async (client, interaction, args) => {

        if (!interaction.member.roles.cache.find(r => r.id === '852540642181382194')) {
            return interaction.followUp({
                content: 'Only staff can do this'
            })
        }

        const [SubCommand] = args;
        const c = interaction.channel
        if (SubCommand === 'add') {
            
            const user = interaction.options.getUser('user');
            if (c.name.includes('ticket')) {
                c.edit({
                    permissionOverwrites: [{
                        id: interaction.channel.topic,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: client.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: user,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: StaffRoleId,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: EveryoneRoleId,
                        deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, ],
                }).then(() => {
                    interaction.followUp(`${user.id} has been added`)
                })
            } else {
                interaction.followUp('Your not in  a ticket')
            }
        } else if  (SubCommand === 'remove') {
            const user = interaction.options.getUser('user');
            if (c.name.includes('ticket')) {
                c.edit({
                    permissionOverwrites: [{
                        id: interaction.channel.topic,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: client.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: user,
                        deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: StaffRoleId,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, {
                        id: EveryoneRoleId,
                        deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    }, ],
                }).then(() => {
                    interaction.followUp(`${user.id} has been removed`)
                })
            } else {
                interaction.followUp('Your not in  a ticket')
            }
        }

    }
}
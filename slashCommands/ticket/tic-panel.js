// i have already coded the ticket system and posted it on my server so join my server and go to js codes

const {
    Client,
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Interaction
} = require('discord.js');

module.exports = {
    name: 'ticket-panel',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args, Discord) => {
        // You can add some user permissions so that only that person can run this command, im not doing it since its for a demo here
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Ticket')
            .setDescription('Click 🎟️ to open a ticket')

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('ticket-open')
                .setEmoji('🎟️')
                .setLabel('Open a Ticket')
                .setStyle('PRIMARY') // Blue Color Button
            )

        interaction.followUp({
            embeds: [embed],
            components: [row]
        })
    }
}
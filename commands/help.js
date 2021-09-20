const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'List all available commands.',
    execute(interaction) {

        let str = '';
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        const embed = new MessageEmbed()
            .setColor("#ffcc00")
            .setTitle("Thanks for using bops!")
            .setDescription("Here are all the commands you can use:")
            .addFields(
                commandFiles.filter(file => {
                    return !(require("./" + file).hidden);
                }).map(file => {
                    const command = require(`./${file}`);
                    return { name: `${command.name}`, value: `${command.description}`, inline: true };
                })
            )
            .setTimestamp();

        return void interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
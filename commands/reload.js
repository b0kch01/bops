const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'reload',
    description: 'Reload a command!',
    hidden: true,
    options: [
        {
            name: 'command',
            type: 3, //'STRING' Type
            description: 'command name',
            required: true,
        },
    ],
    execute(interaction, client) {
        try {
            const commandName = interaction.options.get("command").value;

            delete require.cache[
                require.resolve(`./${commandName}.js`)
            ];

            const newCommand = require("./" + commandName);

            client.commands.set(commandName, newCommand);

            interaction.member.guild.commands.set(client.commands).then(() => {
                const embed = new MessageEmbed()
                    .setColor("#34c759")
                    .setTitle("Successful!")
                    .setDescription("Reloaded " + newCommand.name + " and is now ready")
                    .setTimestamp();

                return void interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            });
        } catch (error) {
            const embed = new MessageEmbed()
                .setColor("#ff2d55")
                .setTitle("Unsuccesful")
                .setDescription("```\n" + error + "\n```")
                .setTimestamp();

            return void interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
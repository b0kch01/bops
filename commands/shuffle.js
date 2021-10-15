const { GuildMember } = require('discord.js');
const { displayQueue } = require("../util/songutil");

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the queue!',
    async execute(interaction, player) {
        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            return void interaction.reply({
                content: 'You are not in a voice channel!',
                ephemeral: true,
            });
        }

        if (
            interaction.guild.me.voice.channelId &&
            interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
        ) {
            return void interaction.reply({
                content: 'You are not in my voice channel!',
                ephemeral: true,
            });
        }

        const queue = player.getQueue(interaction.guildId);

        if (!queue) {
            return void interaction.followUp({
                embeds: [
                    {
                        title: 'There is nothing playing!',
                        description: "Use `/play` to add songs to the queue!",
                        color: "#ffcc00"
                    }
                ]
            });
        }

        await queue.shuffle();
        displayQueue(queue, interaction, "Enjoy your shuffled queue!");

    },
};

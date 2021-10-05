const { GuildMember } = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Stop all songs in the queue!',
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

        await interaction.deferReply();

        const queue = player.getQueue(interaction.guildId);

        if (!queue)
            return void interaction.followUp({
                embeds: [
                    {
                        title: 'There is nothing to stop!',
                        description: "Use `/play` to add songs to the queue!",
                        color: "#ffcc00"
                    }
                ]
            });

        queue.destroy();
        interaction.followUp("Stopped the player!");
    },
};

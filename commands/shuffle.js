const { GuildMember } = require('discord.js');

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

        await interaction.deferReply();

        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return void interaction.reply({
                embeds: [
                    {
                        title: 'There is nothing playing!',
                        description: "Use `/play` to add songs to the queue!",
                        color: "#ffcc00"
                    }
                ]
            });
        }

        const success = queue.shuffle();

        return void interaction.reply({
            embeds: [
                {
                    title: 'Shuffled Queue!',
                    description: "Enjoy your new mix!",
                    color: "#34c759"
                }
            ]
        });
    },
};

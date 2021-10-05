const { GuildMember } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip a song!',
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
        const currentTrack = queue.current;
        const success = queue.skip();

        if (success)
            return void interaction.followUp({
                embeds: [
                    {
                        title: `Skipped **${currentTrack}**`,
                        color: "#ffcc00"
                    }
                ]
            });

        return void interaction.followUp({
            embeds: [
                {
                    title: `Failed to skip song...`,
                    color: "#ff2d55"
                }
            ]
        });
    },
};

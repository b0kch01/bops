const { GuildMember } = require('discord.js');

module.exports = {
    name: 'remove',
    description: 'Remove a song from queue.',
    options: [
        {
            name: 'track',
            type: 4, // 'INTEGER' Type
            description: 'Track # to remove',
            required: true,
        },
    ],
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
        else {

            await interaction.deferReply();

            const queue = player.getQueue(interaction.guildId);

            if (queue) {


                const trackIndex = interaction.options.get("track").value - 1;

                console.log(trackIndex, queue.tracks);

                const track = queue.tracks[trackIndex];
                if (track?.title && track?.url) {
                    queue.remove(trackIndex);

                    return void interaction.editReply({
                        embeds: [
                            {
                                title: `Removed Track`,
                                description: `❌ [${track.title}](${track.url}) was removed from queue.`,
                                color: "#34c759"
                            }
                        ]
                    });
                } else {
                    return void interaction.editReply({
                        embeds: [
                            {
                                title: `Track does not exist!`,
                                description: `Track was not in queue.`,
                                color: "#ffcc00"
                            }
                        ]
                    });
                }
            } else {
                return void interaction.editReply({
                    embeds: [
                        {
                            title: 'There is nothing playing!',
                            description: "Use `/play` to add songs to the queue!",
                            color: "#ffcc00"
                        }
                    ]
                });
            }
        }
    }
};
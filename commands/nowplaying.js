const { GuildMember } = require('discord.js');
const { capitalize } = require('../util/songutil.js');

module.exports = {
    name: 'nowplaying',
    description: 'Get the song that is currently playing.',
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
        if (!queue || !queue.playing)
            return void interaction.followUp({
                embeds: [
                    {
                        title: 'There is nothing playing!',
                        description: "Use `/play` to add songs to the queue!",
                        color: "#ffcc00"
                    }
                ]
            });


        let i = 0;
        const interval = setInterval(() => {
            if (i++ > 5 || !queue?.current) {
                return clearInterval(interval);
            }

            interaction.editReply({
                embeds: [
                    {
                        title: queue.current.title,
                        description: queue.createProgressBar(),
                        fields: [
                            {
                                name: "Requested by",
                                value: `${queue.current.requestedBy}`,
                                inline: true
                            },
                            {
                                name: 'Artist',
                                value: `\`${queue.current.author}\``,
                                inline: true
                            },
                            {
                                name: capitalize(queue.current.source),
                                value: `[Share song](${queue.current.url})`,
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: queue.current.thumbnail,
                        },
                        color: 0xfcfcfc,
                    },
                ],
            });
        }, 1000);
    },
};

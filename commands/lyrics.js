const { GuildMember } = require('discord.js');
const { Lyrics } = require("@discord-player/extractor");
const { shortenQueueTitle, fixLyrics } = require("../util/songutil");

const lyricsClient = Lyrics.init();

module.exports = {
    name: 'lyrics',
    description: 'Get lyrics to the current song.',
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

        let title = shortenQueueTitle(queue.current.title)
            .replaceAll("ft.", "")
            // remove characters between parentheses
            .replaceAll(/\([^)]*\)/g, "");

        console.log(title);
        lyricsClient.search(title)
            .then(lyrics => {
                console.log(lyrics);
                interaction.editReply({
                    embeds: [
                        {
                            title: lyrics.title,
                            description: fixLyrics(lyrics.lyrics),
                            color: "#34c759",
                            thumbnail: {
                                url: lyrics.thumbnail
                            }
                        },
                    ],
                });
            })
            .catch(error => {
                console.error(error);
                interaction.followUp({
                    content: '❌ There was an error trying to execute that command: ' + `\`\`\`${error.message}\`\`\``,
                });
            });
    },
};

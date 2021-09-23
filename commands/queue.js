const { GuildMember } = require('discord.js');

function shortenQueueTitle(title) {
    return title
        .replace("(Official)", "")
        .replace("(Official Video)", "")
        .replace("(Official Music Video)", "")
        .replace("(Official Audio)", "")
        .replace("[Official Video]", "")
        .replace("[Official Music Video]", "")
        .replace("(Official Lyrics Video)", "")
        .replace("(Official Lyrics)", "")
        .replace("(Lyrics)", "")
        .replace("(Audio)", "");
}

module.exports = {
    name: 'queue',
    description: 'View the queue of current songs!',

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
            const queue = player.getQueue(interaction.guildId);

            if (queue) {
                let queueString = '──┬────\n';

                if (queue.tracks.length != 0) {
                    queue.tracks.slice(0, 9).forEach((track, index) => {
                        queueString += `\`${index + 1}.\` │ [${shortenQueueTitle(track.title)}](${track.url}) \`${track.duration}\`\n`;
                    });
                } else {
                    queueString = "The queue is empty! Use `/play` to queue more songs!";
                }

                const seconds = (
                    queue.current.durationMS +
                    queue.tracks
                        .map(s => { return s.durationMS; })
                        .reduce((a, b) => a + b, 0)
                ) / 1000;

                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds - hours * 3600) / 60);
                const remainingSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);

                let queueTimeText = "";
                if (hours > 0) {
                    queueTimeText = `${hours} hours, ${minutes} minutes`;
                } else {
                    queueTimeText = `${minutes} minutes, ${remainingSeconds} seconds`;
                }

                return void interaction.reply({
                    embeds: [
                        {
                            title: 'Now Playing',
                            description: `**ᐅ** *[${queue?.current?.title || "---"}](${queue?.current?.url || "https://youtube.com"})*`,
                            color: "#34c759",
                            fields: [
                                {
                                    name: "Playing Next",
                                    value: queueString,
                                    inline: false
                                },
                                {
                                    name: "Total Queued:",
                                    value: `${queue.tracks.length} songs`,
                                    inline: true
                                },
                                {
                                    name: "Listening Time:",
                                    value: queueTimeText,
                                    inline: true
                                }
                            ],
                            footer: {
                                text: `🌹 Those are the vibes ~`,
                            }
                        }
                    ]
                });
            } else {
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
        }
    }
};
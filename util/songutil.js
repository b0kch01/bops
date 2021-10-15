const that = module.exports = {
    shortenQueueTitle: function (title) {
        return title
            .replaceAll("(Official)", "")
            .replaceAll("(Official Video)", "")
            .replaceAll("(Official Music Video)", "")
            .replaceAll("(Official Audio)", "")
            .replaceAll("[Official Video]", "")
            .replaceAll("[Official Music Video]", "")
            .replaceAll("(Official Lyrics Video)", "")
            .replaceAll("(Official Lyrics)", "")
            .replaceAll("(Lyrics)", "")
            .replaceAll("(Audio)", "")
            .replaceAll(" - Radio Edit", "");
    },
    fixLyrics: function (lyrics) {
        return lyrics
            .replaceAll("[", "**")
            .replaceAll("]", "**");
    },
    capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    displayQueue: function (queue, interaction, title) {
        if (queue && queue.current) {
            let queueString = '──┬────\n';

            if (queue.tracks.length != 0) {
                queue.tracks.slice(0, 9).forEach((track, index) => {
                    queueString += `\`${index + 1}.\` │ [${that.shortenQueueTitle(track.title)}](${track.url}) \`${track.duration}\`\n`;
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
                        title: title || 'Now Playing',
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
                        fields: [
                            {
                                name: "Wait... didn't I just play a song?",
                                value: "Yes. And I stopped it because I'm a menace (and mostly very buggy). Just `/stop` me and play me again! Might want to stick to ProBot XD"
                            }
                        ],
                        color: "#ffcc00"
                    }
                ]
            });
        }
    }
};
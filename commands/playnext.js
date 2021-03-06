const { GuildMember, MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'playnext',
    description: 'Play a song next! (Skip the wait)',
    options: [
        {
            name: 'song',
            type: 3, // 'STRING' Type
            description: 'What you want to play',
            required: true,
        },
    ],
    async execute(interaction, player) {
        try {
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

            const query = interaction.options.get('song').value;
            const searchResult = await player
                .search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                })
                .catch(() => { });

            if (!searchResult || !searchResult.tracks.length)
                return void interaction.followUp({ content: 'No results were found!' });

            const queue = await player.createQueue(interaction.guild, {
                metadata: interaction.channel,
                leaveOnEmpty: false,
                leaveOnEnd: false,
                leaveOnEmptyCooldown: 5000
            });

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                void player.deleteQueue(interaction.guildId);
                return void interaction.followUp({
                    content: '??? Could not join your voice channel!',
                });
            }

            queue.insert(searchResult.tracks[0]);

            if (!queue.playing) await queue.play();

            return await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`${searchResult.tracks[0].requestedBy.username} asked for:`)
                        .setDescription(`${searchResult.tracks[0].title}`)
                        .setThumbnail(searchResult.tracks[0].thumbnail)
                ]
            });
        } catch (error) {
            console.error(error);
            interaction.followUp({
                content: '??? There was an error trying to execute that command: ' + `\`\`\`${error.message}\`\`\``,
            });
        }
    },
};

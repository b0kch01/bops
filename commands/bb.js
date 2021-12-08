const { GuildMember } = require('discord.js');

module.exports = {
    name: 'bb',
    description: '(๑•̀ㅂ•́)و✧ Bass boosted bb!!',

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

            let filtersOn = queue.getFiltersEnabled();
            let syncOnOff = !(filtersOn.includes("bassboost_low") || filtersOn.includes("normalizer2"));

            await queue.setFilters({
                "bassboost_low": syncOnOff,
                "normalizer2": syncOnOff
            });

            setTimeout(() => {
                let filters = queue.getFiltersEnabled().join("\n");
                if (filters.length < 0) filters = "*None*";

                return void interaction.followUp({
                    embeds: [
                        {
                            title: 'BB Mode: **Enabled**',
                            description: "*You may have to wait ~10 seconds for it to hit*```🥺 Can you feel the bass?```\n**Filters Applying:**\n" + filters,
                            color: "#ffb57d"
                        }
                    ]
                });
            }, queue.options.bufferingTimeout);
        }
    }
};
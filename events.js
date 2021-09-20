const Discord = require("discord.js");

module.exports.createEvents = (client, player) => {
    player.on('error', (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });

    player.on('connectionError', (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    player.on('trackStart', (queue, track) => {
        const embed = new Discord.MessageEmbed()
            .setColor("#34c759")
            .setTitle(`${track.title} now playing!`)
            .setDescription(track.url)
            .addFields(
                {
                    name: "Requested by",
                    value: `${track.requestedBy}`,
                    inline: true
                },
                {
                    name: 'Duration',
                    value: `\`${track.duration}\``,
                    inline: true
                },
                {
                    name: 'Views',
                    value: `\`${track.views}\``,
                    inline: true
                }
            );

        queue.metadata.send({
            embeds: [embed]
        });
    });

    player.on('botDisconnect', queue => {
        queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
    });

    player.on('channelEmpty', queue => {
        queue.metadata.send({
            embeds: [{
                color: "#ff2d55",
                title: "Nobody is in the voice channel...",
                description: "Leaving...bye 👋"
            }]
        });
        queue.destroy();
    });

    player.on('queueEnd', queue => {
        queue.metadata.send({
            embeds: [{
                color: "ffcc00",
                title: "Empty Queue",
                description: "😔 The queue is now empty."
            }]
        });
    });

    client.once("reconnecting", () => {
        console.log("Reconnecting!");
    });

    client.once("disconnect", () => {
        console.log("Disconnect!");
    });

    client.on("messageCreate", async (message) => {
        if (message.author.bot || !message.guild) return;
        if (!client.application?.owner) await client.application?.fetch();

        if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
            await message.guild.commands.set(client.commands).then(() => {
                message.reply("Deployed!");
            })
                .catch((err) => {
                    message.reply("Could not deploy commands! Make sure the bot has the application.commands permission!");
                    console.error(err);
                });
        }
    });

    client.on("interactionCreate", async interaction => {
        const command = client.commands.get(interaction.commandName.toLowerCase());
        try {
            if (interaction.commandName == "reload") {
                command.execute(interaction, client);
            } else {
                command.execute(interaction, player);
            }
        } catch (error) {
            console.error(error);
            interaction.followUp({
                content: "There was an error trying to execute that command!",
            });
        }
    });
};
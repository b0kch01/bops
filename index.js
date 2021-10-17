const fs = require("fs");
const chalk = require("chalk");
const gradient = require("gradient-string");
const figlet = require("figlet");

const Discord = require("discord.js");
const Client = require("./client/Client");

const { Player } = require("discord-player");
const { token } = require("./config.json");

const { createEvents } = require("./events.js");


// Create a new client
const client = new Client();

// Register commands
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Create events
const player = new Player(client,
    {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
        },
    }
);
createEvents(client, player);

client.once("ready", async () => {
    console.clear();
    console.log(
        gradient.atlas.multiline(figlet.textSync("BOPS", {
            font: 'Larry 3D',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        })),

        gradient.atlas.multiline("\n╔═════════════════════╗\n║"),
        chalk.yellow("Modified by b0kch01"),
        gradient.atlas.multiline("‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎║"), "Play good songs only!",
        gradient.atlas.multiline("\n╚═════════════════════╝"),
        chalk.green("\n\n⟪✓⟫"), "Bot is running! (owner must run !deploy)"
    );


    client.user.setActivity("bops", {
        type: "LISTENING"
    });
});

process.on("unhandledRejection", err => {
    console.error(err);
});

client.login(token);
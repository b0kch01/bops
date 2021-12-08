<div align=center>

<img src=https://cdn.discordapp.com/avatars/888244453431709766/1dab6d045ffd1decb9c4b370a72ce0f9.webp width=100 align="right">
  
<img src=https://cdn.discordapp.com/avatars/888244453431709766/1dab6d045ffd1decb9c4b370a72ce0f9.webp width=100 align="left">
   
# Bops

```
~ Play Good Songs Only ~
A Discord music bot! Mainly for private use.
```
  
</div>



## Table of Contents

-   [Requirements](#requirements)
-   [Getting started](#getting-started)
-   [Common errors](#common-errors)
-   [Contributing](#contributing)
-   [License](#license)

## Requirements

-   [Node](https://nodejs.org/en/) - Version 16 or higher
-   [NPM](https://www.npmjs.com/)
-   [FFMPEG](https://www.ffmpeg.org/)

## Getting started

First, make sure you have all the required tools installed on your local machine then continue with these steps.

### Installation

```bash
# Clone the repository
git clone https://github.com/b0kch01/bops/

# Enter into the directory
cd bops/

# Install the dependencies
yarn install # yarn
npm install # npm
```

## Required permissions

**Important:** Make sure that your bot has the `applications.commands` application scope enabled, which can be found under the `OAuth2` tap on the [developer portal](https://discord.com/developers/applications/)

### Configuration

After cloning the project and installing all dependencies, you need to add your Discord API token in the config.json file.

### Starting the application

```bash
node index.js
```

## Deploying commands

Before you can use the bots slash command you first need to add them to your Discord server. You can use the `!deploy` command to do so. You must be admin or owner of the bot for this to work

## Common errors

### Dependencies aren't up to date

The packages used in this repository get updated often, especially the ytdl-core package. That is why it is always worth a try updating those if you get an error like `invalid URL: undefined` or when the bot crashes when running the play command.

```bash
yarn upgrade # yarn
npm update # npm
```

### FFMPEG is not installed on the machine running the bot

The `play` command requires FFMPEG to be installed on the machine that is running the bot. You can download it on the official [FFMPEG website](https://www.ffmpeg.org/). Note: This isn't relevant if you use the Dockerfile because it will install FFMPEG inside of the container.

### Bot Crashes while playing song

Not supposed to happen anymore 😳

## Contributing

You are welcome to contribute by submitting a Pull Request to the repository.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details

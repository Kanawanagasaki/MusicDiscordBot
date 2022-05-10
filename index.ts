import { Client, Intents } from "discord.js";
import { PlayerService } from "./playerService";
var { token } = require("./conf.json");

const musicService = new PlayerService();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on("messageCreate", (message) => {
    if (!message.content.startsWith("!")) return;

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        message.reply('Please be in a voice channel first!');
        return;
    }

    const player = musicService.GetPlayer(message.guild.id, voiceChannel.id, message.guild.voiceAdapterCreator);

    let split = message.content.substring(1).split(' ');
    let command = split[0];
    let args = split.slice(1).join(" ");

    switch (command) {
        case "play":
            player.Play(args);
            break;
        case "skip":
            player.Skip();
            break;
        case "stop":
            player.Stop();
            break;
    }
});

client.login(token);

import { Client, Intents, TextChannel } from "discord.js";
import ytdl from "ytdl-core";
import { PlayerService } from "./playerService";
import { SongInfo } from "./songInfo";
var { token } = require("./conf.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const musicService = new PlayerService(client);

client.once('ready', () => {
    console.log('Ready!');
});

client.on("messageCreate", async (message) => {
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
            if(!ytdl.validateURL(args))
            {
                message.reply('Url was invalid!');
                return;
            }
            let details = await ytdl.getInfo(args);
            let info = new SongInfo();
            info.Link = args;
            info.Title = details.videoDetails.title;
            info.Image = details.videoDetails.thumbnails[0].url;
            info.Length = details.videoDetails.lengthSeconds + " sec.";
            if(message.channel instanceof TextChannel)
                info.Channel = message.channel;
            player.Play(info);
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

import { Client, Intents } from "discord.js";
import { PlayerService } from "./playerService";
import { SongInfo } from "./songInfo";
var { token } = require("conf.json");

const musicPlayer = new PlayerService();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on("messageCreate", (message) => {
    if (message.content.startsWith("!play ")) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.reply('Please be in a voice channel first!');
            return;
        }
        let info = new SongInfo();
        info.ChannelId = voiceChannel.id;
        info.GuildId = message.guild.id;
        info.AdapterCreator = message.guild.voiceAdapterCreator;
        info.Link = message.content.substring(6);
        musicPlayer.Play(info);
    }
});

client.login(token);
import { AudioPlayer, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, PlayerSubscription, VoiceConnection } from "@discordjs/voice";
import { Client, ClientVoiceManager, MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";
import { SongInfo } from "./songInfo";

export class MusicPlayer
{
    public GuildId:string;
    public ChannelId:string;
    private _adapterCreator:DiscordGatewayAdapterCreator;
    private _connection:VoiceConnection = null;
    private _player:AudioPlayer = null;
    private _isConnected:boolean = false;
    private _isPlaying:boolean = false;

    private _queue:SongInfo[] = [];

    private _client:Client;

    public constructor(client:Client, guildid:string, channelid:string, adapterCreator:DiscordGatewayAdapterCreator)
    {
        this._client = client;

        this.GuildId = guildid;
        this.ChannelId = channelid;
        this._adapterCreator = adapterCreator;
    }

    public Play(song:SongInfo)
    {
        if(!this._isConnected)
            this.Connect();
        
        if(this._isPlaying)
            this._queue.push(song);
        else
            this.Start(song);
    }

    public Skip()
    {
        if(this._isConnected)
            this._player.stop();
    }

    public Stop()
    {
        this._queue = [];
        if(this._isConnected)
            this._player.stop();
    }

    private Connect()
    {
        this._connection = joinVoiceChannel({
            channelId: this.ChannelId,
            guildId: this.GuildId,
            adapterCreator: this._adapterCreator
        });
        this._player = createAudioPlayer();
        this._connection.subscribe(this._player);

        this._player.on("idle" as any, () =>
        {
            if(this._queue.length > 0)
            {
                let queueSong = this._queue.shift();
                this.Start(queueSong);
            }
            else
            {
                this._connection.destroy();
                this._isPlaying = false;
                this._isConnected = false;
            }
        });
        this._player.on("error", error => console.log("ERROR:\n" + error));
        this._player.on("debug", dbg => console.log("DEBUG:\n" + dbg));

        this._isConnected = true;
    }

    private Start(song:SongInfo)
    {
        if(song.Channel !== undefined)
        {
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(song.Title)
                .setThumbnail(song.Image)
                .addField('Length', 'Length of a song is ' + song.Length)
                .addField('Queue', "There are " + this._queue.length + " songs in queue");
            song.Channel.send({ embeds: [exampleEmbed] });
        }

        let stream = ytdl(song.Link, { filter: 'audioonly' });
        this._player.play(createAudioResource(stream, { seek: 0, volume: 1 } as any));
        this._isPlaying = true;
    }
}

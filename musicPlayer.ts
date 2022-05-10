import { AudioPlayer, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, PlayerSubscription, VoiceConnection } from "@discordjs/voice";
import ytdl from "ytdl-core";

export class MusicPlayer
{
    public GuildId:string;
    public ChannelId:string;
    private _adapterCreator:DiscordGatewayAdapterCreator;
    private _connection:VoiceConnection = null;
    private _player:AudioPlayer = null;
    private _isConnected:boolean = false;
    private _isPlaying:boolean = false;

    private _queue:string[] = [];

    public constructor(guildid:string, channelid:string, adapterCreator:DiscordGatewayAdapterCreator)
    {
        this.GuildId = guildid;
        this.ChannelId = channelid;
        this._adapterCreator = adapterCreator;
    }

    public Play(link:string)
    {
        if(!this._isConnected)
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
                    let stream = ytdl(this._queue.shift(), { filter: 'audioonly' });
                    this._player.play(createAudioResource(stream, { seek: 0, volume: 1 } as any));
                    this._isPlaying = true;
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
        
        if(this._isPlaying)
            this._queue.push(link);
        else
        {
            let stream = ytdl(link, { filter: 'audioonly' });
            this._player.play(createAudioResource(stream, { seek: 0, volume: 1 } as any));
            this._isPlaying = true;
        }
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
}

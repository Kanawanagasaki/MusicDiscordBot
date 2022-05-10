import { Client } from "discord.js";
import { MusicPlayer } from "./musicPlayer";

export class PlayerService
{
    private _players:MusicPlayer[] = [];

    private _client:Client;

    public constructor(client:Client)
    {
        this._client = client;
    }

    public GetPlayer(guildId:string, channelId:string, adapterCreator:any)
    {
        let player = this._players.find(p => p.GuildId == guildId && p.ChannelId == channelId);
        if(player === undefined)
        {
            player = new MusicPlayer(this._client, guildId, channelId, adapterCreator);
            this._players.push(player);
        }
        return player;
    }
}

import { MusicPlayer } from "./musicPlayer";

export class PlayerService
{
    private _players:MusicPlayer[] = [];

    public GetPlayer(guildId:string, channelId:string, adapterCreator:any)
    {
        let player = this._players.find(p => p.GuildId == guildId && p.ChannelId == channelId);
        if(player === undefined)
        {
            player = new MusicPlayer(guildId, channelId, adapterCreator);
            this._players.push(player);
        }
        return player;
    }
}

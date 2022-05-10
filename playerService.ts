import { MusicPlayer } from "./musicPlayer";
import { SongInfo } from "./songInfo";

export class PlayerService
{
    private _players:MusicPlayer[] = [];

    public Play(info:SongInfo)
    {
        let player = this._players.find(p => p.GuildId == info.GuildId && p.ChannelId == info.ChannelId);
        if(player === undefined)
        {
            player = new MusicPlayer(info.GuildId, info.ChannelId, info.AdapterCreator);
            this._players.push(player);
        }
        player.Play(info.Link);
    }
}

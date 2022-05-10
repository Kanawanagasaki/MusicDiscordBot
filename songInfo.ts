import { TextChannel } from "discord.js";

export class SongInfo
{
    public Link:string;
    public Title:string;
    public Image:string;
    public Length:string;
    public Channel:TextChannel|undefined;
}

export class Config {
  public static get DISCORD_CLIENT_TOKEN() { return process.env.DISCORD_CLIENT_TOKEN; }
  public static get MONGODB_CONNECT_URL () { return process.env.MONGODB_CONNECT_URI; }
  public static get REPLAY_SERVER_PORT() { return process.env.REPLAY_SERVER_PORT || 8000; }
  public static get DISCORD_GUILD_ID() { return process.env.DISCORD_GUILD_ID || ""; }
}
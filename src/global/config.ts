export class Config {
  public static get MONGODB_CONNECT_URL () { return process.env.MONGODB_CONNECT_URI; }
  public static get REPLAY_SERVER_PORT() { return process.env.REPLAY_SERVER_PORT || 8080; }
}
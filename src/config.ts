type User = {
  [key: string]: string;
};

export default class config {
  static token: string = "DISCORD TOKEN";
  static clientID: string = "CLIENT ID";
  static testServerID: string = "TEST SERVER ID";
  static ubisoftEmail: string = "YOUR UBISOFT Email HERE";
  static ubisoftPassword: string = "YOUR UBISOFT PASSWORD HERE";
  static users: User = {
    UBISOFT_ID_HERE: "DISCORD_USERNAME",
  };
}

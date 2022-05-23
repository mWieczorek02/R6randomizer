export interface IUser {
  idOnPlatform: string;
  nameOnPlatform: string;
  platformType: string;
  userId: string;
}

export interface ISession {
  appId: string;
  spaceId: string;
  sessionId: string;
  ticket: string;
  expiration: string;
  startDate: string;
  endDate: string;
}

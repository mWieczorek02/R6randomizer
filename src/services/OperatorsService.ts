import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import http2 from "http2";
import config from "../config";
import { Operators } from "../interfaces/Operators";
import { ISession, IUser } from "../interfaces/User";

export default class OperatorService {
  static getOperators(): any {
    return axios
      .get<Operators>("https://orcicorn.com/siege/operators.json?v=220131")
      .then((res: AxiosResponse<any>) => res);
  }

  // taken from @vince144/r6-api
  static getUsersStats(user: any, session: any): any {
    let options = {
      headers: {
        Authorization: `ubi_v1 t=${session.ticket}`,
        "ubi-appid": session.appId,
        "ubi-sessionid": session.sessionId,
        "content-type": "application/json",
        "user-agent": "node.js",
        Connection: "keep-alive",
      },
    };

    return axios
      .get<any>(
        `https://public-ubiservices.ubi.com/v1/spaces/${session.spaceId}/sandboxes/OSBOR_PC_LNCH_A/r6karma/players?board_id=pvp_ranked&season_id=-1&region_id=ncsa&profile_ids=${user.userId}`,
        options
      )
      .then((res: AxiosResponse<any>) => res.data.players[user.userId]);
  }

  static getUsersOperators(user: any, session: any, team?: string): any {
    team = team || "attacker,defender";
    let options = {
      ":authority": "r6s-stats.ubisoft.com",
      ":method": "GET",
      ":path": `/v1/current/operators/${user.userId}?gameMode=all,ranked,casual,unranked&platform=PC&teamRole=${team}&startDate=${session.startDate}&endDate=${session.endDate}`,
      ":scheme": "https",
      authorization: `ubi_v1 t=${session.ticket}`,
      "ubi-appid": session.appId,
      "ubi-sessionid": session.sessionId,
      "content-type": "application/json",
      "user-agent": "node.js",
      expiration: session.expiration,
    };

    const authority = `https://r6s-stats.ubisoft.com/v1/current/operators/${user.userId}?gameMode=all,ranked,casual,unranked&platform=PC&teamRole=attacker,defender&startDate=${session.startDate}&endDate=${session.endDate}`;
    return new Promise((resolve, reject) => {
      try {
        const client = http2.connect(authority);
        let data: any = "";
        client.on("error", (e: any) => {
          reject(e);
        });

        const req = client.request(options);
        req.on("error", (e: any) => {
          reject(e);
        });

        req.on("data", (chunk: any) => {
          data += chunk;
        });

        req.on("end", () => {
          if (!data) reject("an error occured");
          data = JSON.parse(data);
          client.close();
          const { teamRoles } = data.platforms.PC.gameModes.all;
          resolve(teamRoles);
        });
        req.end();
      } catch (e) {
        reject(e);
      }
    });
  }

  static getUsersAvatar(user: IUser, session: any): any {
    return axios
      .get(
        `https://ubisoft-avatars.akamaized.net/${user.userId}/default_146_146.png?appId=${session.appId}`
      )
      .then((res: AxiosResponse<any>) => res.data);
  }

  static getUserInfo(username: string, session: any): any {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `ubi_v1 t=${session.ticket}`,
        "Ubi-AppID": session.appId,
        "Ubi-SessionID": session.sessionId,
        Connection: "keep-alive",
      },
    };

    return axios
      .get(
        `https://public-ubiservices.ubi.com/v3/profiles?namesOnPlatform=${username}&platformType=uplay`,
        requestConfig
      )
      .then((res: AxiosResponse<any>): IUser => {
        return {
          idOnPlatform: res.data.profiles[0].idOnPlatform,
          nameOnPlatform: res.data.profiles[0].nameOnPlatform,
          platformType: res.data.profiles[0].platformType,
          userId: res.data.profiles[0].profileId,
        };
      });
  }

  static getSessionData(): any {
    const start: () => string = () => {
      let startDate: Date | string = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate = startDate.toISOString().split("T")[0].replace(/-/g, "");
      return startDate;
    };

    const end: () => string = () => {
      let endDate: Date | string = new Date();
      endDate.setDate(endDate.getDate() - 1);
      endDate = endDate.toISOString().split("T")[0].replace(/-/g, "");
      return endDate;
    };

    let appId = "3587dcbb-7f81-457c-9781-0e3f29f6f56a";
    let spaceId = "5172a557-50b5-4665-b7db-e3f2e8c5041d";
    let options: any = {
      rememberMe: true,
      method: "POST",
    };
    let requestConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            config.ubisoftEmail + ":" + config.ubisoftPassword
          ).toString("base64"),
        "Ubi-AppId": appId,
        "Ubi-RequestedPlatformType": "uplay",
        Connection: "keep-alive",
      },
    };
    return axios
      .post(
        "https://public-ubiservices.ubi.com/v3/profiles/sessions",
        options,
        requestConfig
      )
      .then((res): ISession => {
        return {
          appId: appId,
          spaceId: spaceId,
          sessionId: res.data.sessionId,
          ticket: res.data.ticket,
          expiration: res.data.expiration,
          startDate: start(),
          endDate: end(),
        };
      });
  }
}

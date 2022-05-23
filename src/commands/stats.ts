import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { ISession, IUser } from "../interfaces/User";

import OperatorService from "../services/OperatorsService";

export default class Stats {
  static data: Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  > = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("return users stats")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("user")
        .setDescription("choose which user stats you want to see")
        .setRequired(true)
    );

  static async execute(
    interaction: CommandInteraction,
    client: Client,
    options: string[] | undefined,
    session: ISession | undefined
  ) {
    if (!options || !session) return;
    const user: IUser = await OperatorService.getUserInfo(options[0], session);
    const stats = await OperatorService.getUsersStats(user, session);

    const embed = new MessageEmbed()
      .setTitle(`${user.nameOnPlatform}'s season stats`)
      .setThumbnail(
        `https://ubisoft-avatars.akamaized.net/${user.userId}/default_146_146.png?appId=${session.appId}`
      )
      .addFields(
        { name: "current mmr:", value: stats.mmr.toString() },
        { name: "highest mmr:", value: stats.max_mmr.toString() },
        { name: "kills:", value: stats.kills.toString() },
        { name: "deaths:", value: stats.deaths.toString() },
        {
          name: "kd ratio:",
          value: (stats.kills / stats.deaths).toFixed(2).toString(),
        },
        { name: "wins:", value: stats.wins.toString() },
        { name: "losses:", value: stats.losses.toString() }
      );

    interaction.reply({ embeds: [embed] });
  }
}

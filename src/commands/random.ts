const path = require("path");
const getColors = require("get-image-colors");
import { MessageAttachment, MessageEmbed } from "discord.js";
import {
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  Client,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import OperatorService from "../services/OperatorsService";
import config from "../config";
import { IUser } from "../interfaces/User";
import Vibrant = require("node-vibrant");

export default class Random {
  static data: Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  > = new SlashCommandBuilder()
    .setName("random")
    .setDescription("randomized operator")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("strona")
        .setDescription("wybierz strone po której jesteś")
        .setRequired(true)
        .addChoices([
          ["atak", "attacker"],
          ["obrona", "defender"],
        ])
    );
  static async execute(
    interaction: CommandInteraction,
    _: Client,
    options: string[] | undefined,
    session: any
  ) {
    try {
      const startTime = new Date();
      const row: MessageActionRow = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("random attacker")
            .setLabel("Atak")
            .setStyle("DANGER")
        )
        .addComponents(
          new MessageButton()
            .setCustomId("random defender")
            .setLabel("Obrona")
            .setStyle("PRIMARY")
        );
      const player: IUser = await OperatorService.getUserInfo(
        config.users[interaction.user.id],
        session
      );
      if (!options) return;
      let side: string | number | boolean | undefined = options[0] as string;

      side = side.charAt(0).toUpperCase() + side.slice(1);

      const data = await OperatorService.getUsersOperators(
        player,
        session,
        side
      );

      const randomOperator: string =
        data[side][Math.floor(Math.random() * data[side].length)].statsDetail;
      const thumbnail: string = `https://cdn.r6stats.com/badges/${randomOperator.toLowerCase()}_badge.png`;

      const palette: any = await Vibrant.from(thumbnail)
        .getPalette()
        .then((palette) => palette.Vibrant?.hex);

      const embed: MessageEmbed = new MessageEmbed()
        .setColor(palette)
        .setTitle(randomOperator.toUpperCase())
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction?.user?.avatarURL() as string,
        })

        .setThumbnail(thumbnail);
      interaction.reply({
        embeds: [embed],
        components: [row],
      });
      const endTime = new Date();
      console.log(
        `start time: ${startTime.getTime()}\nend time: ${endTime.getTime()}\ntime elapsed: ${
          endTime.getTime() - startTime.getTime()
        }`
      );
    } catch (error) {
      console.error(error);
    }
  }
}

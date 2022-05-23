import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client } from "discord.js";

export default class Ping {
  static data: Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  > = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies with pong2");

  static async execute(interaction: CommandInteraction, client: Client) {
    await interaction.reply("pong!");
  }
}

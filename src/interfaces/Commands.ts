import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { ISession } from "./User";

export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (
    interaction: CommandInteraction,
    client: Client,
    options?: string[],
    session?: ISession
  ) => void;
}

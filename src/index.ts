import config from "./config";
const { Client, Intents } = require("discord.js");
import { Interaction } from "discord.js";
import { commandsList } from "./commands/index";
import { Command } from "./interfaces/Commands";
import OperatorService from "./services/OperatorsService";
import { ISession } from "./interfaces/User";
//const { fileTypeFromBuffer } = require("file-type");
const r6api = require("@vince144/r6-api");
require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let session: ISession;

client.on("ready", async () => {
  session = await OperatorService.getSessionData();

  if (process.env.NODE_ENV !== "development") return;
  const guild = client.guilds.cache.get(config.testServerID);
  let commands: any;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  commandsList.forEach((command: Command) => {
    commands?.create(command.data);
  });
  console.log("success");
});

client.on(
  "interactionCreate",
  async (interaction: Interaction): Promise<void> => {
    if (!interaction.isCommand()) return;
    const options: string[] = interaction.options.data.map(
      (option) => option.value
    ) as string[];

    commandsList.forEach((command: Command) => {
      if (command.data.name === interaction?.commandName)
        command.execute(interaction, client, options, session);
    });
  }
);

client.on("interactionCreate", async (interaction: any): Promise<void> => {
  console.log(interaction);

  if (!interaction.isButton()) return;

  commandsList.forEach((command: Command) => {
    if (command.data.name === interaction?.customId.split(" ")[0])
      command.execute(
        interaction,
        client,
        [interaction.customId.split(" ")[1]],
        session
      );
  });
});

client.login(config.token);

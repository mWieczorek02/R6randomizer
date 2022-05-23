import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { commandsList } from "./commands";
import config from "./config";

const commands = [];
for (const command of commandsList) {
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(config.token);

(async () => {
  try {
    await rest.put(Routes.applicationCommands("APPLICATION ID"), {
      body: commands,
    });
    console.log("success");
  } catch (error) {
    console.error(error);
  }
})();

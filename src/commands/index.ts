import { Command } from "../interfaces/Commands";
import Ping from "./ping";
import Random from "./random";
import Stats from "./stats";

export const commandsList: Command[] = [Ping, Random, Stats];

/**
 * @file Deploys commands to discord API
 */
import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
import "dotenv/config";

const __dirname = import.meta.dirname;
const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandfolders = fs.readdirSync(foldersPath);

for (const folder of commandfolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const { data } = await import("file://" + filePath);
        if (data) {
            commands.push(data.toJSON());
        } else {
            console.log(`[WARN] The command at ${filePath} is missing required "data" property.`);
        }
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands },
    );

    console.log("Successfully reloaded application (/) commands.");
} catch (err) {
    console.error(err);
    console.error("Failed to reload application (/) commands.");
}
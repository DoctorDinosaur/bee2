import fs from "fs";
import path from "path";
import { schedule as cronSchedule } from "node-cron";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { state } from "./util/state.js";
import "dotenv/config";

const __dirname = import.meta.dirname;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelids = process.env.CHANNEL_IDS.split(",");

export async function sendToNotificationChannels(description = '', author = '', title = '', titleUrl = '', color = '', footer = '') {
	for (const channelid of channelids) {
		try {
			const channelObj = await client.channels.fetch(channelid);
			const embed = {
				color: color || null,
				title: title || null,
				url: titleUrl || null,
				author: {name: author || null},
				description: description || null,
				footer: {text: footer || null},
				timestamp: new Date()
			};
			await channelObj.send({embeds: [embed]});

		} catch (error) {
			console.error(`Failed to send message to channel ${channelid}: ${error}`);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const { name, once, execute } = await import("file://" + filePath);
	
	if (!name || !execute) {
		console.log(`[WARN] The event at ${filePath} is missing required "name" or "execute" property.`);
		continue;
	}

	if (once) {
		client.once(name, (...args) => execute(...args));
	} else {
		client.on(name, (...args) => execute(...args));
	}
}

const cronPath = path.join(__dirname, "cron");
const cronFiles = fs.readdirSync(cronPath).filter(file => file.endsWith(".js"));

for (const file of cronFiles) {
	const filePath = path.join(cronPath, file);
	const { name, schedule, task } = await import("file://" + filePath);
	
	if (!name || !schedule || !task) {
		console.log(`[WARN] The cron job at ${filePath} is missing required "name", "schedule", or "task" property.`);
		continue;
	}

	cronSchedule(schedule, async () => task(sendToNotificationChannels));
}

client.login(process.env.DISCORD_TOKEN);

client.on(Events.ClientReady, () => {
	sendToNotificationChannels(title = "Bot started. Ready to announce election results.");
});
import { world, system } from "@minecraft/server";
import { Client } from "minecraft-extra/discord";
import { getLastMessageID, setLastMessageID } from "./dynamicProps.js";
import { handler } from "./utlis.js";

// You need to keep it in secret...
const token = "YOUR BOT TOKEN HERE";

/**
 * Some cool IDs
 */
export const DISCORD = {
	channel: "channel snowflake",
	server: "server snowflake",
	safeID: "last message in channel id",
	client: new Client(token),
};

handler(async () => {
	// Connecting to discord
	const guild = await DISCORD.client.getGuild(DISCORD.server, { with_counts: false });
	// Message about launch!
	DISCORD.client.sendMessage(DISCORD.channel, { content: "Server is opened!" });

	/**
	 * Getting the last message ID,
	 * getting the messages after that ID,
	 * and then sending the messages to the server chat.
	 */
	const tick = () => {
		handler(async () => {
			// Getting last message id from world DB
			const id = getLastMessageID();
			// Getting messages from Discord and reverse the messages array...
			const messages = (await guild.getMessages(DISCORD.channel, { after: id, limit: 2 })).reverse();

			// Guard for errors
			if (messages.length < 1) return;

			// Last element in array is our new id for the next call
			const newID = messages[messages.length - 1].id;
			// Save it to world DB
			setLastMessageID(newID);

			/**
			 *  It sets true after for cycle finds requested message,
			 *  and then messages after requested are displayed to chat.
			 *  Idk how to do it other way.
			 */
			let isNew = false;
			for (const message of messages) {
				if (message.id === id) {
					// Yay, we found requested message!
					isNew = true;

					// Skip it because we already displayed it
					continue;
				}
				// Old message, skip
				if (!isNew) continue;

				// We dont need to bot messages in mc chat
				if (message.author.bot) continue;

				// All good, send!
				world.say(`§8[§9DS§8] §7${message.author.username}: §f${message.content}`);
			}
		});
	};

	// Make every 100 tick it cycle
	system.runSchedule(tick, 100);
});

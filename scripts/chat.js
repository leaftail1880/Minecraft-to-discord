import { world } from "@minecraft/server";
import { DISCORD } from "./discord.js";
import { handler } from "./utlis.js";

world.events.beforeChat.subscribe((data) => {
	handler(() => {
		data.cancel = true;
		world.say(`§7${data.sender.name}:§r ${data.message}`);
		DISCORD.client.sendMessage(DISCORD.channel, {
			content: `[MC] ${data.sender.name}: ` + data.message,
		});
	});
});

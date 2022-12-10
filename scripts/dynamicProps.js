import { DynamicPropertiesDefinition, world } from "@minecraft/server";
import { DISCORD } from "./discord.js";
import { handler } from "./utlis.js";

// Message key
const key = "discord.mc/msgID";

/* Defining dynamic property for the world to use in future. */
world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
	const dynamicProperty = new DynamicPropertiesDefinition();
	dynamicProperty.defineString(key, 100);
	propertyRegistry.registerWorldDynamicProperties(dynamicProperty);
});

/**
 * It gets the last message ID from the world's dynamic property
 * @returns {string} A string.
 */
export function getLastMessageID() {
	try {
		const get = world.getDynamicProperty(key);
		if (!get) return DISCORD.safeID;
		if (typeof get !== "string") {
			handler(() => {
				throw new TypeError("ID isnt a string!");
			});
			return DISCORD.safeID;
		}
		return get;
	} catch (e) {
		handler(() => {
			throw e;
		});
	}
}

/**
 *  It sets the last message ID.
 * @param {string} ID - The ID of the message you want to set as the last message.
 */
export function setLastMessageID(ID) {
	try {
		world.setDynamicProperty(key, ID);
	} catch (e) {
		handler(() => {
			throw e;
		});
	}
}

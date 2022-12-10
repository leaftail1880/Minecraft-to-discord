import { world } from "@minecraft/server";

/**
 * It runs a callback function and catches any errors that occur
 * @param {Function} callback - The function to be called.
 */
export async function handler(callback) {
	try {
		await callback();
	} catch (e) {
		world.say(typeof e === "object" ? `§4${e.name}. §c${e.message}:\n  §f${e.stack}` : `§c${e}`);
	}
}

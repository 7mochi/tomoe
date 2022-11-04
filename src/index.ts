import { App } from "./app";

export const app = App.instance;
app.start();

process.on("SIGINT", async () => closeApp);
process.on("SIGTERM", async () => closeApp);

async function closeApp(): Promise<void> {
	await app.stop();
	process.exit(0);
}

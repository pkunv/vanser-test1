import * as esbuild from "esbuild"
import express, { Express, Request, Response } from "express"
import { readdirSync, writeFile } from "fs"
import { registerEnv } from "mini-van-plate/shared"
import van, { Element } from "mini-van-plate/van-plate"
import morgan from "morgan"

const port = 3000

const app: Express = express()

app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			parseInt(tokens.res(req, res, "content-length")!) / 1024,
			"kb",
			"-",
			tokens["response-time"](req, res),
			"ms",
		].join(" ")
	})
)

registerEnv({ van })

const appDirectory = process.env.NODE_ENV === "development" ? "src/app" : "dist/app"

const appExtension = process.env.NODE_ENV === "development" ? "ts" : "js"

writeFile(".vanser/client-imports.ts", "", (err) => {})

readdirSync("src/components", { recursive: true }).forEach((component) => {
	import(`./components/${component}`).then((module) => {
		const clientComponent = {
			path: `../src/components/${component}`,
			name: module.default.name,
		}
		writeFile(
			".vanser/client-imports.ts",
			"import " +
				module.default.name +
				" from " +
				JSON.stringify(clientComponent.path) +
				" \n export { " +
				module.default.name +
				" }",
			(err) => {
				if (err) throw err
			}
		)
	})
})

const directories = readdirSync(appDirectory, { recursive: true })
	.filter((directory) => (directory as string).endsWith(appExtension))
	.map((directory) => (directory as string).replace("\\", "/"))
	.map((directory) => {
		return {
			file: directory,
			path: `/${directory
				.replace(`page.${appExtension}`, "")
				.replace(/\/+$/, "") // Remove trailing slashes
				.replace(/\\+$/, "")}`, // Remove trailing backslashes
		}
	})

await esbuild.build({
	entryPoints: [".vanser/client.ts"],
	bundle: true,
	minify: true,
	outfile: "dist/client.bundle.min.js",
})

app.use("/assets", express.static("dist"))

const { body, head, meta, script, title } = van.tags

directories.forEach(async (directory) => {
	const route = await import(`../${appDirectory}/${directory.file}`)

	app.get(directory.path, async (_req: Request, res: Response) => {
		res.header("Content-Type", "text/html")

		res.send(
			Buffer.from(
				van.html(
					head(
						title(route.title),
						meta({ name: "viewport", content: "width=device-width, initial-scale=1" })
					),
					body(
						script({
							type: "text/javascript",
							src: `assets/client.bundle.min.js`,
							defer: true,
						}),
						(await route.default()) as Element
					)
				)
			)
		)
	})
})

/**
 * Start the Express server
 */
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`)
})

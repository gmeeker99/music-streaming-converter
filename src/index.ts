import dotenv from "dotenv"
dotenv.config()
import { createSpotifyAuth } from "./auth/spotifyAuthClient.js"
import open from "open"
import child_process from "child_process"
import path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const pathtoFile = path.join(__dirname, "test.js")

const CALLBACK_URL = "http://localhost:3000/callback"

const spotifyAuthClient = createSpotifyAuth(
	process.env.SPOTIFY_CLIENT_ID,
	process.env.SPOTIFY_CLIENT_SECRET,
	CALLBACK_URL
)

open(
	spotifyAuthClient.getAuthorizationUrl([
		"user-library-modify",
		"user-library-read",
		"user-read-email",
	])
).then(() => {
	const child = child_process.spawn("node", [pathtoFile])
	child.stdout.on("data", data => {
		console.log(data.toString())
	})
	child.stdin.write("start")
})

console.log(spotifyAuthClient)

// const isAuthorized = await isClientAuthorized()

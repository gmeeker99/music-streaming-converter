import dotenv from "dotenv"
dotenv.config()
import { createSpotifyAuth } from "./auth/spotifyAuthClient.js"
import open from "open"
import { fork } from "child_process"
import path from "path"
import * as url from "url"
import { writeTokens } from "./auth/jsonTokens.js"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const CALLBACK_URL = "http://localhost:3000/callback"

const spotifyAuthClient = createSpotifyAuth(
	process.env.SPOTIFY_CLIENT_ID,
	process.env.SPOTIFY_CLIENT_SECRET,
	CALLBACK_URL
)

function initialize() {
	//** this is just used for spotify currently
	open(
		spotifyAuthClient.getAuthorizationUrl([
			"user-library-modify",
			"user-library-read",
			"user-read-email",
		])
	)
	const pathToFile = path.join(__dirname, "./auth/authServer.ts")

	const server = fork(pathToFile)
	server.on("message", async authToken => {
		const tokens = await spotifyAuthClient.getTokens(authToken as string)
		writeTokens({ spotifyTokens: tokens })
	})

	return new Promise((resolve, reject) => {})
}

await initialize()

// .then(() => {
// })

// const isAuthorized = await isClientAuthorized()

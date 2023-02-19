import dotenv from "dotenv"
dotenv.config()
import { SpotifyAuthClient } from "./auth/spotifyAuthClient.js"
import open from "open"
import { fork } from "child_process"
import path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const CALLBACK_URL = "http://localhost:3000/callback"

const spotifyAuthClient = new SpotifyAuthClient(
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
		await spotifyAuthClient.getTokens(authToken as string)
	})

	return new Promise((resolve, reject) => {})
}

// await initialize()
// await spotifyAuthClient.refreshTokens()
const tracks: any = await spotifyAuthClient.getTracks(50, 0)
// console.log(JSON.stringify(tracks))
let trackArray = []

tracks.forEach(track => {
	const object = {
		addedAt: track.added_at,
		artist: track.track.artists[0].name,
		album: track.track.album.name,
		name: track.track.name,
		trackId: track.track.id,
		url: track.track.external_urls.spotify,
	}
	trackArray.push(object)
})
console.log(JSON.stringify(trackArray))
// spotifyAuthClient.refreshTokens()

// .then(() => {
// })

// const isAuthorized = await isClientAuthorized()

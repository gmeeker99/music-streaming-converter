import dotenv from "dotenv"
dotenv.config()
import { SpotifyAuthClient } from "./auth/spotifyAuthClient.js"
import open from "open"
import { fork } from "child_process"
import path from "path"
import * as url from "url"
import jsonfile from "jsonfile"

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

for (let i = 0; i < 5; i++) {
	let trackArray = []
	let offset = i * 50

	const tracks: any = await spotifyAuthClient.getTracks(50, offset)

	tracks.forEach((track, index) => {
		const object = {
			index: index + offset,
			addedAt: track.added_at,
			artist: track.track.artists[0].name,
			album: track.track.album.name,
			name: track.track.name,
			trackId: track.track.id,
			url: track.track.external_urls.spotify,
		}
		trackArray.push(object)
	})

	const file = jsonfile.readFileSync("./logs/log.json")

	const obj = [...file, ...trackArray]
	jsonfile.writeFileSync("./logs/log.json", obj)
}

// console.log(JSON.stringify(trackArray))
// spotifyAuthClient.refreshTokens()

// .then(() => {
// })

// const isAuthorized = await isClientAuthorized()

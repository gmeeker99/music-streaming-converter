import dotenv from "dotenv"
dotenv.config()
import { getSpotifyAuthorization, isClientAuthorized } from "./auth/spotify.auth.js"
import { Scope } from "./auth/spotifyScope"

const isAuthorized = await isClientAuthorized()

if (!isAuthorized) {
	const scopeOptions: Scope = [
		"user-library-read",
		"user-library-modify",
		"user-read-email",
		"user-read-private",
	]
	await getSpotifyAuthorization(scopeOptions)
}

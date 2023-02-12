import * as dotenv from "dotenv"
dotenv.config()
import queryString from "query-string"
import { Scope } from "./spotifyScope"

function buildSpotifyAuthorizationUrl(scopeOptions: Scope) {
	const scope = scopeOptions.join(" ")

	let authorizationUrl = "https://accounts.spotify.com/authorize?"

	const query = queryString.stringify({
		client_id: process.env.SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: "http://localhost:3000/callback",
		scope: scope,
		show_dialog: true,
	})

	return authorizationUrl
}

const scope: Scope = [
	"user-library-read",
	"user-library-modify",
	"user-read-email",
	"user-read-private",
]

buildSpotifyAuthorizationUrl(scope)

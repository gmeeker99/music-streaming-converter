import queryString from "query-string"
import { fork } from "child_process"
import { Scope } from "./spotifyScope"
import { readTokens } from "./tokenFile.js"
import open from "open"

export async function testAuthorization() {
	const { accessToken, refreshToken } = readTokens()

	if (!accessToken || !refreshToken) {
		const scopeOptions: Scope = [
			"user-library-read",
			"user-library-modify",
			"user-read-email",
			"user-read-private",
		]
		await getSpotifyAuthorization(scopeOptions)
	}
}

async function getSpotifyAuthorization(scopeOptions: Scope) {
	const requestAuthUrl = buildSpotifyAuthorizationUrl(scopeOptions)
	await open(requestAuthUrl)
	const { pathname: serverPath } = new URL("authServer.ts", import.meta.url)
	const child = fork(serverPath)
	child.on("exit", code => {
		console.log("code gotten", code)
	})
}

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

	authorizationUrl += query
	return authorizationUrl
}

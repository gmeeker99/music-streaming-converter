import queryString from "query-string"
import { fork } from "child_process"
import { readTokens, writeTokens } from "./tokenFile.js"
import open from "open"
import { Scope } from "./spotifyScope.js"
import axios from "axios"

const CALLBACK_URI = "http://localhost:3000/callback"

export async function isClientAuthorized() {
	const { accessToken, refreshToken } = readTokens()

	// ** this is just a test to see if there access/refresh tokens and if they work

	if (!accessToken || !refreshToken) {
		return false
	}
}

export async function getSpotifyAuthorization(scopeOptions: Scope) {
	// TODO: bifurcate where this function takes in an object that tells whether it should get spotify or apple music auth
	//
	const requestAuthUrl = buildSpotifyAuthorizationUrl(scopeOptions)
	await open(requestAuthUrl)

	const { pathname: serverPath } = new URL("authServer.ts", import.meta.url)
	const child = fork(serverPath)
	child.on("exit", () => {
		console.log(`Server killed - PID: ${child.pid} Closed`)
	})
}

export async function getSpotifyTokens() {
	const { authToken } = readTokens()
	const body = queryString.stringify({
		grant_type: "authorization_code",
		code: authToken,
		redirect_uri: CALLBACK_URI,
	})

	let clientCreds =
		"Basic " +
		Buffer.from(
			process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
		).toString("base64")

	const headers = {
		Authorization: clientCreds,
		"Content-Type": "application/x-www-form-urlencoded",
	}

	const { data } = await axios.post("https://accounts.spotify.com/api/token", body, { headers })

	// TODO: need to make write token not need all tokens, just add what I need, also need to add spotify token prefix
	writeTokens({
		authToken: "",
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
	})
}

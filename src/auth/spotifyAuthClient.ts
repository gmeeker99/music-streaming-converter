import queryString from "query-string"
import axios from "axios"
import { readTokens, Tokens, writeTokens } from "./jsonTokens.js"

type ScopeOptions =
	| "ugc-image-upload"
	| "user-read-playback-state"
	| "user-modify-playback-state"
	| "user-read-currently-playing"
	| "app-remote-control"
	| "streaming"
	| "playlist-read-private"
	| "playlist-read-collaborative"
	| "playlist-modify-private"
	| "playlist-modify-public"
	| "user-follow-modify"
	| "user-follow-read"
	| "user-read-playback-position"
	| "user-top-read"
	| "user-read-recently-played"
	| "user-library-modify"
	| "user-library-read"
	| "user-read-email"
	| "user-read-private"

export class SpotifyAuthClient {
	clientId: string
	clientSecret: string
	callbackUrl: string
	encodedClientCreds: string

	constructor(clientId: string, clientSecret: string, callbackUrl: string) {
		this.clientId = clientId
		this.clientSecret = clientSecret
		this.callbackUrl = callbackUrl
		this.encodedClientCreds =
			"Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
	}

	getAuthorizationUrl(scopeOptions: ScopeOptions[]) {
		const scope = scopeOptions.join(" ")

		let authorizationUrl = "https://accounts.spotify.com/authorize?"

		const query = queryString.stringify({
			client_id: this.clientId,
			response_type: "code",
			redirect_uri: this.callbackUrl,
			scope: scope,
			show_dialog: true,
		})

		authorizationUrl += query
		return authorizationUrl
	}

	async getTokens(authorizationToken: string) {
		const body = queryString.stringify({
			grant_type: "authorization_code",
			code: authorizationToken,
			redirect_uri: this.callbackUrl,
		})

		const headers = {
			Authorization: this.encodedClientCreds,
			"Content-Type": "application/x-www-form-urlencoded",
		}

		const { data } = await axios.post("https://accounts.spotify.com/api/token", body, {
			headers,
		})

		const tokens: Tokens = {
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
		}

		writeTokens("spotify", tokens)
	}

	private async refreshTokens() {
		const url = "https://accounts.spotify.com/api/token"

		const { refreshToken } = readTokens("spotify")

		const body = queryString.stringify({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		})

		const headers = {
			Authorization: this.encodedClientCreds,
			"Content-Type": "application/x-www-form-urlencoded",
		}

		const { data } = await axios.post(url, body, { headers })

		const tokens: Tokens = {
			accessToken: data.access_token,
		}

		if (data.refresh_token) {
			tokens.refreshToken = data.refresh_token
		}

		writeTokens("spotify", tokens)
	}

	async getTracks(tracks: number, offset: number) {
		if (tracks > 50 || tracks < 1) {
			throw Error("Invalid number of requested tracks, must be >= 1 or <= 50")
		}

		let url = "https://api.spotify.com/v1/me/tracks?"

		const query = queryString.stringify({
			limit: tracks,
			offset,
		})

		url += query

		const { accessToken } = readTokens("spotify")

		const headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + accessToken,
		}
		try {
			const { data } = await axios.get(url, { headers })
			return data.items
		} catch (e) {
			console.log(e.response.data)
			// if (e.response.data.error.status === 401) {
			// 	console.log(e)
			// 	await this.refreshTokens()
			// 	await this.getTracks(tracks, offset)
			// }
		}
	}
}

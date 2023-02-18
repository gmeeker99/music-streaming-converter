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

export function createSpotifyAuth(clientId: string, clientSecret: string, callbackUrl: string) {
	const spotifyAuthClient = {
		clientId,
		clientSecret,
		callbackUrl,

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
		},

		async getTokens(authorizationToken: string) {
			const body = queryString.stringify({
				grant_type: "authorization_code",
				code: authorizationToken,
				redirect_uri: this.callbackUrl,
			})

			let clientCreds =
				"Basic " + Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64")

			const headers = {
				Authorization: clientCreds,
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
		},

		async getTracks(limit: number, offset: number) {
			const url = "https://api.spotify.com/v1/me/tracks"

			const { accessToken } = readTokens("spotify")

			const headers = {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			}
			try {
				const { data } = await axios.get(url, { headers })
				console.log(data.items)
			} catch (e) {
				console.log(e.response.data)
			}
		},

		async refreshTokens() {
			const url = "https://accounts.spotify.com/api/token"

			const { refresh_token } = readTokens("spotify")

			const body = queryString.stringify({
				grant_type: "refresh_token",
				refresh_token,
			})

			let clientCreds =
				"Basic " + Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64")

			const headers = {
				Authorization: clientCreds,
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
		},
	}

	return spotifyAuthClient
}

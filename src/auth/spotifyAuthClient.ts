import queryString from "query-string"
import axios from "axios"
import { readTokens } from "./jsonTokens.js"

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

			const { data: tokens } = await axios.post(
				"https://accounts.spotify.com/api/token",
				body,
				{
					headers,
				}
			)
			return tokens
		},

		async getTracks(limit: number, offset: number) {
			const url = "https://api.spotify.com/v1/me/tracks"

			const { spotifyTokens } = readTokens()

			const headers = {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + spotifyTokens.access_token,
			}

			const { data } = await axios.get(url, { headers })
			console.log(data.items)
		},
	}

	return spotifyAuthClient
}

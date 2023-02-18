import jsonfile from "jsonfile"
import { CLIENT_RENEG_WINDOW } from "tls"

type ServiceTokens =
	| {
			spotifyTokens: {}
	  }
	| {
			appleMusicTokens: {}
	  }

export function writeTokens(tokens: ServiceTokens) {
	console.log("🚀 ~ tokens", tokens)
	const currentTokens = readTokens()
	const newTokens = {
		...tokens,
		...currentTokens,
	}
	jsonfile.writeFileSync("./src/auth/tokens.json", newTokens)
}

export function readTokens() {
	return jsonfile.readFileSync("./src/auth/tokens.json")
}

import jsonfile from "jsonfile"

type ServiceTokens =
	| {
			spotifyTokens: {}
	  }
	| {
			appleMusicTokens: {}
	  }

export function writeTokens(tokens: ServiceTokens) {
	console.log("🚀 ~ tokens", tokens)
	const currentTokens = jsonfile.readFileSync("./src/auth/tokens.json")
	const newTokens = {
		...tokens,
		...currentTokens,
	}
	jsonfile.writeFileSync("./src/auth/tokens.json", newTokens)
}

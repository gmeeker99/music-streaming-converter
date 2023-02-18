import jsonfile from "jsonfile"

type MusicService = "spotify" | "appleMusic"

type TokensCommon = {
	accessToken?: string
	refreshToken?: string
}

export type Tokens = TokensCommon &
	(
		| { accessToken: string; refreshToken: string }
		| { accessToken: string }
		| { refreshToken: string }
	)

const TOKEN_PATH = "./src/auth/tokens.json"

export function writeTokens(service: MusicService, tokens: Tokens) {
	let allTokens

	try {
		allTokens = jsonfile.readFileSync(TOKEN_PATH)
	} catch (error) {
		console.log(error)
		return
	}

	let newTokens
	if (service === "spotify") {
		newTokens = {
			...allTokens,
			spotifyTokens: {
				...allTokens.spotifyTokens,
				...tokens,
			},
		}
	} else if (service === "appleMusic") {
		newTokens = {
			...allTokens,
			appleMusicTokens: {
				...allTokens.appleMusicTokens,
				...tokens,
			},
		}
	}

	jsonfile.writeFileSync(TOKEN_PATH, newTokens)
}

export function readTokens(service: MusicService) {
	if (service === "spotify") {
		const { spotifyTokens } = jsonfile.readFileSync(TOKEN_PATH)
		return spotifyTokens
	} else if (service === "appleMusic") {
		const { appleMusicTokens } = jsonfile.readFileSync(TOKEN_PATH)
		return appleMusicTokens
	}
}

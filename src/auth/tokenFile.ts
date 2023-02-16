import { writeFileSync, readFileSync } from "fs"

type Tokens = {
	authToken: string
	accessToken: string
	refreshToken: string
}

const { pathname: TOKEN_PATH } = new URL("tokens.json", import.meta.url)

export function writeTokens(tokens?: Tokens) {
	if (!tokens) {
		const blankTokens: Tokens = {
			authToken: "",
			accessToken: "",
			refreshToken: "",
		}

		writeFileSync(TOKEN_PATH, JSON.stringify(blankTokens))
		return
	} else {
		writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
	}
}

export function readTokens() {
	try {
		const tokensString = readFileSync(TOKEN_PATH, { encoding: "utf-8" })
		const tokenObject = JSON.parse(tokensString)
		return tokenObject
	} catch (error) {
		writeTokens()
		return null
	}
}

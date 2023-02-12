import { writeFileSync, readFileSync, read } from "fs"

type Tokens = {
	accessToken: string
	refreshToken: string
}

const { pathname: TOKEN_PATH } = new URL("tokens.json", import.meta.url)

export function saveTokens(tokens?: Tokens) {
	if (!tokens) {
		const blankTokens: Tokens = {
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
		saveTokens()
		return null
	}
}

readTokens()

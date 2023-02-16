import express from "express"
import { getSpotifyTokens } from "./spotify.auth.js"
import { writeTokens } from "./tokenFile.js"

const PORT = 3000

const app = express()

app.get("/callback", async (req, res) => {
	const { code } = req.query
	const authToken = String(code)

	writeTokens({
		authToken,
		accessToken: "",
		refreshToken: "",
	})

	try {
		const results = await getSpotifyTokens()
		res.send(results)
	} catch (e) {
		res.send(e)
	}

	process.exit(0)
})

app.listen(PORT, () => {
	console.log(`Server Running on port ${PORT} on PID: ${process.pid}`)
})

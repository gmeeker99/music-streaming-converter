import express from "express"
import { writeTokens } from "./tokenFile.js"

const PORT = 3000

const app = express()

app.get("/callback", (req, res) => {
	const { code } = req.query
	const accessToken = String(code)

	writeTokens({
		accessToken,
		refreshToken: "",
	})

	res.send("success")

	process.exit(0)
})

app.listen(PORT, () => {
	console.log(`Server Running on port ${PORT} on PID: ${process.pid}`)
})

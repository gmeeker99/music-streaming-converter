import express from "express"
import { writeTokens } from "./tokenFile.js"

const app = express()

app.get("/callback", (req, res) => {
	console.log(req.query)
	res.send("success")
	process.exit(1)
})

app.get("/test", (req, res) => {
	res.send("hello")
})

app.listen(3000, () => {
	console.log(`Server Running on port ${8080} on PID: ${process.pid}`)
})

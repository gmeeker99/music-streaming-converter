import express from "express"

const PORT = 3000

const app = express()

app.get("/callback", async (req, res) => {
	const { code } = req.query
	const authToken = code as string
	res.json({ status: "success" })

	process.send(authToken)
	console.log(`Server Killed on port ${PORT} on PID: ${process.pid}`)
	process.exit(0)
})

app.listen(PORT, () => {
	console.log(`Server Running on port ${PORT} on PID: ${process.pid}`)
})

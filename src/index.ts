import dotenv from "dotenv"
dotenv.config()
import { testAuthorization } from "./auth/spotify.auth.js"

await testAuthorization()

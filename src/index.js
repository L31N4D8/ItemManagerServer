import db from "./db"
import api from "./api"
import app from "./app"

const server = app(api(db(process.env.DB_FILE)))
server.listen(process.env.PORT)
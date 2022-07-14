const express = require('express')
const app = express()

app.use(express.json())

const loginRouter = require("./routes/login")

app.listen(8080)
app.use("/login", loginRouter)
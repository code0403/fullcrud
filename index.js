const express = require("express");
const dotenv =  require("dotenv")
dotenv.config();
const cors = require("cors")

const { connection } = require("./config/db");
const { auth } = require("./middleware/auth.middleware");
const { noteRouter } = require("./routes/notes.routes");
const { UserRouter } = require("./routes/user.routes");

const app = express()
app.use(express.json()) // middlewares
app.use(cors())


app.use("/users", UserRouter)

app.use(auth) // middleware
app.use("/notes", noteRouter)


app.listen(process.env.PORT, async () => {

    try {
        await connection
        console.log("Server is running!")
    } catch (error) {
        console.log(err)
        console.log("Connect to MongoDb")
    }
    console.log(`server started on port ${process.env.PORT}`)
})
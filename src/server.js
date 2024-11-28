const express = require("express")
const cors = require("cors")
const app = express()

const port = 3000

const routes = require("./routes")

app.use(express.json())
app.use(cors())
app.use(routes)

app.get("/", (req,res)=>{
    res.send("Continue the hard Work!")
})

app.listen(port, (req, res)=> {
    console.log("Server running at the port "+ port)
})

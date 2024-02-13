import express from "express"
import cors from "cors"
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.post("/register", (req, res) => {
  const { name, email, password } = req.body
  res.json({ name, email, password })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

import express from "express"
import cors from "cors"
import connectDB from "./db/db.js"
import bcrypt from "bcrypt"
const app = express()
const port = 3000
import User from "./models/User.js"
app.use(express.json())
app.use(cors())
const bcryptSalt = bcrypt.genSaltSync(10)
app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt)
    })
    res.json(userDoc)
  } catch (error) {
    console.log(error.message)
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

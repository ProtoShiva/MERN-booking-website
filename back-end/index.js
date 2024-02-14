import express from "express"
import cors from "cors"
import connectDB from "./db/db.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import jwt from "jsonwebtoken"
const app = express()
const port = 3000
import User from "./models/User.js"
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173"
  })
)
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
    res.status(422).json(error)
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        process.env.jwtSecret,
        {},
        (err, token) => {
          if (err) throw err
          res.cookie("jwtToken", token).json("pass Ok")
        }
      )
    } else {
      res.status(422).json("pass not ok")
    }
  } else {
    res.json("not found")
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

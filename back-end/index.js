import express from "express"
import cors from "cors"
import connectDB from "./db/db.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import User from "./models/User.js"
import Place from "./models/Place.js"
import imageDownloader from "image-downloader"
import mongoose from "mongoose"
import multer from "multer"
import fs from "fs"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = 3000
app.use("/uploads", express.static(__dirname + "/uploads"))
app.use(express.json())
app.use(cookieParser())
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
          res.cookie("jwtToken", token).json(userDoc)
        }
      )
    } else {
      res.status(422).json("pass not ok")
    }
  } else {
    res.json("not found")
  }
})

app.get("/profile", (req, res) => {
  const { jwtToken } = req.cookies
  if (jwtToken) {
    jwt.verify(jwtToken, process.env.jwtSecret, {}, async (err, userData) => {
      if (err) throw err
      const { name, email, _id } = await User.findById(userData.id)
      res.json({ name, email, _id })
    })
  }
})

app.post("/logout", (req, res) => {
  res.cookie("jwtToken", "").json(true)
})

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body
  const newName = "photo" + Date.now() + ".jpg"
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName
  })

  res.json(newName)
})

const photosMiddleware = multer({ dest: "uploads/" })
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i]
    const parts = originalname.split(".")
    const ext = parts[parts.length - 1]
    const newPath = path + "." + ext
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace("uploads\\", ""))
  }
  res.json(uploadedFiles)
})

app.post("/places", (req, res) => {
  const { jwtToken } = req.cookies
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests
  } = req.body
  jwt.verify(jwtToken, process.env.jwtSecret, {}, async (err, userData) => {
    if (err) throw err
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests
    })
    res.json(placeDoc)
  })
})

app.get("/places", (req, res) => {
  const { jwtToken } = req.cookies
  jwt.verify(jwtToken, process.env.jwtSecret, {}, async (err, userData) => {
    const { id } = userData
    res.json(await Place.find({ owner: id }))
  })
})

app.get("/places/:id", async (req, res) => {
  const { id } = req.params
  res.json(await Place.findById(id))
})

app.put("/places", async (req, res) => {
  const { jwtToken } = req.cookies
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests
  } = req.body
  jwt.verify(jwtToken, process.env.jwtSecret, {}, async (err, userData) => {
    if (err) throw err
    const placeDoc = await Place.findById(id)
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests
      })
      await placeDoc.save()
      res.json("ok")
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

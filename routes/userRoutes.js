const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../model/Users')
const jwt = require('jsonwebtoken')
//Register

const secreteKey = "s3jkjkfksknkxcfkldfjldksflkfjl123124";

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ stats: false, message: "all files are require" })

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ stats: false, message: "Email already registered" })

    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    return res.status(201).json({ status: true, message: "register successfully" })
  } catch (error) {
    return res.status(201).json({ status: false, message: "something went wrong", error: error.message })
  }
})

//Login
router.post('/login', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ stats: false, message:
       "all files are require" })

    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ stats: true, message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secreteKey, { expiresIn: "10hr" })

    res.cookie('authToken', token, {
      httpOnly:true,
      secure:true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, //1hr
    })

    return res.status(201).json({ status: true, message: "Login successfully" })
  } catch (error) {
    return res.status(201).json({ status: false, message: "Something went wrong", error: error.message })
  }
})

//profile
router.post('/profile', async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    // const token = req.headers.cookie?.split('=')[1]

    // const token = req.cookies
    // console.log(token)
    
    if (!token) return res.status(400).json({ status: false, message: "Access Denied" })

    jwt.verify(token, secreteKey, async (err, decode) => {
      const user = await User.findById(decode?.id)
      if(!user) return res.status(201).json({ status: false, message: "Invalid Token" })
      const userData = {
        id: user?.id,
        name:user?.name,
        email:user?.email
      }
      return res.status(201).json({ status: true, message: "Profile Data", data: userData })
    })

  } catch (error) {
    return res.status(201).json({ status: false, message: "Something went wrong", 
      error: error.message })
  }
})
module.exports = router;
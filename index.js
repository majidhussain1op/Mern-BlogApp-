const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors") 
require('dotenv').config();
var cookieParser = require('cookie-parser')

const useRouter = require('./routes/userRoutes')

const app = express();

app.use(express.json())

app.use(cors ({
  origin:true,
  credentials:true
}))

app.use(cookieParser())


app.get('/', (req, res) => {
  res.send("server is running");
  })

  app.use('/user', useRouter)

  mongoose.connect(process.env.DATABASE_URL)
  .then(()=>console.log("DB is connected successfully"))
  .catch((err)=>console.log("failed to connect DataBase", err));
  

app.listen(3000, () =>{
  console.log("server is running...3000");
  
})
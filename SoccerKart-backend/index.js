const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const User1 = require("./models/users")
const authRoutes = require('./routes/authRoute.js');
const {hashPassword, comparePassword } = require('./helpers/authHelper.js')
const JWT = require("jsonwebtoken");
const {requireSignIn, isAdmin} = require("./middleware/authMiddleware.js");
// const router = require("./routes/authRoute.js");
const categoryRoutes = require('./routes/categoryRoutes.js')
const productRoutes = require('./routes/productRoutes.js')


//configure env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    User1.findOne({ email: email})
    .then(async (user) => {
      if(user) {
        const isMatch = await comparePassword(password, user.password);
        if(isMatch){
          const token = JWT.sign(
            {
              userID: user._id, email: user.email
            }, JWT_SECRET,
            {expiresIn: '7d'}
          );
          res.status(200).json({
            message: "Login successful.",
            token: token,
            user: { 
              id: user._id, 
              name: user.name, 
              email: user.email, 
              role: user.role // Include the role of the user
            }
          });
          

        }else{
          res.json("The password is incorrect");
        }
      }else{
        res.json("No record exists")
      }
    })

})

app.post('/register', (req, res) => {
  const { name, email, password, answer } = req.body;

    User1.findOne({email}).
    then(existingUser => {
      if(existingUser) {
        return res.status(400).json({error : "User already exists"});
      }

      return hashPassword(password)
      .then(hashPassword => {
        return User1.create({
          name,
          email, 
          password: hashPassword,
          answer,
        });
      })
      .then(newUser => {
        res.status(201).json({message:  "User Registered Successfully", user: newUser});
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({error: "Internal Server error."})
    })

})

app.get('/user/dashboard', requireSignIn, (req, res) => {
  res.send(`Welcome, ${req.user.email}, to your dashboard`);
})

app.get("/admin/dashboard", requireSignIn, isAdmin, (req, res) => {
  res.send("Admin Page");
})

app.post('/forgot-password', async (req, res) => {
  try {
    const {email, answer, newPassword} = req.body;
    if(!email){
     return res.status(400).send({message: 'Email is required'})
    }
    if(!newPassword){
      return res.status(400).send({message: 'Password is required'})
    }
    if(!answer){
     return res.status(400).send({message: 'Answer is required'})
    }
    //check
    const user = await User1.findOne({email, answer});
    //validation
    if(!user){
      return res.status(404).send({
        success: false,
        message: 'Wrong mail or answer',
      })

    }
    console.log(answer);
    const hashed = await hashPassword(newPassword);
    await User1.findByIdAndUpdate(user._id, {password: hashed});
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    })
  }
})

app.get("/userauth", requireSignIn, (req, res) => {
  try {
    console.log("Sending Response...");
    // console.log("Response Sent");
   return res.status(200).json({ message: "Login Successful", ok: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
app.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  try {
    console.log("Sending Response...");
    // console.log("Response Sent");
   return res.status(200).json({ message: "Login Successful", ok: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


app.get('/register', (req, res) => {
    res.send("Lionel Messi");
})
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})
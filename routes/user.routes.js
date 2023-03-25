const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt")
const dotenv =  require("dotenv")
dotenv.config();

const jwt = require("jsonwebtoken")

const {UserModel} = require("../models/user.model")

//registration
UserRouter.post("/register", async (req, res) => {
    
    const {email, password, name, location, age} = req.body

    try {

        bcrypt.hash(password, 5, async(err, hash) => {
            // console.log({password:hash})
            const user = new UserModel({email, password:hash, name, location, age})
            await user.save()
            res.status(200).send({"msg" :"Registraion is Succesfull!"}) 
        })

    } catch (error) {
      res.status(400).send({"msg" : error.message})  
    }
})


//login(Authnetication)
UserRouter.post("/login" , async (req, res) => {

    const {email, password} = req.body
    
    try {
       const usersData = await UserModel.find({email:email})
       console.log(usersData[0])
       
       if(usersData.length >= 0){
        bcrypt.compare(password, usersData[0].password, (err, result) => {
            if(result){
                res.status(200).send({"msg" : "Login Successsfull", "token" : jwt.sign({ "userID": usersData[0]._id }, 'mischieve Managed')})
            } else {
                res.status(400).send({"msg" :" Wrong Credentials \n Login is UnSuccesfull!"})
            }
        });
       }

    } catch (error) {
        res.status(400).send({"msg" : error.message})    
    }
})


// UserRouter.get("/details", (req, res) => {

//     const token = req.headers.Authoriastion
    
//     jwt.verify(token, 'mischieve Managed', (err, decoded) => {
//         console.log(decoded.foo) // bar

//         decoded ? res.status(200).send("User Details") :  res.status(400).send({"msg" : "Invalid details"})
//       });
// })


// UserRouter.get("/movies", (req, res) => {

//     const {token} = req.query
//     if(token === "tkken4567"){
//         res.status(200).send("Movie Details")
//     } else {
//         res.status(400).send({"msg" : "Invalid details"})
//     }
// })

module.exports = { UserRouter };
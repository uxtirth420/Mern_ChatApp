const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const generateToken = require('../config/generateToken');


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name, 
        email,
        password, 
        pic,
    });
    
    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
        
    }  else {
        res.status(400);
        throw new Error("Failed to Create the User");
    }
});

    const authUser = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {    // for match password (function)
            res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
        }else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    })

    //  /api/user?search=any
    const allUsers = asyncHandler(async (req, res) => {
         const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
         const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
         const keyword = search ? {
            $or: [                                                         // or operator performs a logical OR operation on an array of two or more <expression> and selects the documents that satisfy at least one of the <expression>
                { name: { $regex: escapedSearch, $options: "i"} },      // options is for case sensitive.
                { email: { $regex: escapedSearch, $options: "i"} },     // and in these is like that when the i matches in the name and email field then that recieved in json and on response.
            ]                                         
         }
         : {};

         const users = await User.find(keyword).find({ _id: { $ne: req.user._id }});                                   // 
         res.send(users);

         console.log(keyword);
    } )

module.exports = { registerUser, authUser, allUsers }
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken";


const adminLogin= asyncHandler(async (req, res) =>{   
    const {email,password}= req.body;

    if(!email || !password){
        throw new ApiError(400, "Please enter both the fields")
    }

    if(email !== process.env.ADMIN_EMAIL){
        throw new ApiError(401,"Incorrect Email")
    }

    if(password !== process.env.ADMIN_PASSWORD){
        throw new ApiError(401,"Incorrect Password")    
    }

    //Generating token
    const tokenPayload = { role: "admin", email }; // You can add more data
    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h", // expires in 1 hour
    });    
     
    res
      .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // HTTPS in production
          sameSite: "strict",
          maxAge: 60 * 60 * 1000 // 1 hour
      })
      .status(200)
      .json(new ApiResponse(200, { token: accessToken }, "WELCOME ADMIN"));
});

const createUser= asyncHandler(async(req,res)=>{
    const {name, studentNumber, email, branch} = req.body;

    if( [name,email,studentNumber,branch].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    if (!email.endsWith('@akgec.ac.in')) {
        throw new ApiError(400, "Must Enter College Email Id Only");
    }

     if (!(studentNumber.startsWith('23') || studentNumber.startsWith('24'))) {
        throw new ApiError(401, "Unauthorized student Number");
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
        throw new ApiError(401, "User Already added");
    }

    try {

        const user=await User.create({
            name,
            email,
            branch,
            studentNumber
        })

        if(!user){
            throw new ApiError(500, "Something went wrong while creating the user")
        }

        return res.status(201).json( new ApiResponse(200, user,"User added successfully"))
        
    } catch (error) {
        console.log("User Creation failed");

        throw new ApiError(500, "Something went wrong while making the user");
    }

});

const getUser = asyncHandler(async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({}).sort({ createdAt: -1 }); // newest first

        return res
            .status(200)
            .json(new ApiResponse(200, users, "All users fetched successfully"));
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new ApiError(500, "Something went wrong while fetching users");
    }
});



export {adminLogin, createUser, getUser}
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"


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


export {adminLogin}
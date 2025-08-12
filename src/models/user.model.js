import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: [true,"full name is required"],
        index:true,
        trim: true
    },
    studentNumber:{
        type: String,
        required: [true, "Student Number is required"],
        unique:true,
        trim:true
    },
    email:{
        type: String,
        required: [true,"email is required"],
        unique:true,
        lowercase: true,
        trim: true
    },
    branch: {
        type: String,
        required: [true, "branch is required"]
      },
    },
    { timestamps: true }
)

export const User= mongoose.model("User", userSchema)
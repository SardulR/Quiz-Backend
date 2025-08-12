import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies.accessToken ||
        req.body.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decodedToken.role !== "admin") {
            throw new ApiError(403, "Forbidden: Not an Admin");
        }

        req.admin = decodedToken; // store token payload for use in routes
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
});

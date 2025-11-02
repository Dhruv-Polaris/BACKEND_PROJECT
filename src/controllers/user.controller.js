import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    const {fullName,email,username,password}  = req.body;
    console.log("email:",email);

    //validation - not empty
    if(
        [fullName,email,username,password].some((field)=>field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are required");
    }

    // check if  user already exists
    const existingUser = User.findOne({$or: [{email},{username}]})

    if(existingUser){
        throw new ApiError(409,"User already exists with provided email or username");
    }

    // check fro images,check for avatar
    const avatarLocalPath = req.files.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError (400,"Avatar image is required");
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500,"Error in uploading avatar image");
    }

    //create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username:username.toLowerCase(),
        password
    }); 

    //remove password and refresh token field from response
    const createdUser =  await user.findById(user._id).select("-password -refreshToken");

     //check for user creation 
    if(!createdUser){
        throw new ApiError(500,"User registration failed, please try again");
    }

    // return response
    return res.status(201).json(new ApiResponse(201,"User registered successfully",createdUser));
});

export {registerUser};
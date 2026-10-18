import { User } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";

const toClientUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    avatar: user.avatar,
    createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
    const { name, email, password, company } = req.body;

    if (!name || !email || !password || !company) {
        throw new ApiError(
            400,
            "Please provide all required fields"
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({
        email: normalizedEmail,
    });

    if (exists) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        company,
    });

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: toClientUser(user),
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(
            400,
            "Please provide email and password"
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
    }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: toClientUser(user),
    });
});

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: toClientUser(req.user),
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        avatar,
        password,
        company,
    } = req.body;

    const user = req.user;

    if (name) {
        user.name = name;
    }

    if (email) {
        user.email = email.toLowerCase().trim();
    }

    if (avatar !== undefined) {
        user.avatar = avatar;
    }

    if (password) {
        user.password = password;
    }

    if (company !== undefined) {
        user.company = company;
    }

    await user.save();

    res.status(200).json({
        success: true,
        user: toClientUser(user),
    });
});
import { User } from "../models";
import { Request, Response } from "express";
import {
    signupSchema,
    signinSchema,
    asyncHandler,
    ApiError,
    ApiResponse,
} from "../utils";

const signup = asyncHandler(async (req : Request, res:Response) => {
    const validInput = signupSchema.safeParse(req.body);

    if (!validInput.success) {
        const errorMessage = validInput.error.errors
            .map((e) => e.message)
            .join(", ");
        throw new ApiError(411, errorMessage || "Invalid Formate");
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
        throw new ApiError(500, "Username is taken");
    }

    await User.create({
        username,
        password,
    });

    res.status(200).json(
        new ApiResponse(200, null, "User created successfully")
    );
});

const signin = asyncHandler(async (req : Request, res:Response) => {
    const validInput = signinSchema.safeParse(req.body);

    if (!validInput.success) {
        const errorMessage = validInput.error.errors
            .map((e) => e.message)
            .join(", ");
        throw new ApiError(411, errorMessage || "Invalid Formate");
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "Username is not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = user.generateAccessToken();

    const option = {
        httpOnly: true,
        secure: true,
    };

    res.status(200)
        .cookie("accessToken", token, option)
        .json(
            new ApiResponse(
                200,
                { token, username },
                "User logged in successfully"
            )
        );
});

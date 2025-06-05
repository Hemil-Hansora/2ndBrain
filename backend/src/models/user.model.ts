import  { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
    username: string;
    password: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err as Error);
    }
});

userSchema.methods.isPasswordCorrect = async function (
    this: IUser,
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: IUser): string {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "3days" }
    );
};

export const User = model<IUser>("User", userSchema);

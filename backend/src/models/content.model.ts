import mongoose, { Schema, model } from "mongoose";

const contentModel = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        link: {
            type: String,
            default: "",
            trim: true,
        },
        content: {
            type: String,
            default: "",
            trim: true,
        },
        type: {
            type: String,
            enum: ["link", "youtube", "tweet", "note"],
            required: true,
        },
        tags: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Tag",
            },
        ],
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Content = model("Content", contentModel);

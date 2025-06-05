import mongoose, { Schema, model } from "mongoose";

const contentModel = new Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
    },
    content: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    type :{
        type : String,
        enum : ['link','note'],
        required : true
    },
    tag: [
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
});

export const Content = model("Content", contentModel);

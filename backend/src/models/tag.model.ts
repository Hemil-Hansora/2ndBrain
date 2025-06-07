import mongoose, { Schema, model } from "mongoose";

const tagModel = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
},{timestamps:true});

export const Tag = model("Tag",tagModel)
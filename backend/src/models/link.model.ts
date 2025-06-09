import mongoose , {Schema,model} from "mongoose";

const linkModel = new Schema({
    hash : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    }
})

export const Link = model("Link",linkModel) 
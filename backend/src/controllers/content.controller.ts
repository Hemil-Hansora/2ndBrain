import mongoose from "mongoose";
import { User, Content, Tag } from "../models";
import { ApiError, ApiResponse, asyncHandler, contentSchema ,AuthRequest} from "../utils";

const addContent = asyncHandler(async (req : AuthRequest, res) => {
    const validInput = contentSchema.safeParse(req.body);

    if (!validInput.success) {
        const errorMessage = validInput.error.errors
            .map((e) => e.message)
            .join(", ");
        throw new ApiError(411, errorMessage || "Invalid Formate");
    }

    let { title, link, content, type, tags } = validInput.data;

    if(type !== "note" && !link){
        throw new ApiError(411, "Please provide link")
    }

    if (!link && !content) {
        throw new ApiError(411, "Please provide contant !");
    }

    let tagId: mongoose.Types.ObjectId[] = [];


    for(const tag of tags ?? []){
        const findTag = await Tag.findOne({ title: tag });
        if (!findTag) {
            const newTag = await Tag.create({ title: tag });

            tagId.push(newTag._id);
        } else {
            tagId.push(findTag?._id);
        }
    }

    const  createContent = await Content.create({
        title ,
        link,
        content,
        type,
        tags : tagId,
        userId : req.user?._id
    }) 

    if(!createContent){
        throw new ApiError(500 , "Somthing wrong while creating new Content")
    }

    res.status(200).json(
        new ApiResponse(200 , createContent,"new Content created successfully")
    )
});

export { addContent };

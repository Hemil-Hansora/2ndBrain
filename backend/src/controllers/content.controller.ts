import mongoose, { isValidObjectId } from "mongoose";
import { User, Content, Tag } from "../models";
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    contentSchema,
    AuthRequest,
} from "../utils";
import { title } from "process";

const addContent = asyncHandler(async (req: AuthRequest, res) => {
    const validInput = contentSchema.safeParse(req.body);

    if (!validInput.success) {
        const errorMessage = validInput.error.errors
            .map((e) => e.message)
            .join(", ");
        throw new ApiError(411, errorMessage || "Invalid Formate");
    }

    let { title, link, content, type, tags } = validInput.data;

    if (type !== "note" && !link) {
        throw new ApiError(411, "Please provide link");
    }

    if (!link && !content) {
        throw new ApiError(411, "Please provide contant !");
    }

    let tagId: mongoose.Types.ObjectId[] = [];

    for (const tag of tags ?? []) {
        const findTag = await Tag.findOne({ title: tag });
        if (!findTag) {
            const newTag = await Tag.create({ title: tag });

            tagId.push(newTag._id);
        } else {
            tagId.push(findTag?._id);
        }
    }

    const createContent = await Content.create({
        title,
        link,
        content,
        type,
        tags: tagId,
        userId: req.user?._id,
    });

    if (!createContent) {
        throw new ApiError(500, "Somthing wrong while creating new Content");
    }

    res.status(200).json(
        new ApiResponse(200, createContent, "new Content created successfully")
    );
});

const deleteContent = asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    console.log(id);
    const user = req.user;

    if (!isValidObjectId(id)) {
        throw new ApiError(411, "Invalid Id");
    }

    const content = await Content.findById(id);
    console.log(content);

    if (!content) {
        throw new ApiError(404, "Content not found !");
    }

    if (content.userId?.toString() !== user?._id?.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this Content"
        );
    }

    const deleted = await Content.findByIdAndDelete(id);

    if (!deleted) {
        throw new ApiError(500, "Fail to delete Content");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleted, "Content deleted successfully"));
});

const getContent = asyncHandler(async (req: AuthRequest, res) => {
    const user = req.user;

    const content = await Content.find({
        userId: user?._id,
    });

    if (!content) {
        throw new ApiError(404, "content not found");
    }

    const getContent = await Content.find({ userId: user?._id })
        .populate("tags", "title _id")
        .populate("userId", "username _id");

    // const getContent = await Content.aggregate([
    //     {
    //         $match: {
    //             userId: user?._id,
    //         },
    //     },
    //     {
    //         $lookup: {
    //             from: "tags",
    //             localField: "tags",
    //             foreignField: "_id",
    //             as: "tags",
    //             pipeline: [
    //                 {
    //                     $project: {
    //                         title: 1,
    //                         _id: 1,
    //                     },
    //                 },
    //             ],
    //         },
    //     },
    //     {
    //         $project: {
    //             title: 1,
    //             link: 1,
    //             content: 1,
    //             type: 1,
    //             tags: 1,
    //             userId: 1,
    //         },
    //     },
    // ]);
    // console.log("content2 \n" + content2);


    return res
        .status(200)
        .json(new ApiResponse(200, getContent, "Content fetch successfuly"));
});

export { addContent, deleteContent, getContent };

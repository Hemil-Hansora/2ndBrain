import { Content, Link } from "../models";
import { ApiError, ApiResponse, asyncHandler, AuthRequest } from "../utils";
import { v4 as uuidv4 } from "uuid";

const toggleShare = asyncHandler(async (req: AuthRequest, res) => {
    const { share } = req.body;

    if (typeof share !== "boolean") {
        throw new ApiError(400, "`share` must be a boolean value");
    }

    const existingLink = await Link.findOne({
        userId: req.user?._id,
    });

    if (!share) {
        if (!existingLink) {
            throw new ApiError(404, "No active share link to delete.");
        }

        await Link.findByIdAndDelete(existingLink._id);
        return res
            .status(200)
            .json(
                new ApiResponse(200, null, "Share link removed successfully.")
            );
    }

    if (existingLink) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {hash : existingLink.hash},
                    "Share link already active."
                )
            );
    }

    const newLink = await Link.create({
        hash: uuidv4(),
        userId: req.user!._id,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {hash : newLink.hash},
                "Share link generated successfully."
            )
        );
});

const shareLink = asyncHandler(async (req, res) => {
    const { shareLink } = req.params;

    if (!shareLink) {
        throw new ApiError(401, "Please provide valid share link");
    }

    const link = await Link.findOne({ hash: shareLink }).populate(
        "userId",
        "username _id"
    );

    if (!link) {
        throw new ApiError(411, "Sorry incorrect link");
    }

    console.log(link);

    const content = await Content.find({
        userId: link.userId,
    });

    if (!content) {
        throw new ApiError(400, "Content not exist !");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: link.userId, content },
                "Content fetch successfully"
            )
        );
});

export { toggleShare, shareLink };

import { z } from "zod";

export const signupSchema = z.object({
    username: z
        .string()
        .min(4, { message: "username must be at least 4 characters long " })
        .max(15, { message: "username must be at most 15 characters long" })
        .regex(/^\S*$/, { message: "spaces are not allowed" }),

    password: z
        .string()
        .min(6, { message: "password must be at least 6 characters long " })
        .max(15, { message: "password must be at most 15 characters long" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
            message: "Password must contain at least 1 special character",
        })
        .refine((val) => [...val].some((char) => char >= "A" && char <= "Z"), {
            message: "Must include at least one capital letter",
        }),
});

export const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid ObjectId",
});
export const contentSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    content: z.string().optional().or(z.literal("")),
    type: z.enum(["link", "youtube", "tweet", "note"]),
    tags: z.array(z.string()).optional(),
});

export const searchSchema = z.object({
    query: z.string().min(1, { message: "Search query is required" }),
});

export const shareSchema = z.object({
    share: z.boolean(),
});

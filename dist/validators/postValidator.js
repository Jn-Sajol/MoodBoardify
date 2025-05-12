"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const zod_1 = require("zod");
exports.postSchema = zod_1.z.object({
    mood: zod_1.z.string().min(1, "Mood is required"),
    message: zod_1.z.string().min(1, "Message is required"),
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByPost = exports.createComment = exports.getAllPublicPosts = exports.createPost = void 0;
const db_config_1 = require("../Db/db.config");
const postValidator_1 = require("../validators/postValidator");
const appError_1 = require("../utils/appError");
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validation = postValidator_1.postSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.format() });
        return;
    }
    const { mood, message } = validation.data;
    const moodValue = req.body.mood;
    try {
        const post = yield db_config_1.prisma.post.create({
            data: {
                userId: Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
                mood: moodValue,
                message,
            },
        });
        res.status(201).json({ success: true, post });
    }
    catch (error) {
        next(new appError_1.AppError("Failed to create post", 500));
    }
});
exports.createPost = createPost;
const getAllPublicPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield db_config_1.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true },
                },
                comments: {
                    include: {
                        user: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        res.json({ success: true, posts });
    }
    catch (error) {
        next(new appError_1.AppError("Failed to fetch posts", 500));
    }
});
exports.getAllPublicPosts = getAllPublicPosts;
//comment segment
/** CREATE COMMENT */
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, content } = req.body;
    if (!postId || !content) {
        res.status(400).json({ error: "postId and content are required" });
        return;
    }
    try {
        const comment = yield db_config_1.prisma.comment.create({
            data: {
                postId: Number(postId),
                userId: Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
                content,
            },
        });
        res.status(201).json({ success: true, comment });
    }
    catch (error) {
        next(new appError_1.AppError("Failed to create comment", 500));
    }
});
exports.createComment = createComment;
/** GET COMMENTS FOR A POST */
const getCommentsByPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postId);
    if (!postId) {
        res.status(400).json({ error: "Invalid post ID" });
        return;
    }
    try {
        const comments = yield db_config_1.prisma.comment.findMany({
            where: { postId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" },
        });
        res.json({ success: true, comments });
    }
    catch (error) {
        next(new appError_1.AppError("Failed to fetch comments", 500));
    }
});
exports.getCommentsByPost = getCommentsByPost;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const db_config_1 = require("../Db/db.config");
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Authorization token is missing",
            });
            return;
        }
        const secretKey = process.env.JWT_SECRET || "secretkey"; // Use environment variables for better security
        const verifyToken = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield db_config_1.prisma.user.findUnique({ where: { id: +verifyToken.id } });
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        req.user = user; // Attach user to request object for use in subsequent middleware or routes
        next();
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token",
        });
        return;
    }
});
exports.userAuth = userAuth;

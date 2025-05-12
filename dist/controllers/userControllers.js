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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkauth = exports.getSingleUserWithMoods = exports.loginUser = exports.createUser = void 0;
const db_config_1 = require("../Db/db.config");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return next(new appError_1.AppError("name, email, and password are required", 400));
        }
        const checkDuplicate = yield db_config_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, { name }],
            },
        });
        if (checkDuplicate) {
            res.send("User already exists with this email or name");
            return;
        }
        console.log(" till this one");
        const newUser = yield db_config_1.prisma.user.create({
            data: {
                name,
                email,
                password: (0, bcrypt_1.hashSync)(password, 10),
            },
        });
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            success: true,
            message: "User has been created",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        next(new appError_1.AppError("Server error", 500));
    }
});
exports.createUser = createUser;
//user Login
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return next(new appError_1.AppError("Email and password are required", 400));
        }
        const user = yield db_config_1.prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            return next(new appError_1.AppError("User not found", 404));
        }
        const valid = yield (0, bcrypt_1.compare)(password, user.password);
        if (!valid) {
            return next(new appError_1.AppError("Invalid credentials", 401));
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, "secretkey", {
            expiresIn: "24h",
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        next(new appError_1.AppError("Server error", 500));
    }
});
exports.loginUser = loginUser;
//User Forgot Password
// export const forgotPassword = async (req:Request, res:Response, next:NextFunction) =>{
// const email = req.body;
// const checkUser = await prisma.user.findUnique({
//   where:{
//     email
//   }
// })
// //check user
// if(!checkUser){
//   return next(new AppError('user not found',404))
// }
// // return a code to the email
// }
//getSingleUserWithMoods
const getSingleUserWithMoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield db_config_1.prisma.user.findUnique({
            where: { id: Number(id) },
            include: {
                moods: true,
            },
        });
        if (!user) {
            return next(new appError_1.AppError("User not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "User fetch in successfully",
            user: user,
        });
    }
    catch (error) {
        next(new appError_1.AppError("Server error", 500));
    }
});
exports.getSingleUserWithMoods = getSingleUserWithMoods;
//check protected route
const checkauth = (req, res, next) => {
    res.send("yes this is protected route");
};
exports.checkauth = checkauth;

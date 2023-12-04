import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import dotenv from 'dotenv'
dotenv.config();

const protect = (async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log(token)

            const decoded = jwt.verify(token, process.env.secret);
            // console.log(decoded)

            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an Admin");
    }
};
const superadmin = (req, res, next) => {
    if (req.user && req.user.isSuperAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an SuperAdmin");
    }
};
export { protect, admin, superadmin };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction):void => {
  console.log('hiii')
  const token = req.cookies.token;
console.log(token)
  if (!token) {
     res.status(401).json({ status: false, message: "Unauthorized" });
     return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
} catch (error: any) {
    console.error("JWT Verification Error:", error.name, error.message);

    let message = "Invalid token";
    
    if (error.name === "TokenExpiredError") {
        message = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
        message = "Invalid token signature";
    } else if (error.name === "NotBeforeError") {
        message = "Token is not active yet";
    }

    res.status(403).json({ status: false, message });
}

};

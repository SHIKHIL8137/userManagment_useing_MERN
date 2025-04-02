import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const preventAuthPages = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET); 
      return res.redirect("/"); // 
    } catch (error) {
      console.error("JWT Verification Failed:", error);
    }
  }  
  next(); 
};

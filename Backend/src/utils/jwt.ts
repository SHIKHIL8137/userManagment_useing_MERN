import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET as string

export const generateToken = (userID :string):string=>{
return jwt.sign({userID},JWT_SECRET_KEY,{
  expiresIn: "1m"
})
}
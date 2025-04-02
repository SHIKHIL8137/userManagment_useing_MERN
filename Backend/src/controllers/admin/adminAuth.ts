import { Request, Response } from "express";
import { validate } from "../../public/validation";
import { UserAdmin } from "../../model/userAdminModel";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";


export const SignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;


    const nameValidation = validate("name", name);
    if (!nameValidation.isValid) {
     res.status(400).json({ status: false, message: nameValidation.message });
     return 
    }

    const emailValidation = validate("email", email);
    if (!emailValidation.isValid) {
       res.status(400).json({ status: false, message: emailValidation.message });
       return
    }

    const passwordValidation = validate("password", password);
    if (!passwordValidation.isValid) {
       res.status(400).json({ status: false, message: passwordValidation.message });
       return
    }

    const user = await UserAdmin.findOne({ email ,role:'admin'});
    if (user) {
      res.status(409).json({ status: false, message: "User already exists" });
      return 
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserAdmin({
      name,
      email,
      password: hashedPassword, 
      role: "admin",
    });

    await newUser.save();
    res.status(201).json({ status: true, message: "User registered successfully" });
    return 

  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
    return 
  }
};


export const LogIn = async(req:Request,res:Response):Promise<void>=>{
try {

  const {email,password} = req.body;
  const emailValidation = validate("email", email);
    if (!emailValidation.isValid) {
       res.status(400).json({ status: false, message: emailValidation.message });
       return
    }

    const passwordValidation = validate("password", password);
    if (!passwordValidation.isValid) {
       res.status(400).json({ status: false, message: passwordValidation.message });
       return
    }
    const user = await UserAdmin.findOne({ email ,role:'admin'});
    if (!user) {
      res.status(404).json({ status: false, message: "User Not Found" });
      return 
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
     res.status(401).json({ status: false, message: "Invalid Password" });
     return 
    }
    const adminDetails = {
      name:user.name,
      email : user.email,
      image :user.image,
      userID : user._id
    }
     const token = generateToken(user._id.toString());
     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
    });

    res.status(200).json({ status: true, message: "Login successful" ,adminDetails,token});
} catch (error) {
  res.status(500).json({ status: false, message: "Internal Server Error" });
}
}
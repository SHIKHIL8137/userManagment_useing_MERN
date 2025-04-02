import { Request,Response } from "express";
import { UserAdmin } from "../../model/userAdminModel";
import { validate } from "../../public/validation";
import bcrypt from "bcrypt";

export const userDelete = async(req:Request,res:Response):Promise<void>=>{
  try {
    const userID = req.params.id;
  const user =await UserAdmin.findByIdAndDelete(userID);
  if(!user){
    res.status(404).json({status:false,message:"User not Found"});
    return
  }
  res.status(200).json({status:true,message:"User Delete successFully"});
  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
    return 
  }
}

export const userUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const userID = req.params.id;

    if (!userID) {
       res.status(400).json({ status: false, message: "User ID is required" });
       return
    }

    const updateData: Partial<{ name?: string; email?: string; password?: string }> = {};

    if (name) {
      const nameValidation = validate("name", name);
      if (!nameValidation.isValid) {
         res.status(400).json({ status: false, message: nameValidation.message });
         return
      }
      updateData.name = name;
    }


    if (email) {
      const emailValidation = validate("email", email);
      if (!emailValidation.isValid) {
         res.status(400).json({ status: false, message: emailValidation.message });
         return
      }


      const existingUser = await UserAdmin.findOne({ email, _id: { $ne: userID } });
      if (existingUser) {
         res.status(409).json({ status: false, message: "Email already in use" });
         return
      }

      updateData.email = email;
    }

    if (password && password.trim() !== "") {
      const passwordValidation = validate("password", password);
      if (!passwordValidation.isValid) {
         res.status(400).json({ status: false, message: passwordValidation.message });
         return
      }

      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await UserAdmin.findByIdAndUpdate(userID, updateData, { new: true });

    if (!updatedUser) {
      res.status(404).json({ status: false, message: "User not found" });
      return 
    }

    res.status(200).json({ status: true, message: "User updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Error in userUpdate:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};



const validateInput = (field: string, value: string, res: Response): boolean => {
  const validation = validate(field, value);
  if (!validation.isValid) {
    res.status(400).json({ status: false, message: validation.message });
    return false;
  }
  return true;
};


export const addUser = async (req: Request, res: Response): Promise<void> => {
 try {
    const { name, email, password } = req.body;
console.log('1')
    if (
      !validateInput("name", name, res) ||
      !validateInput("email", email, res) ||
      !validateInput("password", password, res)
    ) return;

    const existingUser = await UserAdmin.findOne({ email, role: "user" });
    if (existingUser) {
      res.status(409).json({ status: false, message: "User already exists" });
      return;
    }
   
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserAdmin({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({ status: true, message: "User registered successfully" , user: userWithoutPassword});

  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}
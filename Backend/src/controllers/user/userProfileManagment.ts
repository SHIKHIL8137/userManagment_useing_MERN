import { Request, Response } from "express";
import { UserAdmin } from "../../model/userAdminModel";
import { validate } from "../../public/validation";
import bcrypt from "bcrypt";

export const userUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID, name } = req.body;
    const existUser = await UserAdmin.findById(userID);
    if(!existUser){
      res.status(401).json({status:false,message:'User Not Found'});
      return 
    }

    const nameValidation = validate("name", name);
    if (!nameValidation.isValid) {
      res.status(400).json({ status: false, message: nameValidation.message });
      return;
    }

    const imageUrl = req.file ? (req.file as any).path : undefined;
    
    const updateData: { name?: string; image?: string } = {};
    if (name) updateData.name = name;
    if (imageUrl) updateData.image = imageUrl;

    const userdata = await UserAdmin.findByIdAndUpdate(userID, updateData, { new: true });
    
   const user = {
    name : userdata?.name,
    email:userdata?.email,
    image:userdata?.image,
    userID:userdata?._id
   }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in User Update:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


export const updatePassword = async(req:Request,res:Response):Promise<void>=>{
  try {
    const {password,userID} = req.body;

    const existUser = await UserAdmin.findById(userID);

    if(!existUser){
      res.status(401).json({status:false,message:'User Not Found'});
      return 
    }
    const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
     await UserAdmin.findByIdAndUpdate(userID,{password:hashedPassword})
    res.status(200).json({status:true,message:"Password Updated!"})
  } catch (error) {
    console.error("Error in User Update:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}
import { Request, Response } from 'express';
import { UserAdmin } from '../../model/userAdminModel';
export const Home = (req: Request, res: Response) => {
  res.send("Hello, TypeScript Backend!");
}


export const getUserData = async(req: Request, res: Response): Promise<void> => {
  try {
    const pages = Number(req.query.page) || 1;
    const limit: number = 10;
    const skip: number = (pages - 1) * limit;
    const searchTerm = req.query.search as string || '';
    

    const searchQuery = searchTerm 
      ? { name: { $regex: searchTerm, $options: 'i' } } 
      : {};
    

    const userData = await UserAdmin.aggregate([
      { $match: { ...searchQuery, role: "user" } },
      { $sort: { createdAt: -1 } }, 
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalCount = await UserAdmin.countDocuments({
      ...searchQuery,
      role: { $ne: "admin" } 
    });
    
    res.status(200).json({ status: true, userData, totalCount });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
    return;
  }
}
import { Request, Response } from 'express';
export const Home = (req: Request, res: Response) => {
  res.send("Hello, TypeScript Backend!");
}

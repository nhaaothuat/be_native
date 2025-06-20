import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login - No auth header",
      });
      return;
    }
    const token = authHeader.split(' ')[1];

    const decodeValue = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    if (!decodeValue ) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    req.user = { id: decodeValue.id };
   
    next();
  } catch (error:any) {
     console.log("JWT verification error: ", error);
   
  }
};

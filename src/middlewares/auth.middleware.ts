import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";
// import Admin from "../models/admin.model";
import { ROLES } from "../utils/commonConstants";
import { handleTokenError } from "../utils/functions";
import mysql from "mysql2/promise";
// import Server from "../models/server.model";

export interface UserRequest extends Request {
  user: {
    dataValues:{ 
      uid?:number
    }
  };
}

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization as string;

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(404).json({
        err: "token not found",
      });
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const user = await User.findOne({
      where: {
        uid: decodedToken.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        err: "user not found",
      });
    }
    next();
  } catch (error:any) {
    handleTokenError(error, res)
  }
};

export const isApiKeyAvailable = (req: Request, res: Response,next:NextFunction)=>{
  const apiKey = req.headers['x-api-key'];
   
  if(!apiKey){
    return res.status(404).send("API key not found.")
  }

  if(apiKey !== process.env.API_KEY){
    return res.status(400).send("API key is not valid")
  }

  next();
}

// export const isApiAdmin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization as string;

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(404).json({
//         err: "token not found",
//       });
//     }

//     const decodedToken: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     );

//     const user = await Admin.findOne({
//       where: {
//         id: decodedToken.user.id,
//         role: ROLES.API_ADMIN,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({
//         err: "Permission denied",
//       });
//     }

//     next();
//   } catch (error) {
//     handleTokenError(error, res)
//   }
// };

// export const isAdmin = async (
//   req: UserRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization as string;

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(404).json({
//         err: "token not found",
//       });
//     }

//     const decodedToken: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     );

//     const user = await Admin.findOne({
//       where: {
//         id: decodedToken.user.id,
//         role: ROLES.ADMIN,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({
//         err: "Permission denied",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     handleTokenError(error, res)
//   }
// };

// export const isApiAdminOrAdmin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization as string;

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(404).json({
//         err: "token not found",
//       });
//     }

//     const decodedToken: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     );

//     const admin = await Admin.findOne({
//       where: {
//         id: decodedToken.user.id,
//       },
//     });

//     if (!admin) {
//       return res.status(404).json({
//         err: "Admin Not Found",
//       });
//     }

//     if (admin.role !== ROLES.ADMIN && admin.role !== ROLES.API_ADMIN) {
//       return res.status(404).json({
//         err: "Access Denied",
//       });
//     }

//     next();
//   } catch (error) {
//     handleTokenError(error, res)
//   }
// };

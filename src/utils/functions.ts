import crypto from "crypto"
import { Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// function for getting days time in seconds
export const getTimeInDays = (days: number) => {
  var today = new Date();
  var resultDate = new Date(today);
  resultDate.setDate(today.getDate() + days);
  return resultDate;
};

export const handleTokenError = (error: Error, res: Response) => {
  switch (true) {
    case error instanceof TokenExpiredError:
      return res.status(401).json({
        err: "Token has expired",
      });
    case error instanceof JsonWebTokenError:
      return res.status(401).json({
        err: "Invalid token",
      });
    default:
      return res.status(500).json({
        err: "Internal server error",
      });
    }
  };


  export const encryptPassword = (password: string): string => {
    console.log("process.env.PASSWORD_KEY",process.env.PASSWORD_KEY);
    
    const algorithm = 'aes-128-cbc'; 
    const iv = crypto.randomBytes(16);
  
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.PASSWORD_KEY, 'hex'), iv);
    let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');
    return iv.toString('hex') + encryptedPassword;
  };
  
  export const decryptPassword = (encryptedPassword: string): string => {
    const algorithm = 'aes-128-cbc'; 
    const iv = Buffer.from(encryptedPassword.slice(0, 32), 'hex');
  
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.PASSWORD_KEY, 'hex'), iv);
    let decryptedPassword = decipher.update(encryptedPassword.slice(32), 'hex', 'utf-8');
    decryptedPassword += decipher.final('utf-8');
    return decryptedPassword;
  };
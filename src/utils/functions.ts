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
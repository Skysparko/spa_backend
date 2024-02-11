import crypto from "crypto"
import { Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiResponse, UserAttributes, defaultApiResponse } from "../@types/types";
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

export function getUserApiResponse<T>(
  success: boolean,
  msg: string,
  data: T[] | T | null = null,
  bearer_token: string = ""
): ApiResponse<UserAttributes> {
  let responseData: { list: UserAttributes[], path: string, detail: UserAttributes | null } = { list: [], path: "", detail: null };

  if (Array.isArray(data)) {
    responseData.list = data as UserAttributes[];
  } else if (typeof data === 'object' && data !== null) {
    responseData.detail = data as unknown as UserAttributes;
  }

  // Constructing the data object with or without the bearer_token based on the condition
  const dataObject = {
    ...responseData,
    ...(bearer_token && { bearer_token }) // Include bearerToken only if it's truthy
  };

  return {
    ...defaultApiResponse,
    success,
    msg,
    data: dataObject,
  };
}

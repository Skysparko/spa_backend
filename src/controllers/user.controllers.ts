import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { getTimeInDays, getUserApiResponse } from "../utils/functions";
import { upload } from "../utils/fileUploads";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiResponse, BypassLoginEnum, StatusEnum, UserAttributes, defaultApiResponse } from "../@types/types";
import { Op } from "sequelize";
import { UPLOAD_PATH_FOR_USERS } from "../utils/commonConstants";

export async function registerUser(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const reqData = req.body;
      const userExists = await User.findOne({
        where: {
          mobile_no: reqData.mobile_no,
        },
      });

      if (userExists) {
        const response = getUserApiResponse(false, "Account already exists with this number.");
        return res.status(403).json(response);
      }

      const hashedPassword = await bcrypt.hash(reqData.password, 10);
      const imageFileName = req.file ? req.file.filename : "ash";

      const userData: UserAttributes = {
        name: reqData.name,
        password: hashedPassword,
        mobile_no: reqData.mobile_no,
        email: reqData.email,
        city: reqData.city,
        image: imageFileName,
        reg_date: new Date(),
        status: StatusEnum.Active,
      };

      const user = await User.create(userData);

      let response;
      if (user.bypass_login === BypassLoginEnum.Yes) {
        const payload = { user: { id: user.uid } };
        const bearer_token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: 360000,
        });
        response = getUserApiResponse(true, "User has been created", user, bearer_token);
      } else {
        response = getUserApiResponse(true, "User has been created");
      }

      return res.status(201).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).send(error);
    }
  });
}

export async function userLogin(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { mobile_no, password } = await req.body;
    const existingUser = await User.findOne({
      where: { mobile_no },
    });
    if (!existingUser) {
      const response = getUserApiResponse(false,"User not Found");
      return res.status(400).json(response);
    }

    const passMatch = await bcrypt.compare(password, existingUser.password);
    if (!passMatch) {
      const response = getUserApiResponse(false,"Invalid credentials.");
      return res.status(400).send(response);
    }

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Logged in successfully.',
      data: {
        list: [],
        path: UPLOAD_PATH_FOR_USERS,
        detail: null,
      },
    };

    if (existingUser.bypass_login === "Yes") {
      const payload = { user: { id: existingUser.uid } };
      const bearer_token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: 360000,
      });
      apiResponse.data.detail = existingUser.dataValues;
      apiResponse.data.bearer_token = bearer_token;
    }

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function otpVerify(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { mobile_no, otp } = await req.body;

    const existingUser = await User.findOne({
      where: { mobile_no },
      attributes: { exclude: ['otp', 'password', 'bypass_login'] }
    });

    if (!existingUser) {
      return res.status(404).send("User not Found");
    }

    if (otp === existingUser.otp) {
      return res.status(400).send("Invalid otp.");
    }

    const payload = { user: { id: existingUser.uid } };
    const bearer_token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 360000,
    });

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Logged in successfully.',
      data: {
        list: [],
        path: UPLOAD_PATH_FOR_USERS,
        detail: { ...existingUser.dataValues },
        bearer_token
      },
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function updatePassword(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const existingUser = Object(req)["user"];
    const user = await User.findOne({
      where: { uid: existingUser.uid },
    });
    
    const { old_password, new_password } = req.body;

    const passMatch = await bcrypt.compare(old_password, user!.dataValues.password);
    if (!passMatch) {
      return res.status(400).send("Invalid credentials.");
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const data = {
      password: hashedPassword,
    };
    await existingUser.update(data);

    const apiResponse: ApiResponse<null> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Password updated successfully.',
      data: {
        list: [],
        path: UPLOAD_PATH_FOR_USERS,
        detail: null,
      },
    };
    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

// export async function logout(req: Request, res: Response) {
//   try {
//     res.clearCookie("bearer_token");
//     return res.status(200).json("Logout successfully");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send((error as Error).message);
//   }
// };

export async function updateUser(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;

      const user = await User.findOne({
        where: {
          mobile_no: reqData.mobile_no,
          uid: {
            [Op.not]: existingUser.uid,
          }
        },
      });
      if (user) {
        return res.status(403).send("Account already exist with number.");
      }

      const imageFileName = req.file ? req.file.filename : "ash";
      const data = {
        "name": reqData.name,
        "mobile_no": reqData.mobile_no,
        "email": reqData.email,
        "city": reqData.city,
        "image": imageFileName,
      }
      const userData = await existingUser.update(data);

      const apiResponse: ApiResponse<UserAttributes> = {
        ...defaultApiResponse,
        success: true,
        msg: 'User has been updated successfully.',
        data: {
          list: [],
          path: UPLOAD_PATH_FOR_USERS,
          detail: { ...userData.dataValues },
        },
      };

      return res.status(200).json(apiResponse);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).json(error);
    }
  })
}

// export async function deleteUser(req: Request, res: Response) {
//   try {
//     const user = await User.findOne({
//       where: { id: req.params.id },
//     });

//     if (!user) {
//       return res.status(404).json({
//         err: "User not found",
//       });
//     }
//     await UserTrans.destroy({ where: { userId: user.id } });
//     await user.destroy();

//     return res.status(200).json({
//       message: "User successfully deleted",
//     });
//   } catch (error) {
//     console.log(">>>>", error);
//     return res.status(500).send(error);
//   }
// }

// export async functiopn deleteUsers(req: Request, res: Response) {
//   try {
//     await User.destroy({
//       where: {},
//       truncate: true,
//     });

//     return res.status(200).json({
//       message: "Users successfully deleted",
//     });
//   } catch (error) {
//     console.log(">>>>", error);
//     return res.status(500).send(error);
//   }
// }

export async function getUser(req: Request, res: Response) {
  try {
    const user = await User.findOne({
      where: { uid: req.params.id },
    });

    if (!user) {
      return res.status(400).json({
        err: "User not found",
      });
    }

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'User data fetched.',
      data: {
        list: [],
        path: UPLOAD_PATH_FOR_USERS,
        detail: { ...user.dataValues },
      },
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const usersData = await User.findAll();

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'User data fetched.',
      data: {
        list: usersData,
        path: UPLOAD_PATH_FOR_USERS,
        detail: null,
      },
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { getTimeInDays } from "../utils/functions";
import { upload } from "../utils/fileUploads";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiResponse, BypassLoginEnum, StatusEnum, UserAttributes, defaultApiResponse } from "../@types/types";
import { Op } from "sequelize";

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
        return res.status(403).send("Account already exist with number.");
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
        bypass_login: BypassLoginEnum.No,
      };

      const user = await User.create(userData);

      const apiResponse: ApiResponse<UserAttributes> = {
        ...defaultApiResponse,
        success: true,
        msg: 'User has been created',
        data: {
          list: [],
          path: "",
          detail: null,
        },
      };

      if (user.bypass_login === "Yes") {
        const payload = { user: { id: user.uid } };
        const bearerToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: 360000,
        });
        apiResponse.data.detail = user.dataValues;
        apiResponse.data.bearerToken = bearerToken;
      }

      return res.status(201).json(apiResponse);
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
      return res.status(404).send("User not Found");
    }

    const passMatch = await bcrypt.compare(password, existingUser.password);
    if (!passMatch) {
      return res.status(400).send("Invalid credentials.");
    }

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Logged in successfully.',
      data: {
        list: [],
        path: "",
        detail: null,
      },
    };

    if (existingUser.bypass_login === "Yes") {
      const payload = { user: { id: existingUser.uid } };
      const bearerToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: 360000,
      });
      apiResponse.data.detail = existingUser.dataValues;
      apiResponse.data.bearerToken = bearerToken;
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
    const bearerToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 360000,
    });

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Logged in successfully.',
      data: {
        list: [],
        path: "",
        detail: { ...existingUser.dataValues },
        bearerToken
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
//     res.clearCookie("bearerToken");
//     return res.status(200).json("Logout successfully");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send((error as Error).message);
//   }
// };

export async function updateUser(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const reqData = req.body;
      const userId: number = Number(req.params.id);
      console.log("req", req.body);

      const userExists = await User.findOne({
        where: {
          mobile_no: reqData.mobile_no,
          uid: {
            [Op.not]: userId,
          }
        },
      });

      if (userExists) {
        return res.status(403).send("Account already exist with number.");
      }

      const user = await User.findOne({ where: { uid: userId } });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const data = {
        "name": reqData.name,
        "mobile_no": reqData.mobile_no,
        "email": reqData.email,
        "city": reqData.city,
        "image": reqData.image,
      }
      const userData = await user.update(data);

      const apiResponse: ApiResponse<UserAttributes> = {
        ...defaultApiResponse,
        success: true,
        msg: 'User has been updated successfully.',
        data: {
          list: [],
          path: "",
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

export async function updatePassword(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params?.id;
    const { old_password, new_password } = req.body;
    const user = await User.findOne({ where: { uid: id } });

    if (!user) {
      return res.status(404).send("User not found");
    }


    const passMatch = await bcrypt.compare(old_password, user.password);
    if (!passMatch) {
      return res.status(400).send("Invalid credentials.");
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const data = {
      password: hashedPassword,
    };
    await user.update(data);

    const apiResponse: ApiResponse<null> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Password updated successfully.',
      data: {
        list: [],
        path: "",
        detail: null,
      },
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
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
      return res.status(404).json({
        err: "User not found",
      });
    }

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'User data fetched.',
      data: {
        list: [],
        path: "",
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
        path: "",
        detail: null,
      },
    };

    return res.status(200).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}
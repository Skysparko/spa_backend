import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { getTimeInDays } from "../utils/functions";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRequest } from "../middlewares/auth.middleware";
import { Op } from "sequelize";
import { ApiResponse, BypassLoginEnum, StatusEnum, UserAttributes, defaultApiResponse } from "../@types/types";

export async function registerUser(req: Request, res: Response) {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const data = req.body;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData: UserAttributes = {
      name: data.name,
      password: hashedPassword,
      image: data.image,
      mobile_no: data.mobile_no,
      email: data.email,
      city: data.city,
      reg_date: new Date(),
      status: StatusEnum.Active,
      bypass_login: BypassLoginEnum.Yes,
    };

    const user = await User.create(userData);

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'User has been created',
      data: {
        list: [],
        path: "",
        detail: { ...user.dataValues },
      },
    };

    return res.status(201).json(apiResponse);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
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

    const payload = { user: { id: existingUser.uid } };
    const bearerToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 360000,
    });

    res.cookie("bearerToken", bearerToken, {
      expires: getTimeInDays(1)
    });

    const apiResponse: ApiResponse<UserAttributes> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Logged in successfully.',
      data: {
        list: [],
        path: "",
        detail: { ...existingUser.dataValues },
      },
    };

    return res.status(200).json({ bearerToken, apiResponse });
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("bearerToken");
    return res.status(200).json("Logout successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// export async function editUser(req: UserRequest, res: Response) {
//   const transaction = await User.sequelize.transaction();

//   try {
//     // Validation
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       await transaction.rollback();
//       return res.status(422).json({ errors: errors.array() });
//     }
//     const { username, userTransArr } = req.body;
//     const userId: number = Number(req.params.id);

//     const userExists = await User.findOne({
//       where: {
//         username,
//         id: {
//           [Op.not]: userId,
//         }
//       },
//     });

//     if (userExists) {
//       return res.status(403).send("Username already exists");
//     }

//     const user = await User.findOne({ where: { id: userId } });

//     if (!user) {
//       await transaction.rollback();
//       return res.status(404).send("User not found");
//     }
//     const updatedBy = req.user.dataValues.id;
//     const data = {
//       username,
//       updatedBy: updatedBy
//     };

//     await user.update(data, { transaction });

//     await UserTrans.destroy({ where: { userId: userId }, transaction });
//     const userTrans = [];
//     for (let i = 0; i < userTransArr.length; i++) {
//       const userTransData: UserTransAttributes = {
//         id: userTransArr[i]?.id || null,
//         userId: userId,
//         serverId: userTransArr[i]?.serverId,
//         siteId: userTransArr[i]?.siteId,
//       };
//       let { id, serverId, siteId } = await UserTrans.create(userTransData, { transaction });
//       userTrans.push({ id, serverId, siteId });
//     }
//     await transaction.commit();

//     const finalData = {
//       id: userId,
//       username: user.dataValues.username,
//       createdBy: user.createdBy,
//       updatedBy: updatedBy,
//       userTransData: userTrans
//     }

//     return res.status(200).json({ message: "User updated successfully.", user: { ...finalData } });
//   } catch (error) {
//     console.log(">>>>", error);
//     await transaction.rollback();
//     return res.status(500).send(error);
//   }
// }

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

// export async function deleteUsers(req: Request, res: Response) {
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
      msg: 'User has been created',
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
      msg: 'User has been created',
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

export async function updatePassword(req: Request, res: Response) {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params?.id;
    const { password } = req.body;
    const user = await User.findOne({ where: { uid: id } });

    if (!user) {
      return res.status(404).send("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      password: hashedPassword,
    };
    await user.update(data);

    const apiResponse: ApiResponse<null> = {
      ...defaultApiResponse,
      success: true,
      msg: 'Logged in successfully.',
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
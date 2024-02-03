import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { getTimeInDays } from "../utils/functions";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRequest } from "../middlewares/auth.middleware";
import { Op } from "sequelize";
import { UserAttributes } from "../@types/user.types";

export async function addUser(req: Request, res: Response) {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username } = req.body;
    const userExists = await User.findOne({
      where: { name:username },
    });

    if (userExists) {
      return res.status(403).send("Username already exists");
    }

      try {
        const userData: UserAttributes = {
          name: username as string,
          password: "",
          image: "",
          mobile_no: "",
          email: "",
          city: "",
          reg_date: new Date(),
          status: ""
        };
    
        const user = await User.create(userData);

        return res.status(201).json({ 
          message: `User has been created`, 
          user:{...user}
        });

      } catch (error) {
        throw error; // rethrow the error after rolling back the transaction
      }
    // });
  } catch (error) {
    return res.status(500).send(error);
  }
}

// export async function userLogin(req: Request, res: Response) {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors.array() });
//     }
//     const { username, password } = await req.body;
//     const existingUser = await User.findOne({
//       where: { username },
//     });
//     if (!existingUser) {
//       return res.status(404).send("User not Found");
//     }
//     const passMatch = await bcrypt.compare(password, existingUser.password);
//     if (!passMatch) {
//       return res.status(400).send("Invalid credentials.");
//     }

//     const payload = { user: { id: existingUser.id } };
//     const bearerToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: 360000,
//     });
    
//     const serversData = await getUserById(existingUser.id,res)

//     res.cookie("bearerToken", bearerToken, {
//       expires: getTimeInDays(1)
//     });

//     return res.status(200).json({ bearerToken, userData:serversData });
//   } catch (error) {
//     console.log(">>>>", error);
//     return res.status(500).send(error);
//   }
// }

// export async function logout(req: Request, res: Response) {
//   try {
//     res.clearCookie("bearerToken");
//     return res.status(200).send("Logout successfully");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send((error as Error).message);
//   }
// };

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

// export async function getUser(req: Request, res: Response) {
//   try {
//     const user = await User.findOne({
//       where: { id: req.params.id },
//     });

//     if (!user) {
//       return res.status(404).json({
//         err: "User not found",
//       });
//     }
//     const transData = await getUserById(parseInt(req.params.id),res)  
//     // const userData = {
//     //   "id": user.id,
//     //   "username": user.username,
//     //   serversData:transData.serversData
//     // }
//     return res.status(200).json(transData);
//   } catch (error) {
//     console.log(">>>>", error);
//     return res.status(500).send(error);
//   }
// }

export async function getUsers(req: Request, res: Response) {
  try {
    const usersData = await User.findAll();
    console.log(usersData);
    return res.status(200).json({ usersData });
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

// async function getUserById(id: number,res:Response) {
//   try {
//     const user = await User.findOne({
//       where: { id: id },
//       attributes: {
//         exclude: ['password','createdAt','updatedAt'],
//     }
//     });
//     let serversData = [];
//     const userTransArr = await UserTrans.findAll({ where: { userId: id } });
//     const siteDataCache = {};
//     for (const element of userTransArr) {
//       const serverId = element.dataValues.serverId;
//       const server = await Server.findOne({ where: { id: serverId } });
//       if (server) {
//         let sites = siteDataCache[serverId];
//         if (!sites) {
//           sites = await getSites(serverId,res);
//           siteDataCache[serverId] = sites;
//         }
//         const userSiteId = element.dataValues.siteId;
//         const userSite = sites.find(site => site.site_id == userSiteId);
//         if (userSite) {
//           serversData.push({
//             transId: element.id,
//             server: {
//               id: server.id,
//               ip: server.ip,
//               name: server.name
//             },
//             siteData: userSite
//           });
//         }
//       }
//     }
//     const userData = {
//       ...user.dataValues,
//       serversData: serversData
//     }
//     return userData;
//   } catch (error) {
//     console.log(">>>>", error);
//   }
// }

// export async function resetPassword(req: UserRequest, res: Response) {

//   try {
//     // Validation
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors.array() });
//     }
//     const id = req.params?.id;
//     const { password } = req.body;
//     const user = await User.findOne({ where: { id: id } });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const updatedBy = req.user.dataValues.id;
//     const data = {
//       password:hashedPassword,
//       updatedBy: updatedBy
//     };

//     await user.update(data);
//     return res.status(200).json({message:"User Successfully updated",updatedBy});
//   } catch (error) {
//     console.log(">>>>", error);
//     return res.status(500).send(error);
//   }
// }
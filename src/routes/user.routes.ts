import express, { Router } from "express";
import {
  idValidations,
  userAddValidations,
  userEditValidations,
  userLoginValidations,
  userPasswordUpdateValidations,
} from "../utils/validators.functions";
import {
  // deleteUser,
  // editUser,
  // getUser,
  getUsers,
  addUser,
  // userLogin,
  // resetPassword
} from "../controllers/user.controllers";
// import { isAdmin, isApiKeyAvailable } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/api");

router.post("/add", userAddValidations , addUser);

// router.post("/login", userLoginValidations , userLogin);

// router.put("/edit/:id", idValidations,  userEditValidations, editUser);

// router.delete("/:id",idValidations,  deleteUser);

// router.get("/:id",idValidations,  getUser);

router.get("/", getUsers);

// router.post("/reset-password/:id",  idValidations, userPasswordUpdateValidations, resetPassword );


export default router;

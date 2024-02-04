import express, { Router } from "express";
import {
  idValidations,
  registerUserValidation,
  userLoginValidations,
  userPasswordUpdateValidations,
} from "../utils/validators.functions";
import {
  getUser,
  getUsers,
  registerUser,
  userLogin,
  updatePassword
} from "../controllers/user.controllers";

const router: Router = express.Router();

router.get("/api");

router.post("/register", registerUserValidation, registerUser);

router.post("/login", userLoginValidations , userLogin);

// router.put("/edit/:id", idValidations, userEditValidations, editUser);

// router.delete("/:id",idValidations,  deleteUser);

router.get("/:id",idValidations,  getUser);

router.get("/", getUsers);

router.patch("/update-password/:id",  idValidations, userPasswordUpdateValidations, updatePassword );

export default router;
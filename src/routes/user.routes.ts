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
  updateUser,
  updatePassword,
  otpVerify
} from "../controllers/user.controllers";
import { isAuthorized } from "../middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/api");

router.post("/register", registerUserValidation, registerUser);

router.post("/login", userLoginValidations, userLogin);

router.post("/otp-verify", otpVerify);

router.put("/update", registerUserValidation, isAuthorized, updateUser);

router.patch("/update-password", userPasswordUpdateValidations, isAuthorized, updatePassword);

router.get("/:id", idValidations, getUser);

router.get("/", getUsers);

export default router;
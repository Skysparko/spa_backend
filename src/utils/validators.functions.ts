import { body, param } from "express-validator";

export const idValidations = [
  param("id")
    .isInt()
    .withMessage("ID must be an integer"),
];

export const userLoginValidations = [
  body("mobile_no")
    .notEmpty()
    .withMessage("Name is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
]

export const userPasswordUpdateValidations = [
  body("old_password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("new_password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirm_password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),]

export const registerUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),
  body("image")
    .notEmpty()
    .withMessage("Image is required"),
  body("mobile_no")
    .notEmpty()
    .withMessage("Mobile No. is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required"),
  body("city")
    .notEmpty()
    .withMessage("City is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
]

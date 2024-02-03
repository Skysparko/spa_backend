import { body, param } from "express-validator";

export const userRegisterValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("serverId").notEmpty().withMessage("serverId is required"),
];

export const userLoginValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const adminRegisterValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role").notEmpty().withMessage("Role is required"),
];

export const adminLoginValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const serverValidations = [
  body("ip").notEmpty().withMessage("IP is required"),

  body("username").notEmpty().withMessage("username is required"),

  body("name").notEmpty().withMessage("name is required"),
];

export const adminEditValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("role").notEmpty().withMessage("role is required"),
];

export const userEditValidations = [
  body("username")
    .notEmpty()
    .withMessage("Username is required"),
    body("userTransArr").notEmpty().withMessage("User Trans Arr is required"),
];

export const userAddValidations = [
  body("username")
    .notEmpty()
    .withMessage("Username is required"),
  body("userTransArr").notEmpty().withMessage("User Trans data is required"),
  body("password").notEmpty().withMessage("Password is required").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
];

export const idValidations = [
  param("id")
    .isInt()
    .withMessage("ID must be an integer"),
];

export const createTableValidations = [
  body("userTransId")
    .notEmpty()
    .withMessage("user transition ID can not be empty")
    .isInt()
    .withMessage("user transition ID must be an integer")  
];

export const deleteFingerValidations = [
  body("id")
    .notEmpty()
    .withMessage("ID can not be empty")
    .isInt()
    .withMessage("ID must be an integer"),
  body("userTransId")
    .notEmpty()
    .withMessage("user transition ID can not be empty")
    .isInt()
    .withMessage("user transition ID must be an integer") 
];

export const getEmployeeValidations = [
  body("userTransId")
    .notEmpty()
    .withMessage("user transition ID can not be empty")
    .isInt()
    .withMessage("user transition ID must be an integer") 
];

export const getFingerValidations = [
   body("employee_id")
    .notEmpty()
    .withMessage("employee ID can not be empty")
    .isInt()
    .withMessage("employee ID must be an integer"),
  body("userTransId")
    .notEmpty()
    .withMessage("user transition ID can not be empty")
    .isInt()
    .withMessage("user transition ID must be an integer") 
];

export const addFingerValidations = [
   body("employee_id")
    .notEmpty()
    .withMessage("employee ID can not be empty")
    .isInt()
    .withMessage("employee ID must be an integer"),
  body("userTransId")
    .notEmpty()
    .withMessage("user transition ID can not be empty")
    .isInt()
    .withMessage("user transition ID must be an integer"), 
  body("finger_number")
    .notEmpty()
    .withMessage("finger number can not be empty"),
  body("finger_template")
    .notEmpty()
    .withMessage("finger template can not be empty"),
  body("employee_pin")
    .notEmpty()
    .withMessage("employee pin can not be empty")
    .isInt()
    .withMessage("employee pin must be an integer"),
];


export const serverPasswordUpdateValidations = [
  body("password").notEmpty().withMessage("password is required")
];

export const userPasswordUpdateValidations = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
]
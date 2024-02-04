import { BypassLoginEnum, StatusEnum, UserAttributes } from "../@types/types";
import { createDB } from "../config/db";
import DataTypes, { Model, Optional } from "sequelize";

interface UserCreationAttributes extends Optional<UserAttributes, "uid"> { }

interface UserModel
  extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes { }
const User = createDB.define<UserModel>("users", {
  uid: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reg_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(StatusEnum)),
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bypass_login: {
    type: DataTypes.ENUM(...Object.values(BypassLoginEnum)),
    allowNull: false,
  },
},{
  timestamps: false,
});

export default User;

import { TournamentAttributes, TournamentTypeEnum } from "../@types/types"; // Import the TournamentTypeEnum
import { createDB } from "../config/db";
import { Model, DataTypes, Optional } from "sequelize";

interface TournamentCreationAttributes extends Optional<TournamentAttributes, "tnid"> {}

interface TournamentModel extends Model<TournamentAttributes, TournamentCreationAttributes>, TournamentAttributes {}

const Tournament = createDB.define<TournamentModel>("tournaments", {
  tnid: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  uid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sport: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  season: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(TournamentTypeEnum)),
    allowNull: false,
  },
  win_point: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export default Tournament;

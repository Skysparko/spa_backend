import { TeamAttributes } from "../@types/types"; // Import the TournamentTypeEnum
import { createDB } from "../config/db";
import { Model, DataTypes, Optional } from "sequelize";

interface TeamCreationAttributes extends Optional<TeamAttributes, "tnid"> {}

interface TeamModel extends Model<TeamAttributes, TeamCreationAttributes>, TeamAttributes {}

const Team = createDB.define<TeamModel>("teams", {
  tmid: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  tnid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tmatch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pmatch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 win: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lose: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
 tie: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export default Team;

import { PlayerAttributes, TournamentTypeEnum } from "../@types/types"; // Import the TournamentTypeEnum
import { createDB } from "../config/db";
import { Model, DataTypes, Optional } from "sequelize";

interface PlayerCreationAttributes extends Optional<PlayerAttributes, "pid"> {}

interface PlayerModel
  extends Model<PlayerAttributes, PlayerCreationAttributes>,
    PlayerAttributes {}

const Player = createDB.define<PlayerModel>(
  "players",
  {
    pid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    tnid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Player;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const createDB = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
   {
     host: 'localhost',
     dialect: 'mysql'
   }
 );

const connectDB = (): void => {
  createDB
    .sync({alter:true})
    .then(() => {
      console.log("Db is connected");
    })
    .catch((e: Error) => {
      console.log("Db connection failed", e);
    });
};

export { createDB, connectDB };

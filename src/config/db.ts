import { Sequelize } from "sequelize";

const createDB = new Sequelize(
  'scorenet',
  'root',
  '123456',
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

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.routes"
import cors from "cors"

const app = express();

//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: '*',
}));

//routes
app.use("/api/v1/users", userRoutes);


app.listen(process.env.PORT, () => {
  console.log("app live on ", process.env.BASE_URL);
  connectDB();
});

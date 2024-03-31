import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.routes";
import tournamentRoutes from "./routes/tournament.routes";
import teamRoutes from "./routes/team.routes";
import playerRoutes from "./routes/player.routes";
import cors from "cors";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

app.use(
  cors({
    origin: "*",
  })
);

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tournaments", tournamentRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/players", playerRoutes);

app.listen(process.env.PORT, () => {
  console.log("app live on ", process.env.BASE_URL);
  connectDB();
});

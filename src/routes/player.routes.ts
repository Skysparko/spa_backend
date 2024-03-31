import express, { Router } from "express";
import {
  idValidations,
} from "../utils/validators.functions";

import { isAuthorized } from "../middlewares/auth.middleware";
import { createPlayer, deletePlayer, getPlayer, getPlayers, updatePlayer } from "../controllers/player.controllers";

const router: Router = express.Router();

router.post("/create", isAuthorized, createPlayer);

router.put("/:id", idValidations, isAuthorized, updatePlayer);

router.get("/:id", idValidations, isAuthorized, getPlayer);

router.get("/", isAuthorized, getPlayers);

router.delete("/:id", idValidations, isAuthorized, deletePlayer);

export default router;
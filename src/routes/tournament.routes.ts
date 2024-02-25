import express, { Router } from "express";
import {
  idValidations,
} from "../utils/validators.functions";

import { isAuthorized } from "../middlewares/auth.middleware";
import { createTournament, deleteTournament, getTournaments, updateTournament } from "../controllers/tournament.controllers";

const router: Router = express.Router();

router.post("/create", isAuthorized, createTournament);

router.put("/update", isAuthorized, updateTournament);

router.get("/:id", idValidations, isAuthorized, getTournaments);

router.get("/", isAuthorized, getTournaments);

router.delete("/:id", idValidations, isAuthorized, deleteTournament);

export default router;
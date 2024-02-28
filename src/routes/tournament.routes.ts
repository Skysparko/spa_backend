import express, { Router } from "express";
import {
  idValidations,
} from "../utils/validators.functions";

import { isAuthorized } from "../middlewares/auth.middleware";
import { createTournament, deleteTournament, getTournament, getTournaments, updateTournament } from "../controllers/tournament.controllers";

const router: Router = express.Router();

router.post("/create", isAuthorized, createTournament);

router.put("/update/:id", idValidations, isAuthorized, updateTournament);

router.get("/:id", idValidations, isAuthorized, getTournament);

router.get("/", isAuthorized, getTournaments);

router.delete("/:id", idValidations, isAuthorized, deleteTournament);

export default router;
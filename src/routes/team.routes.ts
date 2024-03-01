import express, { Router } from "express";
import {
  idValidations,
} from "../utils/validators.functions";

import { isAuthorized } from "../middlewares/auth.middleware";
import { createTeam, deleteTeam, getTeam, getTeams, updateTeam } from "../controllers/team.controllers";

const router: Router = express.Router();

router.post("/create", isAuthorized, createTeam);

router.put("/update/:id", idValidations, isAuthorized, updateTeam);

router.get("/:id", idValidations, isAuthorized, getTeam);

router.get("/", isAuthorized, getTeams);

router.delete("/:id", idValidations, isAuthorized, deleteTeam);

export default router;
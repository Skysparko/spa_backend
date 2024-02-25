import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { getTimeInDays, getUserApiResponse } from "../utils/functions";
import { upload } from "../utils/fileUploads";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiResponse, BypassLoginEnum, StatusEnum, TournamentAttributes, UserAttributes, defaultApiResponse } from "../@types/types";
import { Op } from "sequelize";
import { UPLOAD_PATH_FOR_USERS } from "../utils/commonConstants";
import Tournament from "../models/tournament.model";

export async function createTournament(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;
      const imageFileName = req.file ? req.file.filename : "ash";

      const tournamentData: TournamentAttributes = {
        uid: existingUser.uid,
        sport: reqData.sport,
        title: reqData.title,
        logo: imageFileName,
        season: reqData.season,
        from_date: reqData.from_date,
        to_date: reqData.to_date,
        end_date: reqData.end_date,
        type: reqData.type,
        win_point: reqData.win_point,
      };

      const tournament = await Tournament.create(tournamentData);
      const response = getUserApiResponse(true, "Tournament has been created", tournament);
      return res.status(201).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).send(error);
    }
  });
}

export async function updateTournament(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;

      const tournament = await Tournament.findOne({ where: { tnid: req.params.id } });

      if (!tournament) {
        return res.status(404).send("Tournament not found");
      }
      const imageFileName = req.file ? req.file.filename : "ash";

      const tournamentData: TournamentAttributes = {
        uid: existingUser.uid,
        sport: reqData.sport,
        title: reqData.title,
        logo: imageFileName,
        season: reqData.season,
        from_date: reqData.from_date,
        to_date: reqData.to_date,
        end_date: reqData.end_date,
        type: reqData.type,
        win_point: reqData.win_point,
      };

      const tournamentUpdatedData = await tournament.update(tournamentData);
      const response = getUserApiResponse(true, "Tournament has been updated", tournamentUpdatedData);
      return res.status(200).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).json(error);
    }
  })
}

export async function deleteTournament(req: Request, res: Response) {
  try {
    const tournament = await Tournament.findOne({
      where: { tnid: req.params.id },
    });

    if (!tournament) {
      return res.status(404).json({
        err: "Tournament not found",
      });
    }
    await tournament.destroy();

    const response = getUserApiResponse(true, "Tournament deleted.", tournament);
    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}


export async function getTournament(req: Request, res: Response) {
  try {
    const tournament = await Tournament.findOne({
      where: { tnid: req.params.id },
    });

    if (!tournament) {
      return res.status(400).json({
        err: "Tournament not found",
      });
    }
    const response = getUserApiResponse(true, "Tournament data fetched.", tournament);

    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function getTournaments(req: Request, res: Response) {
  try {
    const tournamentsData = await Tournament.findAll();
    const response = getUserApiResponse(true, "Tournament data fetched.", tournamentsData);

    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}
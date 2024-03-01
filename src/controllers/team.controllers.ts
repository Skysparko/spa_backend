import { Request, Response } from "express";
// import { validationResult } from "express-validator";
import {  getUserApiResponse } from "../utils/functions";
import { upload } from "../utils/fileUploads";
import {  TeamAttributes } from "../@types/types";
import Team from "../models/team.model";

export async function createTeam(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;
      const imageFileName = req.file ? req.file.filename : "ash";

      const teamData: TeamAttributes = {
        tnid:reqData.tmid,
        name:reqData.name,
        logo:imageFileName,
        s_name:reqData.s_name,
        group:reqData.group,
        tmatch:reqData.tmatch,
        pmatch:reqData.pmatch,
        win:reqData.win,
        lose:reqData.lose,
        tie:reqData.tie,
        rating:reqData.rating,
        point:reqData.point,
        color:reqData.color
      };

      const team = await Team.create(teamData);
      const response = getUserApiResponse(true, "Team has been created", team);
      return res.status(201).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).send(error);
    }
  });
}

export async function updateTeam(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;

      const team = await Team.findOne({ where: { tmid: req.params.id } });

      if (!team) {
        const response = getUserApiResponse(false, "Team not found");
        return res.status(400).send(response);
      }
      const imageFileName = req.file ? req.file.filename : "ash";

      const teamData: TeamAttributes = {
        tnid:reqData.tmid,
        name:reqData.name,
        logo:imageFileName,
        s_name:reqData.s_name,
        group:reqData.group,
        tmatch:reqData.tmatch,
        pmatch:reqData.pmatch,
        win:reqData.win,
        lose:reqData.lose,
        tie:reqData.tie,
        rating:reqData.rating,
        point:reqData.point,
        color:reqData.color
      };

      const teamUpdatedData = await team.update(teamData);
      const response = getUserApiResponse(true, "Team has been updated", teamUpdatedData);
      return res.status(200).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).json(error);
    }
  })
}

export async function deleteTeam(req: Request, res: Response) {
  try {
    const team = await Team.findOne({
      where: { tmid: req.params.id },
    });

    if (!team) {
      const response = getUserApiResponse(false, "Team not found");
      return res.status(400).send(response);
    }
    await team.destroy();

    const response = getUserApiResponse(true, "Team deleted.");
    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}


export async function getTeam(req: Request, res: Response) {
  try {
    const team = await Team.findOne({
      where: { tmid: req.params.id },
    });

    if (!team) {
      const response = getUserApiResponse(false, "Team not found");
      return res.status(400).json(response);
    }
    const response = getUserApiResponse(true, "Team data fetched.", team);

    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function getTeams(req: Request, res: Response) {
  try {
    const teamsData = await Team.findAll();
    const response = getUserApiResponse(true, "Team data fetched.", teamsData);

    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}
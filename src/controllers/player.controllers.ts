import { Request, Response } from "express";
import { getUserApiResponse } from "../utils/functions";
import { upload } from "../utils/fileUploads";
import { PlayerAttributes } from "../@types/types";
import Player from "../models/player.model";

export async function createPlayer(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;
      const imageFileName = req.file ? req.file.filename : "ash";
      //   pid, tnid, Name, S Name, Image, Mobile, Status
      const playerData: PlayerAttributes = {
        tnid: reqData.tnid,
        name: reqData.name,
        image: imageFileName,
        sname: reqData.sname,
        mobile: reqData.mobile,
        status: reqData.status,
      };

      const player = await Player.create(playerData);
      const response = getUserApiResponse(
        true,
        "Player has been created",
        player
      );
      return res.status(201).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).send(error);
    }
  });
}

export async function updatePlayer(req: Request, res: Response) {
  upload(req, res, async (err) => {
    try {
      const existingUser = Object(req)["user"];
      const reqData = req.body;

      const player = await Player.findOne({ where: { pid: req.params.id } });

      if (!player) {
        const response = getUserApiResponse(false, "Player not found");
        return res.status(400).send(response);
      }
      const imageFileName = req.file ? req.file.filename : "ash";

      const playerData: PlayerAttributes = {
        tnid: reqData.tnid,
        name: reqData.name,
        image: imageFileName,
        sname: reqData.sname,
        mobile: reqData.mobile,
        status: reqData.status,
      };

      const playerUpdatedData = await player.update(playerData);
      const response = getUserApiResponse(
        true,
        "Player has been updated",
        playerUpdatedData
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log(">>>>", error);
      return res.status(500).json(error);
    }
  });
}

export async function deletePlayer(req: Request, res: Response) {
  try {
    const player = await Player.findOne({
      where: { pid: req.params.id },
    });

    if (!player) {
      const response = getUserApiResponse(false, "Player not found");
      return res.status(400).send(response);
    }
    await player.destroy();

    const response = getUserApiResponse(true, "Player deleted.");
    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function getPlayer(req: Request, res: Response) {
  try {
    const player = await Player.findOne({
      where: { tnid: req.params.id },
    });

    if (!player) {
      const response = getUserApiResponse(false, "Player not found");
      return res.status(400).json(response);
    }
    const response = getUserApiResponse(true, "Player data fetched.", player);

    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

export async function getPlayers(req: Request, res: Response) {
  try {
    const playersData = await Player.findAll();
    const response = getUserApiResponse(
      true,
      "Player data fetched.",
      playersData
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log(">>>>", error);
    return res.status(500).send(error);
  }
}

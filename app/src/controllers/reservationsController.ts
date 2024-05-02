import { Response, Request } from "express";
import { OfficeModel, ReservationData } from "../models/officeModel";
import mongoose from "mongoose";

export async function getDeskReservations(req: Request, res: Response) {
  try {
    let reservations:any = [];
    const filter = {
      id: req.params.officeId,
      "deskList.deskId": req.params.deskId,
    };

    const desk = await OfficeModel.findOne(filter);

    if (!desk) {
      throw new Error("No office with given ID");
    } else {
        reservations  = desk.deskList.find(
        (o) => o.deskId === req.params.deskId
      )?.reservationData;
      console.log(reservations)
    }
    if (reservations){
            res.status(200).send({ status: "success", data: reservations });
    }
    else {
        throw new Error("Reservation could not be made")
    }
  } catch (error) {
    console.error("Reservations GET method error:", error);
    res.status(500).send({
      status: "failed",
      message: "Reservations GET method failed",
      error: error,
    });
  }
}

export async function makeDeskReservations(req: Request, res: Response) {
  try {
    const newReservation = req.body;
    const filter = {
      id: req.params.officeId,
      "deskList.deskId": req.params.deskId,
    };

    const desk = await OfficeModel.findOne(filter);

    if (!desk) {
      throw new Error("No office with given ID");
    } else {
      const reservations = desk.deskList.find(
        (o) => o.deskId === req.params.deskId
      )?.reservationData;
      if (!reservations) {
        throw new Error("No desk with given ID in this office");
      } else {
        reservations?.push(newReservation);
        
      }
    }
    await desk.save();
    res.status(200).send({ status: "success", data: desk.deskList });
  } catch (error) {
    console.error("Office POST method error:", error);
    res.status(500).send({
      status: "failed",
      message: "Office POST method failed",
      error: error,
    });
  }
}

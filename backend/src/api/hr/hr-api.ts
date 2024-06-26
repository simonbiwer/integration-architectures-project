import { Request, Response } from "express";
import { Salesman, SalesmanModel } from "../../model/Salesman";
import {createSheetsForAllSalesmen, updateBonus} from "../../service/sheet-service";

import {
    BonusComputationSheet,
    BonusComputationSheetModel,
} from "../../model/BonusComputationSheet";

export async function signSheet(req: Request, res: Response) {
    await BonusComputationSheetModel.findOneAndUpdate(
        {
            salesmanId: req.params.salesmanId,
            yearOfEvaluation: req.params.yearOfEvaluation,
            status: "pending-hr",
        },
        { status: "pending-ceo" }
    )
        .then((value: any) => {
            if (value === null) {
                res.status(400).send({
                    message: `There exists no BonusComputationSheet for this salesmanId: ${req.params.salesmanId} for this year: ${req.params.yearOfEvaluation} with the status pending-hr`,
                });
            } else {
                res.status(200).send(value);
            }
        })
        .catch((reason: any) => res.status(400).send(reason));
}

export async function getSheetByIdAndYear(req: Request, res: Response) {
    try {
        const sheet = await BonusComputationSheetModel.findOne({
            salesmanId: req.params.salesmanId,
            yearOfEvaluation: req.params.yearOfEvaluation,
        });
        const salesman = await SalesmanModel.findOne({
            id: req.params.salesmanId,
        });
        if (sheet !== null && salesman !== null) {
            const sheetWithSalesman = {
                salesman: salesman,
                yearOfEvaluation: sheet.yearOfEvaluation,
                totalBonus: sheet.totalBonus,
                status: sheet.status,
                socialPerformanceEvaluation: sheet.socialPerformanceEvaluation,
                orderEvaluation: sheet.orderEvaluation,
                comment: sheet.comment,
                declined: sheet.declined,
            };
            res.status(200).send(sheetWithSalesman);
        }
    } catch (reason: any) {
        res.status(400).send(reason);
    }
}

export async function getAllSheets(req: Request, res: Response) {
    await BonusComputationSheetModel.find({})
        .then((value: any) => {
            res.status(200).send(value);
        })
        .catch((reason: any) => res.status(400).send(reason));
}

export async function readPendingValues(req: Request, res: Response) {
    try {
        const pendingSheets = await BonusComputationSheetModel.find({
            status: "pending-hr",
        });
        const outputList: {
            salesmanId: number;
            firstname: string;
            lastname: string;
            year: number;
            status: string;
            bonus: number;
        }[] = [];
        for (let sheet of pendingSheets) {
            const currentSalesman = (await SalesmanModel.findOne({
                id: sheet.salesmanId,
            })) as unknown as Salesman;
            outputList.push({
                salesmanId: currentSalesman.id,
                firstname: currentSalesman.firstname,
                lastname: currentSalesman.lastname,
                year: sheet.yearOfEvaluation,
                status: sheet.status,
                bonus: sheet.totalBonus,
            });
        }
        res.status(200).send(outputList);
    } catch (reason: any) {
        res.status(400).send(reason);
    }
}

export async function readNotPendingValues(req: Request, res: Response) {
    try {
        const notPendingSheets = await BonusComputationSheetModel.find()
            .where("status")
            .ne("pending-hr");
        const outputList: {
            salesmanId: number;
            firstname: string;
            lastname: string;
            year: number;
            status: string;
            bonus: number;
        }[] = [];
        for (let sheet of notPendingSheets) {
            const currentSalesman = (await SalesmanModel.findOne({
                id: sheet.salesmanId,
            })) as unknown as Salesman;
            outputList.push({
                salesmanId: currentSalesman.id,
                firstname: currentSalesman.firstname,
                lastname: currentSalesman.lastname,
                year: sheet.yearOfEvaluation,
                status: sheet.status,
                bonus: sheet.totalBonus,
            });
        }
        res.status(200).send(outputList);
    } catch (reason: any) {
        res.status(400).send(reason);
    }
}

export async function startBonusCalculation(req: Request, res: Response) {
    createSheetsForAllSalesmen(parseInt(req.params.year), req.app.get("db"))
        .then(() => res.status(200).send())
        .catch((reason: any) => res.status(400).send(reason));
}

export async function updateSheet(req: Request, res: Response) {
    console.log("update sheet");
    const updated: any = req.body.sheet;
    updated.salesmanId = updated.salesman.id;
    let updatedSheet: BonusComputationSheet = updated;
    updatedSheet = updateBonus(updatedSheet);
    await BonusComputationSheetModel.findOneAndUpdate(
        {
            salesmanId: updatedSheet.salesmanId,
            yearOfEvaluation: updatedSheet.yearOfEvaluation,
        },
        updatedSheet
    )
        .then((value) => {
            res.status(200).send(value);
        })
        .catch((error) => {
            res.status(400).send({ message: error });
        });
}

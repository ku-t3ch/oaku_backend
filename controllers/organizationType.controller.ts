import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const getAllOrganizationsType = async (req: Request, res: Response) => {
    try {
        const organizationsType = await prisma.organizationType.findMany({
            select:{
                id: true,
                name: true,
            }
        });
        return res.status(200).json(organizationsType);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        return res.status(500).json({
        error: "An error occurred while fetching organizations.",
        });
    }
};

export const getAllOrganizationsTypeByCampusId = async (req: Request, res: Response) => {
    const campusId = req.params.campusId;
    try {
        const organizationsType = await prisma.organizationType.findMany({
            where: {
                campusId: campusId,
            },
            select:{
                id: true,
                name: true,
            }
        });
        return res.status(200).json(organizationsType);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        return res.status(500).json({
        error: "An error occurred while fetching organizations.",
        });
    }
};

// import { Request, Response } from "express";
// import { prisma } from "../configs/db";
// import { Role} from "@prisma/client";

// export const createAdminCampus = async (req: Request, res: Response) => {
//   try {
//     const { campusId, userId, name, email, phoneNumber } = req.body;

//     const existingAdmin = await prisma.user.findFirst({
//       where: {
//         userRoles: {
//           some: {
//             role: Role.CAMPUS_ADMIN,
//             campusId: campusId,
//           },
//         },
//       },
//     });

//     if (existingAdmin) {
//       return res.status(400).json({
//         error: "This campus already has an admin.",
//       });
//     }

//     const userRole = await prisma.userRole.create({
//       data: {
//         userId: userId,
//         role: Role.CAMPUS_ADMIN,
//         campusId: campusId,
//       },
//     });

//     return res.status(201).json(userRole);
//   } catch (error) {
//     console.error("Error creating campus admin:", error);
//     return res.status(500).json({
//       error: "An error occurred while creating the campus admin.",
//     });
//   }
// };


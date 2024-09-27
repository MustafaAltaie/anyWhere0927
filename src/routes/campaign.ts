import express from "express";
import { Request, Response, NextFunction } from "express";
import { RequestCampaign } from "../types/types"

// PrismaClient
import { prisma } from "../prismaclient/prismaclient"

const router = express.Router()

// get all campaigns
router.get("/", async (req, res) => {
    try {
        const allCampaign = await prisma.campaign.findMany();
        res.json(allCampaign);
    }
    catch (error) {
        res.status(400).json({ error: "Unable to get all campaign" });
    }
});

// get campaign by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const currentCampaign = await prisma.campaign.findUnique({
            where: {
                id: id
            }
        });
        currentCampaign ? res.status(200).json(currentCampaign) : res.status(404).json({ error: "campaign not found" });
    }
    catch (error) {
        res.status(400).json({ error: `can not get campaign with id: ${id}` })
    }
});

// create new campaign
router.post("/", async (req: Request<{}, {}, RequestCampaign>, res) => {
    try {
        const { companyName, companyDescription, productDescription, targetAudience, userId, emails } = req.body;
        const newCampaign = await prisma.campaign.create({
            data: {
                companyName,
                companyDescription,
                productDescription,
                targetAudience,
                user: { connect: { id: userId } },
                emails: {
                    create: emails.map(email => ({
                        subject: email.subject,
                        content: email.content,
                        recipients: email.recipients
                    }))
                }
            },
            include: {
                emails: true,
                user: true
            }
        });
        res.json(newCampaign);
    }
    catch (error) {
        console.error("Error creating campaign:", error);
        res.status(400).json({ error: "Unable to create campaign" });
    }
});

// update user after id
// router.put("/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const { name, email } = req.body;
//         const updateUser = await prisma.user.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 name: name,
//                 email: email
//             }
//         })
//         res.json(updateUser);
//     }
//     catch (error) {
//         res.status(400).json({ error: `Unable to update user with id: ${id}` });
//     }
// });

// patch user after id
// router.patch("/:id", async (req, res) => {
//     const { id } = req.params;
//     let currentUser;

//     try {
//         currentUser = await prisma.user.findUnique({
//             where: {
//                 id: id
//             }
//         });
//         if (!currentUser) res.sendStatus(404).json({ error: `can not found user with id: ${id}` })

//         currentUser = { ...req.body };
//         const updateUser = await prisma.user.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 name: currentUser?.name,
//                 email: currentUser?.email
//             }
//         })
//         res.json(updateUser);
//     }
//     catch (error) {
//         res.status(400).json({ error: `Unable to update user with id: ${id}` });
//     }
// });

// delete user by id
// router.delete("/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deleteUser = await prisma.user.delete({
//             where: {
//                 id: id
//             }
//         });
//         res.status(200).json({ message: `user: "${deleteUser.name}" where deleted` });
//     }
//     catch (error) {
//         res.status(400).json({ error: `Unable to delete user with id: "${id}"` });

//     }
// });

export { router as campaignRoutes }

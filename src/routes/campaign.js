const express = require('express');
const prisma = require('../prismaclient');
const router = express.Router();

router.post('/', async (req, res) => {
    const { campaignName, companyName, companyDescription, productDescription, targetAudience } = req.body;
    const userId = req.user.id;

    try {
        const newCampaign = await prisma.campaign.create({
            data: {
                campaignName,
                companyName,
                companyDescription,
                productDescription,
                targetAudience,
                userId,
            },
        });
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the campaign.' });
    }
});

router.get('/', async (req, res) => {
    const userId = req.user.id;

    try {
        const campaigns = await prisma.campaign.findMany({
            where: { userId },
        });
        res.status(200).json(campaigns);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching campaigns.' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: parseInt(id) },
        });
        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the campaign.' });
    }
});

module.exports = router;
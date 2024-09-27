const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const prisma = require('../prismaclient');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;
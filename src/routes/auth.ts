import { Router } from "express";
import passport from "passport";
import '../authStrategies/githubStrategy';
import { Request, Response } from 'express';

const app = Router();

app.get('/',
    passport.authenticate('github'));

app.get('/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req: Request, res: Response) {
        res.redirect('/profile');
    });

app.get('/profile', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/github');
    }
    res.json(req.user);
});

export default app;
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import initializePassport from './passport-config';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaign';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({ 
    secret: process.env.SESSION_SECRET || '4435966',
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
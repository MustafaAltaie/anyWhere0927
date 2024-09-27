const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./prismaclient');

const initialize = (passport) => {
    passport.use(new LocalStrategy(
        async (email, password, done) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    });
};

module.exports = initialize;
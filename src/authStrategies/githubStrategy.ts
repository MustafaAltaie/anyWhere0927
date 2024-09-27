import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { UserProfile } from '../types/types';


// Använd GitHub-strategin
passport.use(new GitHubStrategy({
  clientID: 'GITHUB_CLIENT_ID', // Byt ut mot din riktiga client ID
  clientSecret: 'GITHUB_CLIENT_SECRET', // Byt ut mot din riktiga client secret
  callbackURL: "http://localhost:1337/auth/github/callback"
},
  (accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: UserProfile | null) => void) => {
    try {
      // Logga profil för felsökning
      console.log(profile);

      const user: UserProfile = {
        id: profile.id,
        username: profile.username || profile.displayName,
        displayName: profile.displayName,
        profileUrl: profile.profileUrl || '', // Kontrollera att detta finns
        emails: profile.emails || [] // Kontrollera att detta finns
      };

      return done(null, user); // Skicka den skapade användaren
    } catch (err) {
      console.error('Error during authentication', err);
      return done(err); // Skicka fel
    }
  }
));

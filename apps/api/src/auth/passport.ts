import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { env } from '../config/env.js';
import { generateToken } from './jwt.js';
import { db } from '../db.js';

// JWT Strategy for API authentication
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET || 'fallback-secret-for-dev',
  issuer: 'docunest',
  audience: 'docunest-api'
}, async (payload, done) => {
  try {
    // Verify user still exists
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { tenant: true }
    });
    
    if (!user) {
      return done(null, false);
    }
    
    return done(null, {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      tenant: user.tenant
    });
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }
      
      // Find or create user
      let user = await db.user.findUnique({
        where: { email },
        include: { tenant: true }
      });
      
      if (!user) {
        // Create default tenant for new users
        const tenant = await db.tenant.create({
          data: {
            name: `${profile.displayName || 'User'}'s Organization`
          }
        });
        
        user = await db.user.create({
          data: {
            email,
            name: profile.displayName || null,
            tenantId: tenant.id
          },
          include: { tenant: true }
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// GitHub OAuth Strategy
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in GitHub profile'), null);
      }
      
      // Find or create user
      let user = await db.user.findUnique({
        where: { email },
        include: { tenant: true }
      });
      
      if (!user) {
        // Create default tenant for new users
        const tenant = await db.tenant.create({
          data: {
            name: `${profile.displayName || profile.username}'s Organization`
          }
        });
        
        user = await db.user.create({
          data: {
            email,
            name: profile.displayName || profile.username || null,
            tenantId: tenant.id
          },
          include: { tenant: true }
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

export { passport };


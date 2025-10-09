import { Request, Response } from 'express';
import { generateToken } from './jwt.js';
import { passport } from './passport.js';

// OAuth callback handlers
export const handleGoogleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error`);
    }
    
    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email
    });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}`);
  })(req, res);
};

export const handleGitHubCallback = (req: Request, res: Response) => {
  passport.authenticate('github', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error`);
    }
    
    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email
    });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}`);
  })(req, res);
};

// OAuth initiation handlers
export const initiateGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const initiateGitHubAuth = passport.authenticate('github', {
  scope: ['user:email']
});


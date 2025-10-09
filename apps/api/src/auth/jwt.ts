import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required for token generation');
  }
  
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'docunest',
    audience: 'docunest-api'
  });
};

export const verifyToken = (token: string): JWTPayload => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required for token verification');
  }
  
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'docunest',
      audience: 'docunest-api'
    }) as JWTPayload;
    
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};


import cors from 'cors';
import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { logger } from '@docunest/utils';
import { appRouter } from './routers/index.js';
import { createContext } from './routers/trpc.js';
import { passport } from './auth/passport.js';
import { 
  initiateGoogleAuth, 
  initiateGitHubAuth, 
  handleGoogleCallback, 
  handleGitHubCallback 
} from './auth/routes.js';

const app = express();

// HTTPS enforcement middleware
const enforceHTTPS = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    // Check if request is secure (HTTPS)
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    
    // Security headers
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  next();
};

// Configure CORS properly
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (!origin) {
      return callback(new Error('Origin is required'), false);
    }
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    // In production, enforce HTTPS origins
    if (process.env.NODE_ENV === 'production' && !origin.startsWith('https://')) {
      return callback(new Error('HTTPS required in production'), false);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  optionsSuccessStatus: 200
};

// Apply security middleware
app.use(enforceHTTPS);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit request size

// Session configuration for OAuth
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-for-dev',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/auth', strictLimiter);
app.use(generalLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// OAuth routes
app.get('/auth/google', initiateGoogleAuth);
app.get('/auth/google/callback', handleGoogleCallback);
app.get('/auth/github', initiateGitHubAuth);
app.get('/auth/github/callback', handleGitHubCallback);

// tRPC routes
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const port = Number(process.env.PORT ?? 4000);

export const server = app.listen(port, () => {
  logger.info({ port }, 'API server listening');
});

export type AppRouter = typeof appRouter;

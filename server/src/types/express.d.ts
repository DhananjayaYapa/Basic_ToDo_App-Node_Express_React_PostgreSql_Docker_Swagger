// ─── Express Request Augmentation ───────────────────────────────────────────
// Extends the Express Request interface to include the authenticated user
// payload set by the JWT auth middleware.

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                name: string;
            };
        }
    }
}

export {};

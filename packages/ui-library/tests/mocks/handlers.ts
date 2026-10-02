import type { RequestHandler } from 'msw';

// The library makes no network requests of its own; tests add handlers with `server.use` when they need one
export const handlers: RequestHandler[] = [];

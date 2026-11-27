// In-memory fixed-window rate limiter for auth endpoints; no npm dependencies.
// Defaults: 5 requests per 15 minutes per IP, override with RATE_LIMIT_MAX and
// RATE_LIMIT_WINDOW_MS. Counters reset on process restart, so this slows abuse
// attempts (risk reduced) but does not replace an upstream gateway or WAF limit.
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX) || 5;
const windows = new Map();

module.exports = () => (req, res, next) => {
  const ip = req.ip || (req.socket && req.socket.remoteAddress) || "unknown";
  const now = Date.now();
  let entry = windows.get(ip);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    windows.set(ip, entry);
  }
  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    res.status(429).json({ error: "Too many requests. Try again later." });
    return;
  }
  res.setHeader("X-RateLimit-Limit", String(MAX_REQUESTS));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, MAX_REQUESTS - entry.count)));
  next();
};

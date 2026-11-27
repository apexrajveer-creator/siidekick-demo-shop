// Minimal admin gate: compares Authorization: Bearer <token> with process.env.ADMIN_TOKEN
// and answers 401 otherwise (also when the variable is unset, so a missing config fails closed).
// In production replace this shared token with a verified Cognito JWT; this static check only
// reduces risk while ADMIN_TOKEN is set and kept secret.
function requireAdmin(req, res, next) {
  const header = req.get("Authorization") || "";
  const expected = process.env.ADMIN_TOKEN;
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
module.exports = { requireAdmin };

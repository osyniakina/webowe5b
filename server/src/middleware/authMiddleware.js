import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer <token>"

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== "object" || payload === null) {
      return res.status(403).json({ error: "Forbidden - invalid token payload" });
    }

    if (!("role" in payload)) {
      return res.status(403).json({ error: 'Forbidden - no role in token' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden" });
  }
}

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const role = typeof req.user.role === "string" ? req.user.role : null;
  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
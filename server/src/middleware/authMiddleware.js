export function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (token !== "secret123") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}
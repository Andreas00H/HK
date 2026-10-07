// Kontrollerar JWT i headern "Authorization: Bearer <token>"
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  // Token måste skickas som "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token saknas" });
  }

  const token = header.slice(7);

  try {
    // Kastar fel om token är falsk eller har gått ut
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Ogiltig eller utgången token" });
  }
}

module.exports = authMiddleware;
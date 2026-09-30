// Tar emot HTTP-anrop för auth och skickar vidare till authService
const authService = require("../services/authService");

// POST /api/auth/register
async function register(req, res, next) {
  try {
    // req.body kan saknas om klienten inte skickade JSON
    const user = await authService.register(req.body || {});
    res.status(201).json({ user });
  } catch (err) {
    // Kända fel (t.ex. 400 och 409) skickas som JSON till klienten
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    // Okända fel lämnas till fel-middleware (blir 500)
    next(err);
  }
}


// POST /api/auth/login
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body || {});
    res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { register, login };
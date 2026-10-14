// Tar emot HTTP-anrop för auth och skickar vidare till authService
const authService = require("../services/authService");
const { isNonEmptyString, isEmail, sendIfInvalid } = require("../middleware/validate");

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

  const { name, email, phone, password, location } = req.body;

  // Validera indata innan vi rör databasen
  const errors = [];
  if (!isNonEmptyString(name, 100)) errors.push("name saknas eller är ogiltigt");
  if (!isEmail(email)) errors.push("email är ogiltig");
  if (!isNonEmptyString(phone, 30)) errors.push("phone saknas eller är ogiltigt");
  if (!isNonEmptyString(password, 100) || password.length < 8)
    errors.push("password måste vara minst 8 tecken");
  if (!isNonEmptyString(location, 100)) errors.push("location saknas");
  if (sendIfInvalid(res, errors)) return;
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

  const { email, password } = req.body;

  const errors = [];
  if (!isEmail(email)) errors.push("email är ogiltig");
  if (!isNonEmptyString(password, 100)) errors.push("password saknas");
  if (sendIfInvalid(res, errors)) return;

}

module.exports = { register, login };
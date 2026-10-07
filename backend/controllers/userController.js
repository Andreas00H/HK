// Tar emot HTTP-anrop för användare och skickar vidare till userService
const userService = require("../services/userService");

// GET /api/users/:id
async function getUser(req, res, next) {
  try {
    const user = await userService.getPublicProfile(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { getUser };
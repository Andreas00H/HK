// Tar emot HTTP-anrop för dashboarden
const dashboardService = require("../services/dashboardService");

// GET /api/dashboard
async function getDashboard(req, res, next) {
  try {
    const dashboard = await dashboardService.getDashboard(req.user.id);
    res.status(200).json(dashboard);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { getDashboard };
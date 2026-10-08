// Tar emot HTTP-anrop för låneförfrågningar och skickar vidare till servicen
const borrowRequestService = require("../services/borrowRequestService");

// POST /api/borrow-requests
async function createRequest(req, res, next) {
  try {
    const borrowRequest = await borrowRequestService.createRequest(req.user.id, req.body || {});
    res.status(201).json({ borrowRequest });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}


// GET /api/borrow-requests/my
async function getMyRequests(req, res, next) {
  try {
    const result = await borrowRequestService.getMyRequests(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}


// PUT /api/borrow-requests/:id
async function updateStatus(req, res, next) {
  try {
    const borrowRequest = await borrowRequestService.updateStatus(
      req.user.id,
      req.params.id,
      req.body || {}
    );
    res.status(200).json({ borrowRequest });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { createRequest, getMyRequests, updateStatus };
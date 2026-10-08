// Tar emot HTTP-anrop för kontakter
const borrowRequestService = require("../services/borrowRequestService");

// GET /api/contacts
async function getContacts(req, res, next) {
  try {
    const contacts = await borrowRequestService.getContacts(req.user.id);
    res.status(200).json({ contacts });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { getContacts };
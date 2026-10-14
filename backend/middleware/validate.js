// Enkla valideringsfunktioner som används av alla controllers

const isNonEmptyString = (v, max = 255) =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;

const isEmail = (v) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 255;

const isPositiveInt = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

const isPositiveNumber = (v) => !isNaN(Number(v)) && Number(v) >= 0;

// Vi vill ha datum i formatet YYYY-MM-DD
const isDateString = (v) =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));

const isRating = (v) => Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 5;

// Samlar fel och skickar 400 om något är fel
// Användning: if (sendIfInvalid(res, errors)) return;
const sendIfInvalid = (res, errors) => {
  if (errors.length > 0) {
    res.status(400).json({ error: "Ogiltig indata", details: errors });
    return true;
  }
  return false;
};

module.exports = {
  isNonEmptyString,
  isEmail,
  isPositiveInt,
  isPositiveNumber,
  isDateString,
  isRating,
  sendIfInvalid,
};
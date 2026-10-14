// Gemensam felhantering för hela API:et

// Hanterar anrop till rutter som inte finns (t.ex. fel URL)
function notFound(req, res) {
  res.status(404).json({ error: "Rutten finns inte" });
}

// Fångar alla fel som controllers skickar vidare med next(err)
// OBS: Express känner igen en felhanterare på att den har fyra parametrar
function errorHandler(err, req, res, next) {
  // Trasig JSON i request body (t.ex. fel i Postman eller PowerShell)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Ogiltig JSON i förfrågan" });
  }

  // Förväntade fel (4xx) med egen statuskod, t.ex. för stor body
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  // Oväntade fel: logga i servern, skicka aldrig stack trace till klienten
  console.error(err);
  res.status(500).json({ error: "Något gick fel på servern" });
}

module.exports = { notFound, errorHandler };
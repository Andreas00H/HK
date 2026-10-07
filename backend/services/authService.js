// Affärsregler för registrering och inloggning
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Skapar ett fel med HTTP-statuskod som controllern kan skicka vidare
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Registrerar en ny användare
async function register({ name, email, phone, password, location }) {
  // Alla fält måste vara text och får inte vara tomma
  const fields = { name, email, phone, password, location };
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || value.trim() === "") {
      throw httpError(400, `Fältet "${key}" krävs`);
    }
  }

  // Städa upp indata
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  const cleanLocation = location.trim();

  // Enkel kontroll av e-postformat
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw httpError(400, "Ogiltig e-postadress");
  }

  // Lösenordet måste vara minst 8 tecken
  if (password.length < 8) {
    throw httpError(400, "Lösenordet måste vara minst 8 tecken");
  }

  // E-posten måste vara unik
  const existing = await userModel.findByEmail(cleanEmail);
  if (existing) {
    throw httpError(409, "E-postadressen används redan");
  }

  // Hasha lösenordet (10 = hur många gånger det "blandas")
  const passwordHash = await bcrypt.hash(password, 10);

  // Spara användaren (returneras utan lösenordshash)
  try {
    return await userModel.createUser({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      location: cleanLocation,
    });
  } catch (err) {
    // 23505 = unikhetsbrott i PostgreSQL (två registrerar samma e-post samtidigt)
    if (err.code === "23505") {
      throw httpError(409, "E-postadressen används redan");
    }
    throw err;
  }
}

// Loggar in en användare och returnerar en JWT
async function login({ email, password }) {
  if (
    typeof email !== "string" || email.trim() === "" ||
    typeof password !== "string" || password === ""
  ) {
    throw httpError(400, "E-post och lösenord krävs");
  }

  const user = await userModel.findByEmail(email.trim().toLowerCase());

  // Samma felmeddelande oavsett om e-posten eller lösenordet är fel,
  // så att ingen kan ta reda på vilka e-postadresser som finns
  const passwordOk = user && (await bcrypt.compare(password, user.password_hash));
  if (!passwordOk) {
    throw httpError(401, "Fel e-post eller lösenord");
  }

  // Skapa token med användarens id (hemligheten kommer från .env)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  // Skicka aldrig med password_hash till klienten
  const { password_hash, ...safeUser } = user;
  return { token, user: safeUser };
}

module.exports = { register, login };
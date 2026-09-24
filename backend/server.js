// Startar HTTP-servern.
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`JWT expires in: ${process.env.JWT_EXPIRES_IN}`);
});

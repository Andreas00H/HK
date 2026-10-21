// Startpunkt för React-appen. Kopplar appen till DOM och slår på routing, inloggning och vald stad.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CityProvider } from "./context/CityContext.jsx";
import "./assets/styles/index.css";
import "./assets/styles/layout.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CityProvider>
          <App />
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

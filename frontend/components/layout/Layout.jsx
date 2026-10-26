// Gemensamt sidomslag: sidhuvud överst (bara på dator), sidans innehåll i mitten och bottenmeny längst ned.
// Annons, Ny annons, Redigera annons och Förfrågan har en egen rad längst ned eller öppnas som ett eget fönster
// (Figma), så där visas ingen bottenmeny.
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import BottomNav from "./BottomNav.jsx";

const WITHOUT_NAV = [/^\/items\/[^/]+$/, /^\/items\/[^/]+\/edit$/, /^\/add-item$/, /^\/borrow-requests\/[^/]+$/];

export default function Layout() {
  const { pathname } = useLocation();
  const hideNav = WITHOUT_NAV.some((pattern) => pattern.test(pathname));

  return (
    <div className={"app" + (hideNav ? " app-no-nav" : "")}>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

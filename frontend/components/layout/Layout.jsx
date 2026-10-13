// Gemensamt sidomslag: sidhuvud överst, sidans innehåll i mitten och bottenmeny längst ned.
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import BottomNav from "./BottomNav.jsx";

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

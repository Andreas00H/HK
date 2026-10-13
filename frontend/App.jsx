// Huvudkomponent med alla rutter. Varje sida ligger i pages/ och visas inuti Layout.
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Items from "./pages/Items.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import AddItem from "./pages/AddItem.jsx";
import EditItem from "./pages/EditItem.jsx";
import Contacts from "./pages/Contacts.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BorrowingDetails from "./pages/BorrowingDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/borrow-requests/:id" element={<BorrowingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<p className="page">Sidan finns inte.</p>} />
      </Route>
    </Routes>
  );
}

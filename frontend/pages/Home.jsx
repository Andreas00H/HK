// Hem (Figma): "Annonser i" vald stad med klockan till höger, sökfält, kategorier och annonserna som kort.
// Staden leder till Profil, där den byts. Klockan visas bara för inloggade.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/items/SearchBar.jsx";
import CategoryFilter from "../components/items/CategoryFilter.jsx";
import ItemList from "../components/items/ItemList.jsx";
import RequestsBell from "../components/borrow/RequestsBell.jsx";
import Icon from "../components/common/Icon.jsx";
import { getCategories } from "../services/categoryService.js";
import { useItems } from "../hooks/useItems.js";
import { useCity } from "../hooks/useCity.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/items.css";

export default function Home() {
  const { city } = useCity();
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);

  // Kategorierna hämtas en gång. Går det fel visas bara "Alla".
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Bara mellanslag räknas som ingen sökning, både i anropet och i texten när listan är tom
  const query = search.trim();
  const { items, loading, error } = useItems({ search: query, categoryId, location: city });

  return (
    <section className="page home">
      <div className="home-top">
        <h1 className="home-heading">
          <span className="home-heading-label">Annonser i</span>
          <Link to="/profile" className="home-city">
            <Icon name="pin" />
            {city}
            <span className="visually-hidden">, byt stad</span>
            <Icon name="chevron-down" size={22} />
          </Link>
        </h1>
        {token && <RequestsBell />}
      </div>

      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter categories={categories} selectedId={categoryId} onSelect={setCategoryId} />

      {loading && <p className="muted">Hämtar annonser…</p>}

      {!loading && error && (
        <p className="message message-error" role="alert">
          Kunde inte hämta annonser. {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="message">
          {query || categoryId ? (
            <p>Inga annonser matchar din sökning.</p>
          ) : (
            <p>
              Inga annonser i {city} än. <Link to="/add-item">Bli först med att lägga upp något!</Link>
            </p>
          )}
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <h2 className="section-title">{query || categoryId ? "Sökresultat" : "Nya annonser"}</h2>
          <ItemList items={items} />
        </>
      )}
    </section>
  );
}

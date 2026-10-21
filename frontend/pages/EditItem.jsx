// Redigera egen annons (UI.UX.md, Lägg upp / Redigera). PUT /api/items/:id sparar och DELETE tar bort annonsen.
// Bara ägaren får ändra. Andra ser ett meddelande i stället för formuläret, och svarar backend ändå 403
// visas dess felmeddelande.
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ItemForm from "../components/items/ItemForm.jsx";
import { deleteItem, getItem, updateItem } from "../services/itemService.js";
import { useAuth } from "../hooks/useAuth.js";
import "../assets/styles/forms.css";
import "../assets/styles/items.css";

export default function EditItem() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.notice; // från Lägg upp om tillgängligheten inte kunde sparas

  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setItem(null);
    setError(null);

    getItem(id)
      .then((result) => {
        if (!cancelled) setItem(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Tillbaka till förra sidan i appen, oftast annonsen. Har sidan öppnats via en länk finns ingen, då går vi till annonsen.
  // React Router numrerar sidorna i webbläsarens historik (idx), där 0 är första sidan i appen.
  function goBack() {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(`/items/${id}`, { replace: true });
  }

  async function handleSubmit(fields) {
    await updateItem(id, fields, token);
    goBack();
  }

  async function handleDelete() {
    if (!window.confirm("Ta bort annonsen? Förfrågningar och omdömen som hör till den tas också bort. Det går inte att ångra.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteItem(id, token);
      // replace: annonsen finns inte längre, så Tillbaka ska inte leda hit
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }

  const topBar = (
    <div className="details-topbar">
      <button type="button" className="back-link" onClick={goBack}>
        ← Tillbaka
      </button>
    </div>
  );

  if (error) {
    return (
      <section className="page form-page">
        {topBar}
        <p className="message message-error" role="alert">
          Kunde inte hämta annonsen. {error}
        </p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="page form-page">
        {topBar}
        <p className="muted">Hämtar annonsen…</p>
      </section>
    );
  }

  if (item.owner_id !== user.id) {
    return (
      <section className="page form-page">
        {topBar}
        <div className="message" role="alert">
          <p>
            Du kan bara redigera dina egna annonser. <Link to={`/items/${item.id}`}>Till annonsen</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page form-page">
      {topBar}
      <h1 className="page-title">Redigera annons</h1>

      {notice && (
        <div className="message" role="status">
          <p>{notice}</p>
        </div>
      )}

      <ItemForm
        key={item.id}
        initialValues={{
          image_url: item.image_url || "",
          name: item.name,
          category_id: String(item.category_id),
          condition: item.condition,
          lending_price: String(item.lending_price),
          location: item.location,
          description: item.description,
          available: item.available,
        }}
        submitLabel="Spara ändringar"
        sendingLabel="Sparar…"
        onSubmit={handleSubmit}
      />

      <button type="button" className="btn btn-danger btn-block" onClick={handleDelete} disabled={deleting}>
        {deleting ? "Tar bort…" : "Ta bort annons"}
      </button>
      {deleteError && (
        <p className="form-error" role="alert">
          {deleteError}
        </p>
      )}
    </section>
  );
}

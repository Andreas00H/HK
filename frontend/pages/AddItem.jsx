// Ny annons (Figma): kryss och rubrik överst, formuläret under. Skickas med POST /api/items och JWT.
// Staden förifylls med den valda staden från profilen. Efter publicering visas den nya annonsen.
import { useNavigate } from "react-router-dom";
import ItemForm from "../components/items/ItemForm.jsx";
import TopBar from "../components/common/TopBar.jsx";
import { createItem, updateItem } from "../services/itemService.js";
import { useAuth } from "../hooks/useAuth.js";
import { useCity } from "../hooks/useCity.js";
import "../assets/styles/forms.css";

export default function AddItem() {
  const { token } = useAuth();
  const { city } = useCity();
  const navigate = useNavigate();

  // Krysset stänger: tillbaka till förra sidan i appen, eller till Hem om sidan öppnades direkt.
  // React Router numrerar sidorna i webbläsarens historik (idx), där 0 är första sidan i appen.
  function handleClose() {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  }

  async function handleSubmit(fields) {
    const item = await createItem(fields, token);

    // POST tar inte emot available, så en annons som inte ska vara tillgänglig ändras direkt efteråt.
    // Misslyckas det är annonsen ändå publicerad. Då skickas man till Redigera, så att den inte publiceras två gånger.
    if (!fields.available && item.available) {
      try {
        await updateItem(item.id, { available: false }, token);
      } catch {
        navigate(`/items/${item.id}/edit`, {
          replace: true,
          state: { notice: "Annonsen är publicerad men visas som tillgänglig. Stäng av tillgängligheten och spara igen." },
        });
        return;
      }
    }

    // replace: Tillbaka från annonsen ska inte leda till ett ifyllt formulär som kan publiceras en gång till
    navigate(`/items/${item.id}`, { replace: true });
  }

  return (
    <section className="page form-page">
      <TopBar title="Ny annons" variant="close" onBack={handleClose} />
      <ItemForm
        initialValues={{
          image_url: "",
          name: "",
          category_id: "",
          condition: "",
          lending_price: "",
          deposit: "",
          location: city,
          area: "",
          description: "",
          available: true,
        }}
        submitLabel="Publicera annons"
        sendingLabel="Publicerar…"
        onSubmit={handleSubmit}
      />
    </section>
  );
}

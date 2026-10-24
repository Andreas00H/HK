// Formulär för att skapa och redigera annons (UI.UX.md, Lägg upp / Redigera). Används av AddItem och EditItem.
// Fälten kontrolleras innan något skickas. onSubmit får fälten i det format backend vill ha och ska kasta fel
// om det inte gick att spara, då visas backendens meddelande ovanför knappen.
import { useEffect, useState } from "react";
import Input from "../common/Input.jsx";
import { getCategories } from "../../services/categoryService.js";

// Skick att välja mellan. En annons med annat skick (t.ex. skapad i Postman) behåller sitt eget som ett extra val.
const CONDITIONS = ["Nyskick", "Mycket bra", "Bra", "Okej", "Har brister"];

// Samma gräns för pris per dag som backend
const MAX_PRICE = 100000;

// Bilden måste vara en vanlig webbadress
function isImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Kontrollerar fälten i samma ordning som de visas. Returnerar ett fel per fält, tomt objekt om allt är ok.
function validate(values) {
  const errors = {};
  if (!isImageUrl(values.image_url.trim())) errors.image_url = "Fyll i en länk till en bild som börjar med http:// eller https://.";
  if (!values.name.trim()) errors.name = "Fyll i en rubrik.";
  if (!values.category_id) errors.category_id = "Välj en kategori.";
  if (!values.condition) errors.condition = "Välj skick.";
  const price = Number(values.lending_price);
  if (values.lending_price === "" || !Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
    errors.lending_price = "Fyll i ett pris mellan 0 och 100 000 kr.";
  }
  if (values.deposit !== "") {
    const deposit = Number(values.deposit);
    if (!Number.isFinite(deposit) || deposit < 0 || deposit > MAX_PRICE) {
      errors.deposit = "Fyll i en handpenning mellan 0 och 100 000 kr, eller lämna tomt.";
    }
  }
  if (!values.location.trim()) errors.location = "Fyll i stad.";
  if (!values.description.trim()) errors.description = "Skriv en beskrivning.";
  return errors;
}

export default function ItemForm({ initialValues, submitLabel, sendingLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(null);
  const [errors, setErrors] = useState({}); // ett fel per fält, plus form för fel från backend
  const [sending, setSending] = useState(false);
  const [brokenImage, setBrokenImage] = useState(null); // bild-URL som inte gick att visa

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategoryError("Kunde inte hämta kategorier. Ladda om sidan."));
  }, []);

  const conditions =
    !initialValues.condition || CONDITIONS.includes(initialValues.condition)
      ? CONDITIONS
      : [...CONDITIONS, initialValues.condition];

  const imageUrl = values.image_url.trim();
  const imageBroken = imageUrl !== "" && brokenImage === imageUrl;

  function update(field) {
    return (event) => setValues({ ...values, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    const firstError = Object.keys(fieldErrors)[0];
    if (firstError) {
      // Formuläret är långt, så markören flyttas till första felet
      document.getElementById(firstError)?.focus();
      return;
    }

    setSending(true);
    try {
      await onSubmit({
        image_url: imageUrl,
        name: values.name.trim(),
        category_id: Number(values.category_id),
        condition: values.condition,
        lending_price: Number(values.lending_price),
        // Frivilliga fält: tomt skickas som null så att ett tidigare värde tas bort vid redigering
        deposit: values.deposit === "" ? null : Number(values.deposit),
        location: values.location.trim(),
        area: values.area.trim() || null,
        description: values.description.trim(),
        available: values.available,
      });
    } catch (err) {
      setErrors({ form: err.message });
      setSending(false);
    }
  }

  return (
    <form className="card item-form" onSubmit={handleSubmit} noValidate>
      {/* Uppladdning av foton finns inte i v1, en länk till bilden räcker (Projektplan 8.10) */}
      <Input
        id="image_url"
        label="Bild (länk)"
        type="url"
        value={values.image_url}
        onChange={update("image_url")}
        error={errors.image_url}
        hint={imageBroken ? "Bilden kunde inte visas. Kontrollera länken." : "Länk till en bild på saken, t.ex. https://…"}
        maxLength={2000}
      />
      {isImageUrl(imageUrl) && !imageBroken && (
        <div className="image-preview">
          <img src={imageUrl} alt="Förhandsvisning av bilden" onError={() => setBrokenImage(imageUrl)} />
        </div>
      )}

      <Input id="name" label="Rubrik" value={values.name} onChange={update("name")} error={errors.name} maxLength={150} />

      <Input
        as="select"
        id="category_id"
        label="Kategori"
        value={values.category_id}
        onChange={update("category_id")}
        error={errors.category_id || categoryError}
      >
        <option value="">Välj kategori</option>
        {categories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.name}
          </option>
        ))}
      </Input>

      <Input
        as="select"
        id="condition"
        label="Skick"
        value={values.condition}
        onChange={update("condition")}
        error={errors.condition}
      >
        <option value="">Välj skick</option>
        {conditions.map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </Input>

      {/* Pris och handpenning bredvid varandra (UI.UX.md, Lägg upp) */}
      <div className="field-row">
        <Input
          id="lending_price"
          label="Pris per dag (kr)"
          type="number"
          inputMode="numeric"
          min="0"
          max={MAX_PRICE}
          value={values.lending_price}
          onChange={update("lending_price")}
          error={errors.lending_price}
        />
        <Input
          id="deposit"
          label="Handpenning (kr)"
          type="number"
          inputMode="numeric"
          min="0"
          max={MAX_PRICE}
          placeholder="0"
          value={values.deposit}
          onChange={update("deposit")}
          error={errors.deposit}
          hint="Frivilligt. Betalas utanför appen."
        />
      </div>

      {/* Stad och stadsdel bredvid varandra. Annonser filtreras bara på stad. */}
      <div className="field-row">
        <Input
          id="location"
          label="Stad"
          autoComplete="address-level2"
          value={values.location}
          onChange={update("location")}
          error={errors.location}
          maxLength={100}
        />
        <Input
          id="area"
          label="Stadsdel (frivilligt)"
          placeholder="t.ex. Södermalm"
          value={values.area}
          onChange={update("area")}
          error={errors.area}
          maxLength={100}
        />
      </div>

      <Input
        as="textarea"
        id="description"
        label="Beskrivning"
        rows={5}
        value={values.description}
        onChange={update("description")}
        error={errors.description}
        hint="Skriv gärna om priset går att förhandla och när saken ska vara tillbaka."
        maxLength={2000}
      />

      <div className="field">
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={values.available}
            onChange={(event) => setValues({ ...values, available: event.target.checked })}
            aria-describedby="available-message"
          />
          Tillgänglig för utlåning
        </label>
        <p id="available-message" className="field-hint">
          Stäng av om saken inte kan lånas just nu. Den syns då inte på Hem.
        </p>
      </div>

      {errors.form && (
        <p className="field-error" role="alert">
          {errors.form}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
        {sending ? sendingLabel : submitLabel}
      </button>
    </form>
  );
}

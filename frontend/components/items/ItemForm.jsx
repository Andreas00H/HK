// Formulär för att skapa och redigera annons (Figma: Ny annons). Används av AddItem och EditItem.
// Fälten kontrolleras innan något skickas. onSubmit får fälten i det format backend vill ha och ska kasta fel
// om det inte gick att spara, då visas backendens meddelande ovanför knappen.
// Backend har en bild per annons (image_url), så fotot är en länk. Handpenning, stad, stadsdel och Tillgänglig
// finns inte i designen men i backend och UI.UX.md, så de ligger efter designens fält.
import { useEffect, useState } from "react";
import Input from "../common/Input.jsx";
import Icon from "../common/Icon.jsx";
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
  if (!values.description.trim()) errors.description = "Skriv en beskrivning.";
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
  if (!values.condition) errors.condition = "Välj skick.";
  if (!values.location.trim()) errors.location = "Fyll i stad.";
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
  const showPreview = isImageUrl(imageUrl) && !imageBroken;

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
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="image_url">Foto</label>
        {/* Ett tryck på rutan flyttar markören till länkfältet under. Rutan är bara utseende för skärmläsare. */}
        <div
          className={"photo-tile" + (showPreview ? "" : " photo-add")}
          aria-hidden="true"
          onClick={() => document.getElementById("image_url")?.focus()}
        >
          {showPreview ? (
            <img src={imageUrl} alt="" onError={() => setBrokenImage(imageUrl)} />
          ) : (
            <>
              <Icon name="camera" />
              Lägg till
            </>
          )}
        </div>
        <input
          id="image_url"
          type="url"
          placeholder="Klistra in en länk till bilden"
          value={values.image_url}
          onChange={update("image_url")}
          aria-invalid={errors.image_url ? true : undefined}
          aria-describedby="image_url-message"
          maxLength={2000}
        />
        <p id="image_url-message" className={errors.image_url ? "field-error" : "field-hint"}>
          {errors.image_url ||
            (imageBroken ? "Bilden kunde inte visas. Kontrollera länken." : "Bilden blir omslag i annonsen.")}
        </p>
      </div>

      <Input
        id="name"
        label="Rubrik"
        placeholder="Till exempel HDMI kabel 2 m"
        value={values.name}
        onChange={update("name")}
        error={errors.name}
        maxLength={150}
      />

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
        as="textarea"
        id="description"
        label="Beskrivning"
        placeholder="Beskriv skick, storlek och var den hämtas"
        rows={4}
        value={values.description}
        onChange={update("description")}
        error={errors.description}
        maxLength={2000}
      />

      {/* Pris och handpenning bredvid varandra (UI.UX.md, Lägg upp). Handpenningen betalas utanför appen. */}
      <div className="field-row">
        <Input
          id="lending_price"
          label={
            <>
              Pris per dag<span className="visually-hidden"> i kronor</span>
            </>
          }
          type="number"
          inputMode="numeric"
          min="0"
          max={MAX_PRICE}
          placeholder="0"
          suffix="kr/dag"
          value={values.lending_price}
          onChange={update("lending_price")}
          error={errors.lending_price}
        />
        <Input
          id="deposit"
          label={
            <>
              Handpenning<span className="visually-hidden"> i kronor</span>
            </>
          }
          type="number"
          inputMode="numeric"
          min="0"
          max={MAX_PRICE}
          placeholder="0"
          suffix="kr"
          value={values.deposit}
          onChange={update("deposit")}
          error={errors.deposit}
          hint="Frivilligt. Betalas utanför appen."
        />
      </div>

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
          label="Stadsdel"
          placeholder="t.ex. Södermalm"
          value={values.area}
          onChange={update("area")}
          error={errors.area}
          hint="Frivilligt."
          maxLength={100}
        />
      </div>

      <label className="switch-field">
        <span>
          <span className="switch-label">Tillgänglig för utlåning</span>
          <span className="field-hint">Stäng av om saken inte kan lånas just nu. Den syns då inte på Hem.</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          className="switch"
          checked={values.available}
          onChange={(event) => setValues({ ...values, available: event.target.checked })}
        />
      </label>

      <p className="info-box">Tips: vill du kunna förhandla priset, skriv det i beskrivningen.</p>

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

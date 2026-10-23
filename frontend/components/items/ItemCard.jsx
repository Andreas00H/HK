// Annonskort (Figma): bild, rubrik, dygnspris och stad. Hela kortet är en länk till annonsen.
// Saknas bilden, eller går den inte att visa, syns en kamera på grå botten.
// Hem visar bara lediga annonser. "Inte tillgänglig" syns bara för ägaren under Mina annonser.
import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";
import { formatPrice } from "./formatPrice.js";

export default function ItemCard({ item }) {
  const [broken, setBroken] = useState(false);

  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <div className="item-card-image">
        {item.image_url && !broken ? (
          <img src={item.image_url} alt={item.name} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <Icon name="camera" size={28} />
        )}
      </div>
      <div className="item-card-body">
        <h2 className="item-card-title">{item.name}</h2>
        <p className="item-card-price">{formatPrice(item.lending_price)}</p>
        <p className="item-card-location">
          <Icon name="pin" size={16} />
          {item.location}
        </p>
        {!item.available && <span className="badge badge-returned">Inte tillgänglig</span>}
      </div>
    </Link>
  );
}

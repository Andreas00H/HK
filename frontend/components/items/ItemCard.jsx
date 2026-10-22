// Annonskort: foto, rubrik, dygnspris, stad och "Ledig" eller "Inte tillgänglig". Hela kortet är en länk till annonsen.
import { Link } from "react-router-dom";
import { formatPrice } from "./formatPrice.js";

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <div className="item-card-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} loading="lazy" />
        ) : (
          <span className="item-card-noimage">Ingen bild</span>
        )}
      </div>
      <div className="item-card-body">
        <h2 className="item-card-title">{item.name}</h2>
        <p className="item-card-price">{formatPrice(item.lending_price)}</p>
        <div className="item-card-footer">
          <span className="muted">{item.location}</span>
          {/* Hem visar bara lediga annonser. Ej tillgängliga syns bara för ägaren under Mina annonser. */}
          {item.available ? (
            <span className="badge badge-available">Ledig</span>
          ) : (
            <span className="badge badge-returned">Inte tillgänglig</span>
          )}
        </div>
      </div>
    </Link>
  );
}

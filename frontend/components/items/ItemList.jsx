// Rutnät av annonskort: 2 per rad i mobil, 3 på surfplatta och 4 på dator.
import ItemCard from "./ItemCard.jsx";

export default function ItemList({ items }) {
  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}

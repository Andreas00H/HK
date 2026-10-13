// Hook som hämtar annonser när filtren ändras. Returnerar annonserna plus laddnings- och felläge.
import { useEffect, useState } from "react";
import { getItems } from "../services/itemService.js";

export function useItems({ search, categoryId, location }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // hindrar att ett gammalt svar skriver över ett nyare
    setLoading(true);
    setError(null);

    // Väntar 300 ms efter sista tangenttrycket innan vi frågar backend
    const timer = setTimeout(() => {
      getItems({ search, categoryId, location })
        .then((result) => {
          if (!cancelled) setItems(result);
        })
        .catch((err) => {
          if (!cancelled) setError(err.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, categoryId, location]);

  return { items, loading, error };
}

// Hook som hämtar den inloggades låneförfrågningar (GET /api/borrow-requests/my).
// sent = förfrågningar jag har skickat, received = förfrågningar på mina annonser.
// Används t.ex. så här: const { received, loading, error } = useBorrowRequests();
import { useEffect, useState } from "react";
import { getMyBorrowRequests } from "../services/borrowRequestService.js";
import { useAuth } from "./useAuth.js";

export function useBorrowRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // hindrar att ett gammalt svar skriver över ett nyare
    setLoading(true);
    setError(null);

    getMyBorrowRequests(token)
      .then((result) => {
        if (!cancelled) setRequests(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return { sent: requests.sent, received: requests.received, loading, error };
}

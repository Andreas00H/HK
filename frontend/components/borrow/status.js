// Statusar för låneförfrågningar: text i appen (UI.UX.md 4.5) och vilka byten ägaren får göra (Projektplan 8.5–8.6).

export const STATUS_LABELS = {
  REQUESTED: "Väntar",
  ACCEPTED: "Godkänd",
  DECLINED: "Nekad",
  BORROWED: "Utlånad",
  RETURNED: "Återlämnad",
  COMPLETED: "Avslutad",
};

// Knappar för ägaren per status. Samma byten som backend tillåter (PUT /api/borrow-requests/:id).
// Lånaren har inga knappar i v1, bara ägaren ändrar status.
export const OWNER_ACTIONS = {
  REQUESTED: [
    { status: "ACCEPTED", label: "Godkänn" },
    { status: "DECLINED", label: "Neka", danger: true },
  ],
  ACCEPTED: [
    { status: "BORROWED", label: "Markera utlämnad" },
    { status: "DECLINED", label: "Avböj", danger: true },
  ],
  BORROWED: [{ status: "RETURNED", label: "Markera återlämnad" }],
  RETURNED: [{ status: "COMPLETED", label: "Avsluta lånet" }],
  DECLINED: [],
  COMPLETED: [],
};

// Kontaktuppgifter syns under Kontakter från och med godkännandet
export const CONTACT_STATUSES = ["ACCEPTED", "BORROWED", "RETURNED", "COMPLETED"];

// Kort text om vad som händer härnäst, beroende på om man är ägare eller lånare
export function nextStepText(status, isOwner) {
  switch (status) {
    case "REQUESTED":
      return isOwner
        ? "Godkänn eller neka förfrågan. Titta gärna på lånarens omdömen först."
        : "Väntar på att ägaren svarar.";
    case "ACCEPTED":
      return isOwner
        ? "Kom överens om upphämtning och betalning. Markera som utlämnad när lånaren har hämtat saken."
        : "Ägaren har godkänt. Kom överens om upphämtning och betalning.";
    case "BORROWED":
      return isOwner
        ? "Markera som återlämnad när du har fått tillbaka saken."
        : "Lånet pågår. Lämna tillbaka saken enligt överenskommelsen.";
    case "RETURNED":
      return isOwner ? "Avsluta lånet när allt är klart." : "Saken är återlämnad. Väntar på att ägaren avslutar lånet.";
    case "COMPLETED":
      return "Lånet är avslutat.";
    case "DECLINED":
      return isOwner ? "Du har nekat förfrågan." : "Ägaren har nekat förfrågan.";
    default:
      return "";
  }
}

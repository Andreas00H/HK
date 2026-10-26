// Rad överst på undersidor med tillbaka- eller stängknapp och rubrik (Figma: Ny annons, Ny förfrågan).
// variant="close" ger ett kryss och rubriken i mitten, annars en pil och rubriken till vänster.
import Icon from "./Icon.jsx";

export default function TopBar({ title, onBack, variant = "back" }) {
  const close = variant === "close";

  return (
    <div className={"top-bar" + (close ? " top-bar-center" : "")}>
      <button type="button" className="top-bar-button" onClick={onBack} aria-label={close ? "Stäng" : "Tillbaka"}>
        <Icon name={close ? "close" : "chevron-left"} />
      </button>
      {title && <h1 className="top-bar-title">{title}</h1>}
    </div>
  );
}

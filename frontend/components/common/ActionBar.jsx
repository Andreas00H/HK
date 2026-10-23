// Fast rad längst ned med t.ex. pris till vänster och knappar till höger (Figma: Annons, Förfrågan).
// message visas ovanför knapparna, t.ex. ett felmeddelande. Sidan behöver klassen has-action-bar
// så att innehållet inte hamnar bakom raden.
export default function ActionBar({ summary, message, children }) {
  return (
    <div className="action-bar">
      <div className="action-bar-inner">
        {message}
        <div className="action-bar-row">
          {summary && <div className="action-bar-summary">{summary}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

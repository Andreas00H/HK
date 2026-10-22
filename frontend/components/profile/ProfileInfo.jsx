// Kortet Mina uppgifter på Profil (UI.UX.md 8.1): initial, namn, "Medlem sedan" och e-post och telefon.
// Uppgifterna kan inte ändras i v1 (backend har ingen PUT för användare).
export default function ProfileInfo({ name, email, phone, memberSince }) {
  return (
    <div className="card">
      <h2 className="section-title">Mina uppgifter</h2>
      <div className="owner-box">
        <span className="avatar" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="owner-name">{name}</p>
          {memberSince && <p className="muted">Medlem sedan {memberSince}</p>}
        </div>
      </div>
      <dl className="info-rows">
        <div>
          <dt>E-post</dt>
          <dd>{email}</dd>
        </div>
        <div>
          <dt>Telefon</dt>
          <dd>{phone}</dd>
        </div>
      </dl>
    </div>
  );
}

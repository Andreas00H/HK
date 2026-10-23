// Kortet Mina uppgifter på Profil (Figma, gruppens stil): initial, namn, "Medlem sedan" och e-post och telefon.
// Uppgifterna kan inte ändras i v1 (backend har ingen PUT för användare), så "Ändra uppgifter" finns inte än.
export default function ProfileInfo({ name, email, phone, memberSince }) {
  return (
    <div className="card profile-info">
      <h2 className="section-title">Mina uppgifter</h2>
      <div className="profile-person">
        <span className="avatar avatar-square" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="person-name">{name}</p>
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

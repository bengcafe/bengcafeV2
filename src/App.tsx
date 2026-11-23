import { FormEvent, useEffect, useMemo, useState } from "react";

type Language = "fr" | "en";

const giftUrl = "https://buy.stripe.com/4gM28tcvr6OZ36s4YU38400";
const mapUrl = "https://maps.app.goo.gl/H43fJDd2D6WoG4i27";

const copy = {
  fr: {
    nav: ["Le lieu", "Menus", "Boissons", "Infos"],
    gift: "Offrir un bon cadeau",
    heroEyebrow: "Coffee shop indépendant · Quimper",
    hero: "Café de spécialité & cuisine maison de saison, au cœur de Quimper",
    discover: "Découvrir les menus",
    find: "Nous trouver",
    open: "Ouvert",
    closed: "Fermé",
    placeKicker: "Bienvenue chez Beng",
    placeTitle: "Un café vivant, doux et généreux",
    placeText:
      "Beng, c’est une cuisine faite maison, du café choisi avec soin et un lieu coloré où l’on vient prendre son temps. Tout est préparé sur place, au fil des saisons.",
    strengths: [
      ["Café de spécialité", "Des grains sélectionnés et extraits avec précision."],
      ["Fait maison", "Une carte courte, cuisinée sur place avec des produits de saison."],
      ["Pour tous", "Options végétariennes et une équipe à votre écoute."],
    ],
    menusKicker: "À table",
    menusTitle: "Du salé, du sucré, du bon",
    lunch: "Midi",
    lunchTime: "Mardi — vendredi · 12h — 14h",
    lunchText:
      "Le menu change chaque semaine, selon l’inspiration de la cuisine et les produits du moment.",
    formula: "Formule plat + dessert",
    brunch: "Brunch",
    brunchTime: "Samedi · 10h30 — 14h",
    brunches: [
      ["Classique", "18,50 €", ["Salé", "Sucré", "Boisson"]],
      ["Gourmand", "24,50 €", ["Salé", "Sucré", "Bacon & œufs", "2 boissons"]],
      ["Kids · −10 ans", "10 €", ["Petit salé", "Pancake ou salade de fruits", "Sirop ou jus"]],
    ],
    pastries: "Pâtisseries sèches disponibles toute la journée.",
    counter: "Commande et paiement au comptoir",
    drinksKicker: "À boire",
    drinksTitle: "Bien plus qu’un café",
    drinkGroups: [
      [
        "Chaudes",
        [
          ["Espresso", "2,20 €"],
          ["Allongé", "2,50 €"],
          ["Double espresso", "3,80 €"],
          ["Cappuccino", "4,50 €"],
          ["Flat white", "4,80 €"],
          ["Chai latte", "5 €"],
          ["Thé / infusion", "4,50 €"],
        ],
      ],
      [
        "Froides",
        [
          ["Café glacé", "4,50 €"],
          ["Chai glacé", "5 €"],
          ["Citronnade maison", "4,50 €"],
          ["Jus de pomme bio", "4 €"],
          ["Kombucha", "5 €"],
          ["Sirop à l’eau", "2,50 €"],
        ],
      ],
      [
        "Suppléments",
        [
          ["Lait végétal", "+0,50 €"],
          ["Shot espresso", "+1 €"],
          ["Sirop", "+0,50 €"],
          ["Décaféiné", "+0,30 €"],
        ],
      ],
    ],
    giftKicker: "À offrir",
    giftTitle: "Une pause Beng en cadeau",
    giftText:
      "Pour un brunch, un déjeuner ou une douceur : choisissez le montant, et faites plaisir.",
    steps: [
      ["01", "Choisissez votre montant"],
      ["02", "Recevez le bon par email"],
      ["03", "Présentez-le au comptoir"],
    ],
    privatize: "Privatisez le lieu",
    privateText: "Un anniversaire, un atelier ou un événement à imaginer ? Parlons-en.",
    write: "Nous écrire",
    galleryKicker: "En images",
    galleryTitle: "Un peu de Beng dans votre feed",
    instagram: "Suivre @beng.cafe.quimper",
    infoKicker: "Venir chez Beng",
    infoTitle: "On vous attend",
    hours: "Horaires",
    address: "Adresse",
    contact: "Contact",
    route: "Itinéraire",
    days: ["Mardi", "Mercredi — samedi", "Dimanche — lundi"],
    times: ["11h — 18h", "10h — 18h", "Fermé"],
    mapLabel: "Plan stylisé du centre de Quimper",
    footer: "Beng Café · Fait maison à Quimper",
    legal: "© 2025 — Tous droits réservés",
    modalTitle: "Parlez-nous de votre événement",
    modalText: "Donnez-nous quelques détails, nous vous répondrons rapidement.",
    fields: {
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      date: "Date souhaitée",
      guests: "Nombre de personnes",
      message: "Votre message",
    },
    consent: "J’accepte que mes informations soient utilisées pour répondre à ma demande.",
    send: "Envoyer la demande",
    sending: "Envoi…",
    required: "Merci de remplir les champs obligatoires et de vérifier votre email.",
    successTitle: "Merci, c’est bien reçu !",
    successText: "L’équipe Beng revient vers vous au plus vite.",
    close: "Fermer",
  },
  en: {
    nav: ["The café", "Menus", "Drinks", "Info"],
    gift: "Give a gift card",
    heroEyebrow: "Independent coffee shop · Quimper",
    hero: "Specialty coffee & seasonal homemade food in the heart of Quimper",
    discover: "Explore our menus",
    find: "Find us",
    open: "Open",
    closed: "Closed",
    placeKicker: "Welcome to Beng",
    placeTitle: "A lively, warm and generous café",
    placeText:
      "Beng is all about homemade food, carefully selected coffee and a colourful place to slow down. Everything is prepared here, following the seasons.",
    strengths: [
      ["Specialty coffee", "Carefully sourced beans, brewed with precision."],
      ["Homemade", "A short menu, cooked here with seasonal produce."],
      ["For everyone", "Vegetarian options and a team here to help."],
    ],
    menusKicker: "At the table",
    menusTitle: "Savoury, sweet, all good",
    lunch: "Lunch",
    lunchTime: "Tuesday — Friday · 12 pm — 2 pm",
    lunchText:
      "Our menu changes every week, inspired by our kitchen and the best produce of the moment.",
    formula: "Main + dessert set menu",
    brunch: "Brunch",
    brunchTime: "Saturday · 10:30 am — 2 pm",
    brunches: [
      ["Classic", "€18.50", ["Savoury plate", "Sweet treat", "Drink"]],
      ["Generous", "€24.50", ["Savoury plate", "Sweet treat", "Bacon & eggs", "2 drinks"]],
      [
        "Kids · under 10",
        "€10",
        ["Small savoury plate", "Pancake or fruit salad", "Syrup drink or juice"],
      ],
    ],
    pastries: "Dry pastries available throughout the day.",
    counter: "Order and pay at the counter",
    drinksKicker: "To drink",
    drinksTitle: "So much more than coffee",
    drinkGroups: [
      [
        "Hot",
        [
          ["Espresso", "€2.20"],
          ["Americano", "€2.50"],
          ["Double espresso", "€3.80"],
          ["Cappuccino", "€4.50"],
          ["Flat white", "€4.80"],
          ["Chai latte", "€5"],
          ["Tea / herbal tea", "€4.50"],
        ],
      ],
      [
        "Cold",
        [
          ["Iced coffee", "€4.50"],
          ["Iced chai", "€5"],
          ["Homemade lemonade", "€4.50"],
          ["Organic apple juice", "€4"],
          ["Kombucha", "€5"],
          ["Syrup & water", "€2.50"],
        ],
      ],
      [
        "Extras",
        [
          ["Plant-based milk", "+€0.50"],
          ["Espresso shot", "+€1"],
          ["Syrup", "+€0.50"],
          ["Decaf", "+€0.30"],
        ],
      ],
    ],
    giftKicker: "To give",
    giftTitle: "Give someone a Beng break",
    giftText: "For brunch, lunch or a sweet treat: choose an amount and make someone’s day.",
    steps: [
      ["01", "Choose your amount"],
      ["02", "Receive it by email"],
      ["03", "Show it at the counter"],
    ],
    privatize: "Make Beng yours",
    privateText: "Planning a birthday, workshop or special event? Let’s talk.",
    write: "Write to us",
    galleryKicker: "In pictures",
    galleryTitle: "A little Beng in your feed",
    instagram: "Follow @beng.cafe.quimper",
    infoKicker: "Visit Beng",
    infoTitle: "Come say hello",
    hours: "Opening hours",
    address: "Address",
    contact: "Contact",
    route: "Directions",
    days: ["Tuesday", "Wednesday — Saturday", "Sunday — Monday"],
    times: ["11 am — 6 pm", "10 am — 6 pm", "Closed"],
    mapLabel: "Stylised map of central Quimper",
    footer: "Beng Café · Homemade in Quimper",
    legal: "© 2025 — All rights reserved",
    modalTitle: "Tell us about your event",
    modalText: "Share a few details and we’ll get back to you shortly.",
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      date: "Preferred date",
      guests: "Number of guests",
      message: "Your message",
    },
    consent: "I agree that my information may be used to answer my request.",
    send: "Send request",
    sending: "Sending…",
    required: "Please complete the required fields and check your email.",
    successTitle: "Thank you, we got it!",
    successText: "The Beng team will get back to you as soon as possible.",
    close: "Close",
  },
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

function GrainPhoto({ number, label }: { number: number; label: string }) {
  return (
    <div className={`grain-photo photo-${number}`} role="img" aria-label={label}>
      <span>BENG</span>
      <span className="photo-mark">✦</span>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>("fr");
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "error" | "sending" | "success">("idle");
  const t = copy[language];

  const isOpen = useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const day = parts.find((part) => part.type === "weekday")?.value;
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    const time = hour * 60 + minute;
    if (day === "Tue") return time >= 660 && time < 1080;
    if (["Wed", "Thu", "Fri", "Sat"].includes(day || "")) return time >= 600 && time < 1080;
    return false;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setModalOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    if (!form.checkValidity() || !email.includes("@")) {
      setFormState("error");
      return;
    }
    setFormState("sending");
    window.setTimeout(() => setFormState("success"), 650);
  };

  const openModal = () => {
    setFormState("idle");
    setModalOpen(true);
  };

  return (
    <div className="site-shell">
      <header className="header">
        <a href="#top" className="logo" aria-label="Beng Café, accueil">
          <span>B</span> BENG CAFÉ
        </a>
        <nav className="nav" aria-label="Navigation principale">
          {t.nav.map((item, index) => (
            <a key={item} href={["#lieu", "#menus", "#boissons", "#infos"][index]}>
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="lang-switch" aria-label="Language">
            {(["fr", "en"] as Language[]).map((lang) => (
              <button
                key={lang}
                className={language === lang ? "active" : ""}
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            className="button button-dark header-gift"
            href={giftUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t.gift}
            <Arrow diagonal />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="orb orb-three" />
          <div className="hero-inner">
            <div className="status-line">
              <p className="eyebrow">{t.heroEyebrow}</p>
              <span className={`status ${isOpen ? "open" : ""}`}>
                <i />
                {isOpen ? t.open : t.closed}
              </span>
            </div>
            <h1>{t.hero}</h1>
            <div className="hero-actions">
              <a className="button button-dark" href="#menus">
                {t.discover}
                <Arrow />
              </a>
              <a className="button button-light" href="#infos">
                {t.find}
                <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>GOOD FOOD · GOOD MOOD · </span>
            <b>B</b>
          </div>
        </section>

        <section className="place section-pad" id="lieu">
          <div className="section-heading">
            <p className="eyebrow">{t.placeKicker}</p>
            <h2>{t.placeTitle}</h2>
          </div>
          <div className="place-grid">
            <GrainPhoto number={1} label="Ambiance colorée du Beng Café" />
            <div className="place-copy">
              <p className="lead">{t.placeText}</p>
              <div className="strengths">
                {t.strengths.map(([title, text], index) => (
                  <article key={title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="menus section-pad" id="menus">
          <div className="section-heading centered">
            <p className="eyebrow">{t.menusKicker}</p>
            <h2>{t.menusTitle}</h2>
          </div>
          <div className="lunch-card">
            <div>
              <span className="mini-label">01</span>
              <h3>{t.lunch}</h3>
              <p className="time">{t.lunchTime}</p>
            </div>
            <p>{t.lunchText}</p>
            <div className="formula">
              <span>{t.formula}</span>
              <strong>19,50 €</strong>
            </div>
          </div>
          <div className="brunch-head">
            <div>
              <span className="mini-label">02</span>
              <h3>{t.brunch}</h3>
            </div>
            <p className="time">{t.brunchTime}</p>
          </div>
          <div className="brunch-grid">
            {t.brunches.map(([title, price, items], index) => (
              <article className={`brunch-card card-${index + 1}`} key={title as string}>
                <div className="card-top">
                  <h4>{title as string}</h4>
                  <strong>{price as string}</strong>
                </div>
                <ul>
                  {(items as string[]).map((item) => (
                    <li key={item}>
                      <span>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="menu-notes">
            <p>{t.pastries}</p>
            <p>
              <span>→</span>
              {t.counter}
            </p>
          </div>
        </section>

        <section className="drinks section-pad" id="boissons">
          <div className="section-heading">
            <p className="eyebrow">{t.drinksKicker}</p>
            <h2>{t.drinksTitle}</h2>
          </div>
          <div className="drinks-grid">
            {t.drinkGroups.map(([group, drinks], index) => (
              <article className={`drink-list drink-${index + 1}`} key={group as string}>
                <h3>{group as string}</h3>
                {(drinks as string[][]).map(([name, price]) => (
                  <div className="price-row" key={name}>
                    <span>{name}</span>
                    <i />
                    <strong>{price}</strong>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="gift section-pad">
          <div className="gift-copy">
            <p className="eyebrow">{t.giftKicker}</p>
            <h2>{t.giftTitle}</h2>
            <p className="lead">{t.giftText}</p>
            <a className="button button-dark" href={giftUrl} target="_blank" rel="noreferrer">
              {t.gift}
              <Arrow diagonal />
            </a>
          </div>
          <div className="gift-steps">
            {t.steps.map(([number, text]) => (
              <div key={number}>
                <span>{number}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="private-strip section-pad">
          <div>
            <p className="eyebrow">{t.privatize}</p>
            <h2>{t.privateText}</h2>
          </div>
          <button className="button button-light" onClick={openModal}>
            {t.write}
            <Arrow />
          </button>
        </section>

        <section className="gallery section-pad">
          <div className="section-heading gallery-head">
            <div>
              <p className="eyebrow">{t.galleryKicker}</p>
              <h2>{t.galleryTitle}</h2>
            </div>
            <a
              className="button button-light"
              href="https://www.instagram.com/beng.cafe.quimper/"
              target="_blank"
              rel="noreferrer"
            >
              {t.instagram}
              <Arrow diagonal />
            </a>
          </div>
          <div className="gallery-grid">
            {[2, 3, 4, 5, 6, 7].map((number) => (
              <GrainPhoto
                key={number}
                number={number}
                label={`Beng Café — galerie ${number - 1}`}
              />
            ))}
          </div>
        </section>

        <section className="info section-pad" id="infos">
          <div className="section-heading">
            <p className="eyebrow">{t.infoKicker}</p>
            <h2>{t.infoTitle}</h2>
          </div>
          <div className="info-grid">
            <div className="info-details">
              <article>
                <h3>{t.hours}</h3>
                {t.days.map((day, i) => (
                  <p key={day}>
                    <span>{day}</span>
                    <strong>{t.times[i]}</strong>
                  </p>
                ))}
              </article>
              <article>
                <h3>{t.address}</h3>
                <p>
                  24 rue du Frout
                  <br />
                  29000 Quimper
                </p>
                <a className="button button-dark" href={mapUrl} target="_blank" rel="noreferrer">
                  {t.route}
                  <Arrow diagonal />
                </a>
              </article>
              <article>
                <h3>{t.contact}</h3>
                <a href="tel:+33256041281">02 56 04 12 81</a>
                <a href="mailto:contact@bengcafe.fr">contact@bengcafe.fr</a>
              </article>
            </div>
            <a
              className="map-card"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t.mapLabel}
            >
              <div className="map-lines" />
              <span className="map-river">ODET</span>
              <div className="map-pin">
                <b>B</b>
                <i />
              </div>
              <p>24 rue du Frout</p>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>{t.footer}</p>
        <a href="#top" className="footer-logo">
          B
        </a>
        <p>{t.legal}</p>
      </footer>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
              aria-label={t.close}
            >
              ×
            </button>
            {formState === "success" ? (
              <div className="success-state">
                <span>✓</span>
                <h2 id="modal-title">{t.successTitle}</h2>
                <p>{t.successText}</p>
                <button className="button button-dark" onClick={() => setModalOpen(false)}>
                  {t.close}
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">{t.privatize}</p>
                <h2 id="modal-title">{t.modalTitle}</h2>
                <p className="modal-intro">{t.modalText}</p>
                <form onSubmit={submit} noValidate>
                  <label>
                    {t.fields.name} *<input name="name" required />
                  </label>
                  <label>
                    {t.fields.email} *<input name="email" type="email" required />
                  </label>
                  <label>
                    {t.fields.phone}
                    <input name="phone" type="tel" />
                  </label>
                  <label>
                    {t.fields.date} *<input name="date" type="date" required />
                  </label>
                  <label>
                    {t.fields.guests} *<input name="guests" type="number" min="1" required />
                  </label>
                  <label className="wide">
                    {t.fields.message} *<textarea name="message" rows={4} required />
                  </label>
                  <label className="consent wide">
                    <input name="consent" type="checkbox" required />
                    <span>{t.consent}</span>
                  </label>
                  {formState === "error" && (
                    <p className="form-error wide" role="alert">
                      {t.required}
                    </p>
                  )}
                  <button className="button button-dark wide" disabled={formState === "sending"}>
                    {formState === "sending" ? t.sending : t.send}
                    <Arrow />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Language = "fr" | "en";

const giftUrl = "https://buy.stripe.com/4gM28tcvr6OZ36s4YU38400";
const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;
const mapQuery = "Beng Café, 24 rue du Frout, 29000 Quimper";
// Avec une clé (VITE_GOOGLE_MAPS_KEY) : API Maps Embed ; sans clé : intégration Google Maps classique.
const mapEmbedUrl = mapsKey
  ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(mapQuery)}`
  : `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`;
const mapUrl = "https://maps.app.goo.gl/H43fJDd2D6WoG4i27";
// Vidéo du hero : déposez le fichier dans le dossier public/ (hero.mp4)
const heroVideo = "/hero.mp4";
// Photo de fond de la rubrique « Le lieu » : déposez le fichier dans public/ (lieu.jpg)
const placeImage = "/lieu.jpg";
// Photo de fond de la rubrique « À boire » : déposez le fichier dans public/ (boissons.jpg)
const drinksImage = "/boissons.jpg";
const heroLoopSeconds = 30;
// Par défaut : envoi direct vers contact@bengcafe.fr via FormSubmit (1re demande = mail d'activation à confirmer).
// Pour utiliser un autre service (Formspree…), définir VITE_FORM_ENDPOINT sur Vercel.
const formEndpoint =
  (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ||
  "https://formsubmit.co/ajax/contact@bengcafe.fr";

const copy = {
  fr: {
    nav: ["Le lieu", "Boissons", "Menus", "Infos"],
    gift: "Offrir un bon cadeau",
    giftShort: "Bon cadeau",
    heroEyebrow: "Coffee shop indépendant · Quimper",
    hero: "Café de spécialité\nDéjeuner en semaine\nBrunch le samedi",
    discover: "Découvrir les menus",
    find: "Nous trouver",
    open: "Ouvert",
    closed: "Fermé",
    placeKicker: "Le lieu",
    placeTitle: "Convivial et chaleureux",
    placeText:
      "Chez Beng, on aime que chacun se sente bien. Le lieu est cosy, l’accueil est simple et le café de spécialité est soigneusement sélectionné. Notre cuisine est fraîche, faite maison, et elle change avec les saisons. Du mardi au vendredi, nous servons le déjeuner. Le samedi, c’est brunch. Le reste du temps, installez-vous avec un café et une pâtisserie.",
    strengths: [
      ["Cafés de spécialité", "Des cafés soigneusement sélectionnés, à savourer sans se presser."],
      ["Fait maison", "Une cuisine fraîche, préparée avec soin."],
      ["Produits de saison", "Une carte qui change au fil des saisons et des marchés."],
    ],
    menusKicker: "À table",
    menusTitle: "Du salé, du sucré, du bon",
    lunch: "Midi en semaine",
    lunchTime: "Mardi — vendredi · 12h — 14h",
    lunchText:
      "Les recettes changent chaque semaine, au fil des saisons et de l’inspiration de la cuisine.",
    formula: "Formule plat + dessert",
    kidsFormula: "Formule enfant −10 ans",
    kidsFormulaText: "Pâtes bolognaise ou nuggets purée, une boule de glace, un sirop à l’eau",
    brunch: "Brunch le samedi",
    brunchTime: "Samedi · 10h30 — 14h",
    brunchNote: "Les recettes changent chaque semaine",
    lunches: [
      ["Formule déjeuner", "19,50 €", ["Un plat", "Un dessert"]],
      [
        "Formule enfant −10 ans",
        "10,00 €",
        ["Pâtes bolognaise ou nuggets purée", "Une boule de glace", "Un sirop à l’eau"],
      ],
    ],
    brunches: [
      ["Brunch Classique", "18,50 €", ["Un salé", "Un sucré", "Une boisson chaude ou froide"]],
      [
        "Brunch Gourmand",
        "24,50 €",
        ["Un salé", "Un sucré", "Un bacon & œufs", "Une boisson chaude", "Une boisson froide"],
      ],
      [
        "Brunch Kids −10 ans",
        "10,00 €",
        ["Un petit salé", "Un pancake ou une salade de fruits", "Un sirop ou un jus de pomme"],
      ],
    ],
    pastries: "Pâtisseries sèches servies avec vos boissons aux horaires d’ouverture.",
    counter: "Paiement au comptoir",
    drinksKicker: "À boire",
    drinksTitle: "Bien plus qu’un café",
    drinkGroups: [
      [
        "Boissons chaudes",
        [
          ["Espresso", "2,00 €"],
          ["Double espresso", "3,50 €"],
          ["Americano", "2,50 €"],
          ["Filtre", "3,60 €"],
          ["Latte", "3,90 €"],
          ["Cappuccino", "3,80 €"],
          ["Cortado", "4,10 €"],
          ["Flat white", "4,40 €"],
          ["Mocaccino", "4,50 €"],
          ["Chocolat chaud", "4,40 €"],
          ["Chai latte", "4,50 €"],
          ["Matcha latte", "5,00 €"],
          ["Thé ou infusion", "3,80 €"],
        ],
      ],
      [
        "Boissons froides",
        [
          ["Kombucha", "4,80 €"],
          ["Limonade passion", "4,20 €"],
          ["Limonade citron vert", "4,20 €"],
          ["Limonade orange sanguine", "4,20 €"],
          ["Thé glacé maison", "3,60 €"],
          ["Maté pétillant", "4,20 €"],
          ["Orange pressée", "4,50 €"],
          ["Jus de pomme", "3,70 €"],
          ["Sirop à l’eau", "2,50 €"],
          ["Eau plate ou pétillante", "3,00 €"],
          ["Latte glacé", "3,90 €"],
          ["Matcha glacé", "5,00 €"],
          ["Matcha glacé + fraise ou mangue", "6,00 €"],
        ],
      ],
      [
        "Suppléments",
        [
          ["Alternative végétale", "0,70 €"],
          ["Sirop (caramel, vanille ou noisette)", "0,50 €"],
        ],
      ],
    ],
    giftKicker: "À offrir",
    giftTitle: "Une pause Beng en cadeau",
    giftText:
      "Pour un brunch, un déjeuner ou un simple café : faites plaisir avec un bon cadeau Beng Café.",
    steps: [
      ["01", "Choisir"],
      ["02", "Payer en ligne"],
      ["03", "Offrir"],
    ],
    privatize: "Privatisez le lieu",
    privateText: "Un anniversaire, un mariage ou un événement à imaginer ? Parlons-en.",
    write: "Nous écrire",
    galleryKicker: "Instagram",
    galleryTitle: "Suivez-nous sur les réseaux",
    instagram: "Suivre @beng.cafe.quimper",
    infoKicker: "Venir chez Beng",
    infoTitle: "On vous attend",
    hours: "Horaires",
    address: "Adresse",
    contact: "Contact",
    route: "Itinéraire",
    days: ["Mardi", "Mercredi — samedi", "Dimanche — lundi"],
    times: ["11h — 18h", "10h — 18h", "Fermé"],
    mapLabel: "Carte Google Maps : Beng Café, Quimper",
    footer: "Beng Café · Café de spécialité et cuisine maison à Quimper",
    legal: "© 2026 — Tous droits réservés",
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
    mailtoTitle: "Plus qu’une étape",
    mailtoText:
      "Votre messagerie s’ouvre avec votre demande déjà rédigée : il ne reste qu’à l’envoyer.",
    failed: "L’envoi a échoué. Réessayez ou écrivez-nous à contact@bengcafe.fr.",
    close: "Fermer",
  },
  en: {
    nav: ["The café", "Drinks", "Menus", "Info"],
    gift: "Give a gift card",
    giftShort: "Gift card",
    heroEyebrow: "Independent coffee shop · Quimper",
    hero: "Specialty coffee\nWeekday lunch\nSaturday brunch",
    discover: "Explore our menus",
    find: "Find us",
    open: "Open",
    closed: "Closed",
    placeKicker: "The place",
    placeTitle: "Friendly and welcoming",
    placeText:
      "At Beng, we want everyone to feel at ease. The place is cosy, the welcome is simple and the specialty coffee is carefully selected. Our food is fresh and homemade, and it changes with the seasons. From Tuesday to Friday, we serve lunch. On Saturday, it’s brunch. The rest of the time, make yourself comfortable with a coffee and a pastry.",
    strengths: [
      ["Specialty coffee", "Carefully selected coffee, made to be enjoyed slowly."],
      ["Homemade", "Fresh food, prepared with care."],
      ["Seasonal produce", "A menu that follows the seasons and the markets."],
    ],
    menusKicker: "At the table",
    menusTitle: "Savoury, sweet, all good",
    lunch: "Weekday lunch",
    lunchTime: "Tuesday — Friday · 12 pm — 2 pm",
    lunchText:
      "Recipes change every week, with the seasons and our kitchen’s inspiration.",
    formula: "Main + dessert set menu",
    kidsFormula: "Kids’ set menu under 10",
    kidsFormulaText: "Bolognese pasta or nuggets with mash, a scoop of ice cream, a glass of syrup with water",
    brunch: "Saturday brunch",
    brunchTime: "Saturday · 10:30 am — 2 pm",
    brunchNote: "Recipes change every week",
    lunches: [
      ["Lunch set menu", "€19.50", ["A main course", "A dessert"]],
      [
        "Kids’ set menu under 10",
        "€10.00",
        ["Bolognese pasta or nuggets with mash", "A scoop of ice cream", "A syrup with water"],
      ],
    ],
    brunches: [
      ["Classic Brunch", "€18.50", ["A savoury option", "A sweet option", "A hot or cold drink"]],
      [
        "Beng Café’s Brunch",
        "€24.50",
        ["A savoury option", "A sweet option", "A bacon & eggs", "A hot drink", "A cold drink"],
      ],
      [
        "Kids Brunch under 10",
        "€10.00",
        ["A small savoury option", "A pancake or a fruit salad", "A syrup or an apple juice"],
      ],
    ],
    pastries: "Dry pastries served with your drinks during opening hours.",
    counter: "Payment at the counter",
    drinksKicker: "To drink",
    drinksTitle: "So much more than coffee",
    drinkGroups: [
      [
        "Hot drinks",
        [
          ["Espresso", "€2.00"],
          ["Double espresso", "€3.50"],
          ["Americano", "€2.50"],
          ["Batch brew", "€3.60"],
          ["Latte", "€3.90"],
          ["Cappuccino", "€3.80"],
          ["Cortado", "€4.10"],
          ["Flat white", "€4.40"],
          ["Mocha", "€4.50"],
          ["Hot chocolate", "€4.40"],
          ["Chai latte", "€4.50"],
          ["Matcha latte", "€5.00"],
          ["Tea or herbal tea", "€3.80"],
        ],
      ],
      [
        "Cold drinks",
        [
          ["Kombucha", "€4.80"],
          ["Passion fruit lemonade", "€4.20"],
          ["Lime lemonade", "€4.20"],
          ["Blood orange lemonade", "€4.20"],
          ["Homemade iced tea", "€3.60"],
          ["Sparkling maté", "€4.20"],
          ["Fresh orange juice", "€4.50"],
          ["Apple juice", "€3.70"],
          ["Syrup with water", "€2.50"],
          ["Still or sparkling water", "€3.00"],
          ["Iced latte", "€3.90"],
          ["Iced matcha", "€5.00"],
          ["Iced matcha + strawberry or mango", "€6.00"],
        ],
      ],
      [
        "Extras",
        [
          ["Plant-based milk", "€0.70"],
          ["Syrup (caramel, vanilla or hazelnut)", "€0.50"],
        ],
      ],
    ],
    giftKicker: "To give",
    giftTitle: "Give someone a Beng break",
    giftText: "For a brunch, a lunch or a simple coffee: make someone’s day with a Beng Café gift card.",
    steps: [
      ["01", "Choose"],
      ["02", "Pay online"],
      ["03", "Give"],
    ],
    privatize: "Make Beng yours",
    privateText: "Planning a birthday, a wedding or a special event? Let’s talk.",
    write: "Write to us",
    galleryKicker: "Instagram",
    galleryTitle: "Follow us on social media",
    instagram: "Follow @beng.cafe.quimper",
    infoKicker: "Visit Beng",
    infoTitle: "Come say hello",
    hours: "Opening hours",
    address: "Address",
    contact: "Contact",
    route: "Directions",
    days: ["Tuesday", "Wednesday — Saturday", "Sunday — Monday"],
    times: ["11 am — 6 pm", "10 am — 6 pm", "Closed"],
    mapLabel: "Google Maps: Beng Café, Quimper",
    footer: "Beng Café · Specialty coffee and homemade food in Quimper",
    legal: "© 2026 — All rights reserved",
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
    mailtoTitle: "One last step",
    mailtoText: "Your email app is opening with your request already written: just send it.",
    failed: "Sending failed. Please try again or write to contact@bengcafe.fr.",
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

function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <>
        <span>B</span> BENG CAFÉ
      </>
    );
  }
  return (
    <>
      <img
        className="logo-mark"
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        onError={() => setFailed(true)}
      />
      <img className="logo-name" src="/logo-name.svg" alt="Beng Café" onError={() => setFailed(true)} />
    </>
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
  const [formState, setFormState] = useState<
    "idle" | "error" | "sending" | "success" | "mailto" | "failed"
  >("idle");
  const t = copy[language];
  const videoRef = useRef<HTMLVideoElement>(null);

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
    // Défilement rubrique par rubrique (ordinateur) : un cran de molette ou une flèche
    // amène directement à la rubrique suivante ou précédente, comme un clic dans le menu.
    // Si une rubrique est plus haute que l'écran, on la parcourt d'abord normalement.
    const desktop = window.matchMedia("(min-width: 901px) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let locked = false;
    let lockUntil = 0;
    let quiet = 0;
    let frame = 0;

    const headerHeight = () =>
      document.querySelector<HTMLElement>(".header")?.getBoundingClientRect().height ?? 70;
    const arm = () => {
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        locked = false;
      }, Math.max(160, lockUntil - performance.now()));
    };
    const lock = (ms: number) => {
      locked = true;
      lockUntil = performance.now() + ms;
      arm();
    };

    // Animation de défilement : durée d'environ 0,9 s pour passer d'une rubrique à la suivante
    const animateTo = (target: number): number => {
      const start = window.scrollY;
      const end = Math.min(Math.max(0, target), root.scrollHeight - window.innerHeight);
      const distance = Math.abs(end - start);
      if (distance < 1) return 0;
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = "auto";
      if (reduce.matches) {
        window.scrollTo(0, end);
        root.style.scrollBehavior = "";
        return 0;
      }
      const duration = Math.min(1200, 380 + distance * 0.62);
      const began = performance.now();
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      const tick = (now: number) => {
        const progress = Math.min(1, (now - began) / duration);
        window.scrollTo(0, start + (end - start) * ease(progress));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
        else root.style.scrollBehavior = "";
      };
      frame = window.requestAnimationFrame(tick);
      return duration;
    };

    // Effet « rubriques empilées » : en descendant, chaque rubrique reste en place et la suivante
    // la recouvre ; en remontant, le défilement est normal. Actif seulement si toutes les
    // rubriques tiennent dans l'écran (sinon une rubrique haute serait coupée).
    const canStack = () => {
      if (!desktop.matches) return false;
      const header = headerHeight();
      return Array.from(document.querySelectorAll<HTMLElement>("main > section")).every(
        (section) => section.offsetHeight <= window.innerHeight - header + 2,
      );
    };
    const setStack = (on: boolean) => {
      root.classList.toggle("stack-down", on && canStack());
    };

    // Renvoie true si le script a pris en charge le mouvement
    const step = (direction: 1 | -1, distance: number): boolean => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
      if (!sections.length) return false;
      setStack(direction > 0);
      // Si toutes les rubriques tiennent dans l'écran, on ne défile jamais « à moitié » :
      // on rejoint toujours le bord de la rubrique (y compris depuis le pied de page)
      const fits = canStack();
      const header = headerHeight();
      let current = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top - header <= 2) current = index;
      });
      const rect = sections[current].getBoundingClientRect();

      if (direction > 0) {
        const remaining = rect.bottom - window.innerHeight;
        if (remaining > 2) {
          if (!fits && distance < remaining) return false;
          lock(animateTo(window.scrollY + remaining) + 80);
          return true;
        }
        const next = sections[current + 1];
        const target = next
          ? next.getBoundingClientRect().top + window.scrollY - header
          : root.scrollHeight - window.innerHeight;
        if (Math.abs(target - window.scrollY) < 2) return false;
        lock(animateTo(target) + 80);
        return true;
      }

      const above = header - rect.top;
      if (above > 2) {
        if (!fits && distance < above) return false;
        lock(animateTo(window.scrollY - above) + 80);
        return true;
      }
      const previous = sections[current - 1];
      if (!previous) return false;
      lock(animateTo(previous.getBoundingClientRect().top + window.scrollY - header) + 80);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey || event.defaultPrevented) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (locked) {
        event.preventDefault();
        arm();
        return;
      }
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      if (Math.abs(delta) < 1) return;
      if (step(delta > 0 ? 1 : -1, Math.abs(delta))) event.preventDefault();
    };

    const onKey = (event: KeyboardEvent) => {
      if (!desktop.matches || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
      let direction: 1 | -1 | 0 = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown") direction = 1;
      else if (event.key === "ArrowUp" || event.key === "PageUp") direction = -1;
      else if (event.key === " ") direction = event.shiftKey ? -1 : 1;
      if (!direction) return;
      if (locked) {
        event.preventDefault();
        return;
      }
      if (step(direction, window.innerHeight * 0.85)) event.preventDefault();
    };

    // Liens d'ancre (menu, logo, boutons) : même mouvement, et le logo ramène tout en haut
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const id = anchor?.getAttribute("href")?.slice(1);
      if (!anchor || !id) return;
      const section = id === "top" ? null : document.getElementById(id);
      if (id !== "top" && !section) return;
      event.preventDefault();
      setStack(false);
      const target = section
        ? section.getBoundingClientRect().top + window.scrollY - headerHeight()
        : 0;
      setStack(target > window.scrollY);
      if (desktop.matches) lock(animateTo(target) + 80);
      else window.scrollTo({ top: target, behavior: reduce.matches ? "auto" : "smooth" });
    };

    const onResize = () => {
      if (!canStack()) root.classList.remove("stack-down");
    };
    setStack(true);
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("resize", onResize);
      root.classList.remove("stack-down");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.clearTimeout(quiet);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
    let frame = 0;
    const watch = () => {
      if (video.currentTime >= heroLoopSeconds) video.currentTime = 0;
      frame = requestAnimationFrame(watch);
    };
    frame = requestAnimationFrame(watch);
    return () => cancelAnimationFrame(frame);
  }, []);

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

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    if (!form.checkValidity() || !email.includes("@")) {
      setFormState("error");
      return;
    }
    if (data.get("_gotcha")) {
      setFormState("success");
      return;
    }
    if (!formEndpoint) {
      const body = [
        `${t.fields.name} : ${data.get("name")}`,
        `${t.fields.email} : ${email}`,
        `${t.fields.phone} : ${data.get("phone") || "-"}`,
        `${t.fields.date} : ${data.get("date")}`,
        `${t.fields.guests} : ${data.get("guests")}`,
        "",
        String(data.get("message") || ""),
      ].join("\n");
      window.location.href = `mailto:contact@bengcafe.fr?subject=${encodeURIComponent(
        `${t.privatize} — ${data.get("name")}`,
      )}&body=${encodeURIComponent(body)}`;
      setFormState("mailto");
      return;
    }
    setFormState("sending");
    data.append("_subject", `Beng Café — demande de privatisation (${data.get("name")})`);
    data.append("_replyto", email);
    data.append("_template", "table");
    data.append("_captcha", "false");
    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      setFormState(response.ok ? "success" : "failed");
    } catch {
      setFormState("failed");
    }
  };

  const openModal = () => {
    setFormState("idle");
    setModalOpen(true);
  };

  return (
    <div className="site-shell">
      <style>{`
        /* Titres des rubriques : même corps que le titre du hero */
        .site-shell main > section:not(.hero) h2 {
          font-size: clamp(24px, 2.6vw, 38px) !important;
          line-height: 1.15 !important;
          letter-spacing: -0.02em !important;
        }
        /* Chaque rubrique occupe au minimum un écran, sans couper son contenu */
        .site-shell main > section:not(.hero) {
          min-height: calc(100svh - 70px);
          box-sizing: border-box;
        }
        .site-shell main > section:not(.hero) {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        /* Texte du hero : fixe avec la vidéo, aligné sur les marges des autres rubriques */
        .site-shell .hero-inner {
          position: fixed;
          top: 50%;
          left: max(40px, calc((100vw - 1280px) / 2));
          right: max(40px, calc((100vw - 1280px) / 2));
          width: auto;
          box-sizing: border-box;
          transform: translateY(-50%);
          z-index: 2;
        }
        /* Header : bandeau blanc opaque, sans transparence, flou ni ombre */
        .site-shell .header {
          background: #fffdf7;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          box-shadow: none;
        }
        /* Hero : aucun filtre sur la vidéo, seule une ombre légère sur le texte */
        .site-shell .hero h1,
        .site-shell .hero .hero-actions .button-light + .button-light {
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
        }
        /* Ancres : la rubrique s'arrête sous le header collé en haut */
        .site-shell main > section {
          scroll-margin-top: 70px;
        }
        /* Défilement rubrique par rubrique : sur ordinateur il est piloté par le script
           (molette, clavier) ; sur tactile, simple accroche douce de chaque rubrique */
        html {
          scroll-behavior: smooth;
        }
        /* Le lieu : photo plein fond, texte à droite (symétrique du hero), un écran maximum */
        .site-shell main > section.place {
          position: relative;
          isolation: isolate;
          min-height: calc(100svh - 70px);
          padding: 4vh max(40px, calc((100vw - 1280px) / 2));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          background-color: #1d1712;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: #fff;
        }
        .site-shell .place::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0) clamp(70px, 14vh, 140px)),
            linear-gradient(
              270deg,
              rgba(0, 0, 0, 0.36) 0%,
              rgba(0, 0, 0, 0.2) 38%,
              rgba(0, 0, 0, 0) 68%
            );
        }
        /* Filtre chaud léger sur la photo */
        .site-shell .place::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: rgb(255, 156, 64);
          mix-blend-mode: soft-light;
          opacity: 0.5;
        }
        /* Le lieu : la photo est agrandie depuis la gauche (bord droit rogné) et remontée un peu pour laisser voir davantage le bas */
        .site-shell main > section.place {
          overflow: hidden;
        }
        .site-shell .place-photo {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-size: cover;
          background-position: center 64%;
          background-repeat: no-repeat;
          transform: scale(1.12);
          transform-origin: 0 50%;
        }
        /* Le lieu : le texte est solidaire de la photo et suit son mouvement, vers le bas comme vers le haut */
        .site-shell .place-panel {
          width: min(500px, 100%);
          text-align: left;
        }
        .site-shell .place-panel .eyebrow {
          color: #fff;
          margin-bottom: 10px;
        }
        .site-shell .place-panel h2 {
          color: #fff;
          margin: 0 0 clamp(10px, 2vh, 18px);
        }
        .site-shell .place-panel .lead {
          color: #fff;
          font-size: clamp(14px, 1.15vw, 16px);
          line-height: 1.55;
          margin: 0 0 clamp(12px, 2.4vh, 22px);
        }
        .site-shell .place-panel .strengths article {
          border-color: rgba(255, 255, 255, 0.4);
          padding: clamp(6px, 1.2vh, 11px) 0;
          gap: 12px;
        }
        .site-shell .place-panel .strengths article > span,
        .site-shell .place-panel .strengths h3 {
          color: #fff;
        }
        .site-shell .place-panel .strengths h3 {
          font-size: 15px;
          margin: 0 0 2px;
        }
        .site-shell .place-panel .strengths p {
          color: rgba(255, 255, 255, 0.88);
          font-size: 13px;
          line-height: 1.4;
          margin: 0;
        }
        /* Séparation hero / Le lieu : voile d'ombre léger en bas du hero et en haut du lieu */
        .site-shell .hero-shade-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: clamp(70px, 14vh, 140px);
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0));
        }
        /* À table / À boire / En images / Infos : chaque rubrique tient dans un écran (ordinateur) */
        @media (min-width: 901px) {
          .site-shell .menus,
          .site-shell .drinks,
          .site-shell .gallery,
          .site-shell .info {
            padding-top: 3vh;
            padding-bottom: 3vh;
          }
          .site-shell .menus .section-heading,
          .site-shell .drinks .section-heading,
          .site-shell .gallery .section-heading,
          .site-shell .info .section-heading {
            margin-bottom: clamp(12px, 2.4vh, 26px);
          }
          .site-shell .menus .section-heading .eyebrow,
          .site-shell .drinks .section-heading .eyebrow,
          .site-shell .gallery .section-heading .eyebrow,
          .site-shell .info .section-heading .eyebrow {
            margin-bottom: 8px;
          }

          /* Bon cadeau : retour sur deux colonnes (texte à gauche, étapes à droite) */
          .site-shell main > section.gift {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 8%;
            align-items: center;
            padding-top: 3vh;
            padding-bottom: 3vh;
          }
          .site-shell .gift-copy .lead {
            margin: 2.4vh 0;
          }
          .site-shell .gift-steps div {
            min-height: 0;
            padding: 2.4vh 26px;
          }

          /* À table */
          .site-shell .lunch-card {
            padding: 2vh 28px;
            gap: 32px;
            box-shadow: 5px 5px 0 #111;
          }
          .site-shell .lunch-card > p {
            font-size: 15px;
            line-height: 1.45;
          }
          .site-shell .lunch-card h3,
          .site-shell .brunch-head h3 {
            font-size: 24px;
            margin-top: 4px;
          }
          .site-shell .formula {
            padding: 12px 16px;
          }
          .site-shell .brunch-head {
            margin: 1.8vh 0 1vh;
          }
          .site-shell .brunch-card {
            min-height: 0;
            padding: clamp(10px, 1.7vh, 18px) 22px;
            gap: 0.8vh;
          }
          .site-shell .card-top h4 {
            font-size: 18px;
            max-width: none;
          }
          .site-shell .brunch-card li {
            padding: clamp(2px, 0.55vh, 5px) 0;
            font-size: 14px;
          }
          .site-shell .menu-notes {
            margin-top: 1.2vh;
            font-size: 14px;
          }

          /* À boire */
          .site-shell .drink-list {
            padding: 20px 24px;
          }
          .site-shell .drink-list h3 {
            font-size: 20px;
            margin-bottom: 1.2vh;
          }
          .site-shell .price-row {
            padding: 0.5vh 0;
            font-size: 14px;
          }

          /* En images : la grille remplit exactement la place restante */
          .site-shell .gallery {
            height: calc(100svh - 70px);
          }
          .site-shell .gallery-grid {
            flex: 1;
            min-height: 0;
            grid-template-rows: 1fr 1fr;
          }
          .site-shell .gallery-grid .grain-photo:nth-child(2),
          .site-shell .gallery-grid .grain-photo:nth-child(5) {
            transform: none;
          }

          /* Infos */
          .site-shell .info-details {
            gap: 2.4vh 32px;
          }
          .site-shell .info-details h3 {
            margin-bottom: 1.2vh;
            font-size: 16px;
          }
          .site-shell .info-details article:first-child p {
            padding: 0.7vh 0;
            font-size: 14px;
          }
          .site-shell .info-details .button {
            margin-top: 1.6vh;
          }
          .site-shell .map-card {
            min-height: 0;
          }
        }
        /* Logo du bandeau : branche de café + nom */
        .site-shell .header .logo {
          gap: 12px;
        }
        .site-shell .header .logo-mark {
          height: 48px;
          width: auto;
          display: block;
        }
        .site-shell .header .logo-name {
          height: 34px;
          width: auto;
          display: block;
        }
        @media (max-width: 560px) {
          .site-shell .header .logo-mark { height: 40px; }
          .site-shell .header .logo-name { height: 17px; }
        }
        /* Pied de page : simple flèche vers le haut, sans rond */
        .site-shell .footer-logo {
          width: auto;
          height: auto;
          border: 0;
          border-radius: 0;
          background: none;
          color: #fff;
          padding: 8px;
          transition: transform 0.2s ease;
        }
        .site-shell .footer-logo:hover {
          transform: translateY(-3px);
        }
        /* Bandeau : jamais de retour à la ligne dans les liens, taille adaptée à la largeur */
        .site-shell .nav a,
        .site-shell .header-gift,
        .site-shell .header-status,
        .site-shell .logo {
          white-space: nowrap;
        }
        .site-shell .header .logo,
        .site-shell .header-actions {
          flex-shrink: 0;
        }
        @media (min-width: 901px) and (max-width: 1240px) {
          .site-shell .header {
            padding-left: 20px;
            padding-right: 20px;
            gap: 14px;
            height: 70px;
            box-sizing: border-box;
          }
          .site-shell .header .logo { gap: 8px; }
          .site-shell .header .logo-mark { height: 42px; }
          .site-shell .header .logo-name { height: 24px; }
          .site-shell .nav { gap: 18px; }
          .site-shell .nav a { font-size: 13px; }
          .site-shell .header-actions { gap: 8px; }
          .site-shell .header-status { padding: 6px 10px; font-size: 11px; }
          .site-shell .lang-switch button { min-width: 34px; min-height: 32px; }
          .site-shell .header-gift { min-height: 42px; padding: 0 14px; font-size: 13px; gap: 8px; }
        }
        @media (min-width: 901px) and (max-width: 1040px) {
          .site-shell .header-gift .arrow { display: none; }
          .site-shell .nav { gap: 14px; }
        }
        @media (max-width: 900px) {
          .site-shell .header .logo-mark { height: 40px; }
          .site-shell .header .logo-name { height: 17px; }
        }
        @media (max-width: 420px) {
          .site-shell .header { gap: 6px; }
          .site-shell .header .logo { gap: 6px; }
          .site-shell .header .logo-mark { height: 34px; }
          .site-shell .header .logo-name { height: 14px; }
          .site-shell .header-status { padding: 5px 8px; font-size: 10px; gap: 6px; }
          .site-shell .lang-switch { padding: 2px; }
          .site-shell .lang-switch button { min-width: 32px; min-height: 30px; font-size: 11px; }
        }
        @media (max-width: 340px) {
          .site-shell .header .logo-mark { height: 30px; }
          .site-shell .header .logo-name { height: 11px; }
          .site-shell .header-status { padding: 4px 6px; font-size: 9px; }
          .site-shell .lang-switch button { min-width: 28px; }
        }
        /* À table : note unique, midi en semaine à deux formules, ombres identiques sur toutes les cartes */
        .site-shell .menus-note {
          margin: 10px auto 0;
          max-width: 640px;
          font-size: 15px;
          line-height: 1.45;
          opacity: 0.85;
        }
        .site-shell .lunch-card {
          grid-template-columns: 0.75fr 1fr 1.25fr;
          align-items: center;
          gap: 20px;
        }
        .site-shell .formulas {
          display: contents;
        }
        .site-shell .formulas .formula {
          padding: 12px 18px;
          height: 100%;
          box-sizing: border-box;
        }
        .site-shell .formulas .formula span {
          max-width: 260px;
        }
        .site-shell .formula-kids small {
          display: block;
          margin-top: 3px;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.35;
          opacity: 0.8;
        }
        .site-shell .brunch-card {
          box-shadow: 5px 5px 0 #111;
        }
        .site-shell .brunch-grid {
          padding-right: 5px;
          padding-bottom: 5px;
        }
        @media (max-width: 900px) {
          .site-shell .lunch-card { grid-template-columns: 1fr; }
          .site-shell .formulas { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        }
        .site-shell .lunch-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .site-shell .lunch-head {
          margin-top: 1.2vh;
        }
        .site-shell .menus .section-heading { margin-bottom: 0.6vh; }
        .site-shell .menus-note { margin-top: 6px; }
        @media (max-width: 900px) {
          .site-shell .lunch-grid { grid-template-columns: 1fr; }
          .site-shell .brunch-card { min-height: 0; gap: 14px; }
        }
        @media (min-width: 901px) and (max-height: 800px) {
          .site-shell .menus { padding-top: 1.5vh; padding-bottom: 1.5vh; }
          .site-shell .menus h2 { font-size: 26px !important; }
          .site-shell .menus-note { font-size: 13px; margin-top: 4px; }
          .site-shell .menus .section-heading .eyebrow { margin-bottom: 4px; }
          .site-shell .brunch-head h3 { font-size: 20px; }
          .site-shell .brunch-card { padding: 9px 18px; gap: 4px; }
          .site-shell .card-top h4 { font-size: 16px; }
          .site-shell .card-top strong { font-size: 14px; padding: 7px 12px; }
          .site-shell .brunch-card li { padding: 1px 0; font-size: 13px; }
          .site-shell .menu-notes { margin-top: 6px; font-size: 13px; }
        }
        /* Réseaux + Venir chez Beng : une seule rubrique, deux colonnes */
        .site-shell .info-split {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 6%;
          align-items: center;
          min-height: calc(100svh - 70px - 6vh);
        }
        .site-shell .social-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
          padding-right: 4%;
          border-right: var(--line);
        }
        .site-shell .social-panel h2,
        .site-shell .visit-panel h2 {
          margin: 0;
        }
        .site-shell .visit-panel .eyebrow,
        .site-shell .social-panel .eyebrow {
          margin-bottom: 0;
        }
        .site-shell .visit-panel h2 {
          margin-bottom: clamp(14px, 3vh, 30px);
        }
        .site-shell .visit-panel .info-details {
          gap: 2.4vh 32px;
        }
        .site-shell .visit-panel .info-details article:first-child p:last-child {
          border-bottom: 0;
        }
        .site-shell .private-block {
          margin-top: clamp(14px, 4vh, 40px);
          padding-top: clamp(18px, 4vh, 40px);
          border-top: var(--line);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .site-shell .private-block .eyebrow {
          margin: 0;
        }
        .site-shell .private-text {
          margin: 0;
          font-size: clamp(18px, 1.7vw, 24px);
          line-height: 1.3;
          font-weight: 600;
          max-width: 440px;
        }
        .site-shell .visit-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: stretch;
        }
        .site-shell .visit-body .info-details {
          grid-template-columns: 1fr;
        }
        .site-shell .map-embed {
          border: var(--line);
          border-radius: 24px;
          overflow: hidden;
          min-height: 320px;
          background: var(--green);
        }
        .site-shell .map-embed iframe {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          border: 0;
        }
        @media (max-width: 900px) {
          .site-shell .visit-body { grid-template-columns: 1fr; }
          .site-shell .info-split {
            grid-template-columns: 1fr;
            gap: 44px;
            min-height: 0;
          }
          .site-shell .social-panel {
            border-right: 0;
            padding-right: 0;
            padding-bottom: 36px;
            border-bottom: var(--line);
          }
        }
        /* À boire : photo plein fond, voile sombre pour la lisibilité, cartes de prix inchangées */
        .site-shell main > section.drinks {
          position: relative;
          isolation: isolate;
          background-color: #1d1712;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .site-shell .drinks::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: rgba(0, 0, 0, 0.45);
        }
        .site-shell .drinks .section-heading .eyebrow,
        .site-shell .drinks .section-heading h2 {
          color: #fff;
        }
        /* Rubriques empilées en descendant : chacune reste sous le bandeau, la suivante la recouvre */
        html.stack-down .site-shell main > section {
          position: sticky;
          top: 70px;
        }
        /* Cartes de boissons : verre dépoli translucide, la photo reste visible derrière */
        .site-shell .drinks .drink-list {
          -webkit-backdrop-filter: blur(8px) brightness(1.45) saturate(1.1);
          backdrop-filter: blur(8px) brightness(1.45) saturate(1.1);
        }
        .site-shell .drinks .drink-1 {
          background: color-mix(in srgb, var(--yellow) 44%, transparent);
        }
        .site-shell .drinks .drink-2 {
          background: color-mix(in srgb, var(--blue) 44%, transparent);
        }
        .site-shell .drinks .drink-3 {
          background: color-mix(in srgb, var(--green) 44%, transparent);
        }
        /* Badge Ouvert / Fermé dans le bandeau blanc du header */
        .site-shell .header-status {
          padding: 7px 12px;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .site-shell .hero-inner {
            left: 24px;
            right: 24px;
          }
          .site-shell main > section {
            scroll-margin-top: 104px;
          }
          .site-shell main > section:not(.hero) {
            min-height: calc(100svh - 104px);
          }

          .site-shell main > section.place {
            min-height: calc(100svh - 104px);
            padding: 28px 24px;
            align-items: stretch;
          }
          .site-shell .place::before {
            background:
              linear-gradient(180deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0) 90px),
              linear-gradient(0deg, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.4));
          }
          .site-shell .place-panel {
            width: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
        @media (max-width: 560px) {
          .site-shell .hero-inner {
            left: 18px;
            right: 18px;
          }
          .site-shell .header-status {
            padding: 6px 9px;
            font-size: 11px;
            letter-spacing: 0.04em;
          }
        }
        /* Téléphone : le bouton « Offrir un bon cadeau » reste visible dans le bandeau */
        .site-shell .gift-short { display: none; }
        @media (max-width: 900px) {
          .site-shell .header .header-gift {
            display: inline-flex;
            min-height: 40px;
            padding: 0 14px;
            font-size: 13px;
            gap: 8px;
          }
          .site-shell .header-actions { gap: 8px; }
        }
        @media (max-width: 600px) {
          .site-shell .header .header-gift { padding: 0 12px; font-size: 12px; }
          .site-shell .header .header-gift .arrow { display: none; }
          .site-shell .header-status .status-text { display: none; }
          .site-shell .header-status { padding: 9px; }
        }
        @media (max-width: 420px) {
          .site-shell .header .header-gift { min-height: 36px; padding: 0 10px; font-size: 11.5px; }
          .site-shell .header-gift .gift-long { display: none; }
          .site-shell .header-gift .gift-short { display: inline; }
        }
        @media (max-width: 900px) {
          .site-shell .header {
            box-sizing: border-box;
            height: 104px;
            padding-top: 8px;
            padding-bottom: 0;
            align-content: flex-start;
          }
        }
        @media (max-width: 340px) {
          .site-shell .header-status { display: none; }
        }
        /* ===== Téléphone / tablette : chaque partie occupe un écran complet, sans accroche automatique ===== */
        .site-shell .screen { display: contents; }
        .site-shell .drinks-grid > .screen > .section-heading { grid-column: 1 / -1; }
        @media (max-width: 900px) {
          html { scroll-snap-type: none !important; }
          .site-shell main > section { scroll-snap-align: none !important; }
          .site-shell main > section.hero { min-height: calc(100svh - 104px); }

          /* Écrans pleins */
          .site-shell main > section.menus,
          .site-shell main > section.info {
            padding: 0 20px;
            min-height: 0;
            display: block;
          }
          .site-shell .screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: calc(100svh - 104px);
            padding: 20px 0;
            box-sizing: border-box;
          }
          .site-shell .screen + .screen { border-top: var(--line); margin: 0 -20px; padding: 20px; }
          .site-shell .menus .section-heading { margin-bottom: 14px; }
          .site-shell .menus .section-heading h2 { font-size: 26px !important; }
          .site-shell .menus-note { font-size: 14px; margin-top: 6px; }
          .site-shell .brunch-head { margin: 14px 0 10px; align-items: flex-start; flex-direction: column; gap: 4px; }
          .site-shell .brunch-head h3 { font-size: 24px; margin-top: 2px; }
          .site-shell .brunch-head .time { margin-top: 0; font-size: 14px; }
          .site-shell .brunch-grid { gap: 12px; padding-right: 5px; padding-bottom: 5px; }
          .site-shell .brunch-card { padding: 12px 16px; gap: 4px; box-shadow: 4px 4px 0 #111; border-radius: 22px; }
          .site-shell .card-top h4 { font-size: 16px; line-height: 1.15; max-width: none; }
          .site-shell .card-top strong { font-size: 14px; padding: 7px 12px; }
          .site-shell .brunch-card li { padding: 2px 0; font-size: 14px; }
          .site-shell .menu-notes { margin-top: 14px; font-size: 13px; gap: 6px; flex-direction: column; align-items: flex-start; }

          /* Boissons : titre + 1re carte sur le 1er écran, puis un écran par carte */
          .site-shell main > section.drinks {
            display: block;
            min-height: 0;
          }
          .site-shell .drinks .section-heading { margin-bottom: 14px; }
          .site-shell .drinks .section-heading h2 { font-size: 26px !important; }
          .site-shell .drinks-grid { display: block; }
          .site-shell .drinks .screen { gap: 16px; }
          .site-shell main > section.drinks { padding: 0 20px; }
          .site-shell .drinks .drink-list { padding: 16px 20px; margin: 0; }
          .site-shell .drinks .drink-list h3 { font-size: 18px; margin-bottom: 6px; }
          .site-shell .drinks .price-row { padding: 3px 0; font-size: 14px; }

          /* Infos : écran 1 = réseaux + privatisation, écran 2 = venir chez Beng */
          .site-shell .info-split { display: block; min-height: 0; }
          .site-shell .social-panel,
          .site-shell .visit-panel {
            min-height: calc(100svh - 104px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px 0;
            border: 0;
          }
          .site-shell .social-panel { align-items: flex-start; gap: 18px; }
          .site-shell .visit-panel { border-top: var(--line); margin: 0 -20px; padding: 20px; }
          .site-shell .social-panel h2,
          .site-shell .visit-panel h2 { font-size: 26px !important; }
          .site-shell .visit-body { display: block; }
          .site-shell .info-details { gap: 14px; }
          .site-shell .info-details article { padding-top: 10px; }
          .site-shell .info-details h3 { font-size: 15px; margin-bottom: 6px; }
          .site-shell .info-details article:first-child p { padding: 4px 0; font-size: 14px; }
          .site-shell .map-embed { margin-top: 14px; min-height: 200px; height: 200px; }
          .site-shell .map-embed iframe { min-height: 200px; height: 200px; }
        }
      `}</style>
      <header className="header">
        <a href="#top" className="logo" aria-label="Beng Café, accueil">
          <Logo />
        </a>
        <nav className="nav" aria-label="Navigation principale">
          {t.nav.map((item, index) => (
            <a key={item} href={["#lieu", "#boissons", "#menus", "#infos"][index]}>
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <span className={`status header-status ${isOpen ? "open" : ""}`}>
            <i />
            <span className="status-text">{isOpen ? t.open : t.closed}</span>
          </span>
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
            <span className="gift-long">{t.gift}</span>
            <span className="gift-short">{t.giftShort}</span>
            <Arrow diagonal />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-pad after:hidden" style={{ clipPath: "inset(0)" }}>
          <video
            ref={videoRef}
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            aria-hidden="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100svh",
              objectFit: "cover",
              zIndex: -2,
            }}
          />
          <div className="hero-shade-bottom" aria-hidden="true" />
          <div className="hero-inner" style={{ color: "#fff" }}>
            <h1
              style={{
                maxWidth: 560,
                textAlign: "left",
                fontSize: "clamp(24px, 2.6vw, 38px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                whiteSpace: "pre-line",
              }}
            >
              {t.hero}
            </h1>
            <div className="hero-actions">
              <a className="button button-light" href="#menus">
                {t.discover}
                <Arrow />
              </a>
              <a
                className="button button-light"
                href="#infos"
                style={{ background: "transparent", color: "#fff", borderColor: "#fff" }}
              >
                {t.find}
                <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="place section-pad" id="lieu">
          <div
            className="place-photo"
            aria-hidden="true"
            style={{ backgroundImage: `url(${placeImage})` }}
          />
          <div className="place-panel">
            <p className="eyebrow">{t.placeKicker}</p>
            <h2>{t.placeTitle}</h2>
            <p className="lead">{t.placeText}</p>
          </div>
        </section>

        <section
          className="drinks section-pad"
          id="boissons"
          style={{ backgroundImage: `url(${drinksImage})` }}
        >
          <div className="drinks-grid">
            {[t.drinkGroups.slice(0, 1), t.drinkGroups.slice(1)].map((groups, screenIndex) => (
              <div className="screen" key={screenIndex}>
                {screenIndex === 0 && (
                  <div className="section-heading">
                    <p className="eyebrow">{t.drinksKicker}</p>
                    <h2>{t.drinksTitle}</h2>
                  </div>
                )}
                {groups.map(([group, drinks]) => {
                  const index = t.drinkGroups.findIndex((g) => g[0] === group);
                  return (
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
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <section className="menus section-pad" id="menus">
          <div className="screen">
          <div className="section-heading centered">
            <p className="eyebrow">{t.menusKicker}</p>
            <h2>{t.menusTitle}</h2>
            <p className="menus-note">{t.lunchText}</p>
          </div>
          <div className="brunch-head lunch-head">
            <div>
              <span className="mini-label">01</span>
              <h3>{t.lunch}</h3>
            </div>
            <p className="time">{t.lunchTime}</p>
          </div>
          <div className="brunch-grid lunch-grid">
            {t.lunches.map(([title, price, items], index) => (
              <article
                className={`brunch-card ${index === 0 ? "card-1" : "card-3"}`}
                key={title as string}
              >
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
          </div>
          <div className="screen">
          <div className="brunch-head">
            <div>
              <span className="mini-label">02</span>
              <h3>{t.brunch}</h3>
            </div>
            <p className="time">
              {t.brunchTime}
            </p>
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
          </div>
        </section>

        <section className="info section-pad" id="infos">
          <div className="info-split">
            <div className="social-panel">
              <p className="eyebrow">{t.galleryKicker}</p>
              <h2>{t.galleryTitle}</h2>
              <a
                className="button button-dark"
                href="https://www.instagram.com/beng.cafe.quimper/"
                target="_blank"
                rel="noreferrer"
              >
                {t.instagram}
                <Arrow diagonal />
              </a>
              <div className="private-block">
                <p className="eyebrow">{t.privatize}</p>
                <p className="private-text">{t.privateText}</p>
                <button className="button button-dark" onClick={openModal}>
                  {t.write}
                  <Arrow />
                </button>
              </div>
            </div>
            <div className="visit-panel">
              <p className="eyebrow">{t.infoKicker}</p>
              <h2>{t.infoTitle}</h2>
              <div className="visit-body">
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
                </article>
                <article>
                  <h3>{t.contact}</h3>
                  <a href="tel:+33256041281">02 56 04 12 81</a>
                  <a href="mailto:contact@bengcafe.fr">contact@bengcafe.fr</a>
                </article>
              </div>
              <div className="map-embed">
                <iframe
                  title={t.mapLabel}
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>{t.footer}</p>
        <a href="#top" className="footer-logo" aria-label="Retour en haut">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20V4" />
            <path d="M5 11l7-7 7 7" />
          </svg>
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
            {formState === "success" || formState === "mailto" ? (
              <div className="success-state">
                <span>✓</span>
                <h2 id="modal-title">{formState === "mailto" ? t.mailtoTitle : t.successTitle}</h2>
                <p>{formState === "mailto" ? t.mailtoText : t.successText}</p>
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
                  <input
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                  />
                  <label className="consent wide">
                    <input name="consent" type="checkbox" required />
                    <span>{t.consent}</span>
                  </label>
                  {formState === "error" && (
                    <p className="form-error wide" role="alert">
                      {t.required}
                    </p>
                  )}
                  {formState === "failed" && (
                    <p className="form-error wide" role="alert">
                      {t.failed}
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

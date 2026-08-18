import { useRef, useState, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Pagination } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";

import hodnikLogo from "./images/hodnik-logo.webp";
import ogledalo from "./images/ogledalo.webp";
import ordinacija from "./images/ordinacija.webp";
import hodnikSertifikati from "./images/hodnik-sertifikati.webp";
import recepcija from "./images/recepcija.webp";
import recepcijaUgao from "./images/recepcija-ugao.webp";

/* TODO: zameniti stvarnim podacima ordinacije pre objave. */
const TELEFON = "+381 00 000 0000";
const TELEFON_HREF = "tel:+38100000000";
const ADRESA = "Adresa ordinacije, Beograd";

const SECTIONS = [
  {
    id: "pocetna",
    img: hodnikLogo,
    pages: [
      {
        label: "Beograd",
        title: "Una Dental Centar",
        body: "Stomatološka ordinacija u kojoj se pregled, terapija i estetika rade u istom prostoru — bez upućivanja i bez čekanja na drugom mestu.",
      },
    ],
  },
  {
    id: "prostor",
    img: ogledalo,
    pages: [
      {
        label: "Prostor",
        title: "Belo i tiho",
        body: "Ordinacija je mala namerno. Zakazuje se tako da se u čekaonici ne preklapate ni sa kim, a hodnik do stolice traje deset koraka.",
      },
    ],
  },
  {
    id: "ordinacija",
    img: ordinacija,
    pages: [
      {
        label: "Ordinacija",
        title: "Tri stolice",
        body: "Svaka stolica ima svoj monitor, pa vidite isto što i stomatolog — snimak, zub i šta se tačno radi, dok se radi.",
      },
    ],
  },
  {
    id: "usluge",
    img: hodnikSertifikati,
    pages: [
      {
        label: "Usluge",
        title: "Opšta stomatologija",
        body: "Pregled, čišćenje kamenca, plombe i lečenje kanala. Ovde počinje većina poseta.",
        list: [
          ["Pregled i plan terapije", "20 min"],
          ["Uklanjanje kamenca", "30–45 min"],
          ["Bela plomba", "30–60 min"],
          ["Lečenje kanala", "1–2 posete"],
        ],
      },
      {
        label: "Usluge",
        title: "Estetika",
        body: "Za promene koje se vide kad se nasmejete, a ne kad otvorite usta do kraja.",
        list: [
          ["Izbeljivanje", "1 poseta"],
          ["Kompozitne fasete", "1–2 posete"],
          ["Keramičke ljuspice", "2–3 posete"],
        ],
      },
      {
        label: "Usluge",
        title: "Protetika",
        body: "Krunice, mostovi i proteze. Otisak se uzima kod nas, izrada ide u laboratoriju, proba se radi dok ne legne kako treba.",
        list: [
          ["Metalokeramička krunica", "2–3 posete"],
          ["Bezmetalna krunica", "2–3 posete"],
          ["Proteza", "3–4 posete"],
        ],
      },
    ],
  },
  {
    id: "poverenje",
    img: recepcijaUgao,
    pages: [
      {
        label: "Ordinacija",
        title: "Sertifikati na zidu",
        body: "Nisu dekoracija — kongresi i kursevi na kojima se uči šta se u međuvremenu promenilo. Zid se dopunjava svake godine.",
      },
    ],
  },
  {
    id: "kontakt",
    img: recepcija,
    pages: [
      {
        label: "Zakazivanje",
        title: "Javite se",
        body: "Termin se zakazuje telefonom. Recite šta vas muči i koliko hitno je — dobićete prvi slobodan termin koji odgovara.",
        contact: true,
      },
    ],
  },
];

function Page({ page }) {
  return (
    <div className="ud-text">
      <p className="ud-label">{page.label}</p>
      <h2 className="ud-title">
        <span className="ud-mirror" data-text={page.title}>
          {page.title}
        </span>
      </h2>
      <p className="ud-body">{page.body}</p>

      {page.list && (
        <ul className="ud-list">
          {page.list.map(([name, meta]) => (
            <li key={name}>
              {name} <span>{meta}</span>
            </li>
          ))}
        </ul>
      )}

      {page.contact && (
        <>
          <p className="ud-body" style={{ marginTop: "1rem" }}>
            {ADRESA}
          </p>
          <div className="ud-contact">
            <a className="ud-cta ud-cta--solid" href={TELEFON_HREF}>
              Pozovite {TELEFON}
            </a>
            <a
              className="ud-cta"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function Section({ section, cardRef, reveal }) {
  const multi = section.pages.length > 1;

  return (
    <div className="ud-card" ref={cardRef}>
      <div className="ud-photo" style={{ backgroundImage: `url(${section.img})` }} />
      <div className="ud-wash" />
      <div className="ud-flute" />

      {multi ? (
        <>
          <Swiper
            modules={[Mousewheel, Pagination]}
            direction="vertical"
            nested={true}
            speed={500}
            mousewheel={{ forceToAxis: true }}
            pagination={{ el: ".ud-subdots-" + section.id, clickable: true }}
            onSlideChangeTransitionStart={(sw) => reveal(sw.slides[sw.activeIndex], 0.2)}
            className="ud-inner"
          >
            {section.pages.map((page, i) => (
              <SwiperSlide key={i}>
                <Page page={page} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={"swiper-pagination ud-subdots ud-subdots-" + section.id} />
          <div className="ud-hint">Još u ovoj sekciji</div>
        </>
      ) : (
        <Page page={section.pages[0]} />
      )}
    </div>
  );
}

function App() {
  const [, setActive] = useState(0);
  const cardRefs = useRef([]);

  const reveal = useCallback((el, delay = 0) => {
    if (!el) return;
    const scope = el.querySelector(".ud-inner .swiper-slide-active") || el;
    gsap.fromTo(
      scope.querySelectorAll(".ud-label, .ud-title, .ud-body, .ud-list, .ud-contact"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay, stagger: 0.07, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (el && i !== 0) {
        gsap.set(
          el.querySelectorAll(".ud-label, .ud-title, .ud-body, .ud-list, .ud-contact"),
          { opacity: 0, y: 20 }
        );
      }
    });
    reveal(cardRefs.current[0]);
  }, [reveal]);

  return (
    <>
      <div className="ud-wordmark">Una</div>

      <Swiper
        modules={[Mousewheel, Keyboard, Pagination]}
        direction="vertical"
        speed={700}
        mousewheel={{ forceToAxis: true }}
        keyboard={{ enabled: true }}
        pagination={{ el: ".ud-dots", clickable: true }}
        onSlideChangeTransitionStart={(sw) => {
          setActive(sw.activeIndex);
          reveal(cardRefs.current[sw.activeIndex], 0.3);
        }}
        className="ud-deck"
      >
        {SECTIONS.map((section, i) => (
          <SwiperSlide key={section.id}>
            <Section
              section={section}
              cardRef={(el) => (cardRefs.current[i] = el)}
              reveal={reveal}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination ud-dots" />
    </>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error('Nema elementa sa id="root" — proveri index.html.');
}
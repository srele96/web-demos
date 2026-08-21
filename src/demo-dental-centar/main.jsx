import { useRef, useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard, Pagination } from 'swiper/modules';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';

/* Each section is a card. `pages` = 1 entry -> plain content.
   `pages` with several entries -> content taller than one screen,
   split into an inner vertical Swiper instead of overflowing. */
const SECTIONS = [
  {
    id: 'start',
    img: 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?auto=format&fit=crop&w=2000&q=70',
    pages: [
      {
        eyebrow: '01',
        title: 'One card, one screen.',
        body: "Swipe up for the next section. Dots on the right track which section you're on.",
      },
    ],
  },
  {
    id: 'how',
    img: 'https://images.unsplash.com/photo-1722586663955-2f96a4c1f255?auto=format&fit=crop&w=2000&q=70',
    pages: [
      {
        eyebrow: '02',
        title: 'Its own physics.',
        body: 'Swiper implements touch and drag itself instead of borrowing native scroll, so behaviour stays identical across browsers.',
      },
    ],
  },
  {
    id: 'care',
    img: 'https://images.unsplash.com/photo-1643660527098-559f89e45a92?auto=format&fit=crop&w=2000&q=70',
    pages: [
      {
        eyebrow: '03',
        title: "When content won't fit —",
        body: "— it doesn't need to be cut, and it doesn't need to spill past the card. This section has more to say than one screen holds.",
      },
      {
        eyebrow: '03',
        title: "So it's paged instead.",
        body: 'Swipe up again: same card, same background, next page. Bars on the left track progress through this section specifically.',
      },
      {
        eyebrow: '03',
        title: 'Nested, not stacked.',
        body: 'This inner Swiper has nested: true, so running out of internal pages hands the gesture back to the outer Swiper automatically.',
      },
    ],
  },
  {
    id: 'controls',
    img: 'https://images.unsplash.com/photo-1684607633251-8a4a8d94ddd2?auto=format&fit=crop&w=2000&q=70',
    pages: [
      {
        eyebrow: '04',
        title: 'Three ways to move.',
        body: "Touch drag, arrow keys, or the dots — all handled by Swiper's own config.",
      },
    ],
  },
  {
    id: 'contact',
    img: 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?auto=format&fit=crop&w=2000&q=70',
    pages: [
      {
        eyebrow: '05',
        title: 'Your turn.',
        body: 'Give any section more than one entry in pages and it becomes internally swipeable — no other code changes.',
      },
    ],
  },
];

function PageContent({ page }) {
  return (
    <div className="card-text">
      <p className="eyebrow">{page.eyebrow}</p>
      <h2 className="card-title">{page.title}</h2>
      <p className="card-body">{page.body}</p>
    </div>
  );
}

// One outer section. If it has more than one page, render a nested
// vertical Swiper for the content; otherwise just the content, plain.
function SectionCard({ section, cardRef, reveal }) {
  const multi = section.pages.length > 1;

  return (
    <div className="slide-card" ref={cardRef}>
      <div
        className="slide-bg"
        style={{ backgroundImage: `url(${section.img})` }}
      />
      <div className="slide-scrim" />

      {multi ? (
        <>
          <Swiper
            modules={[Mousewheel, Pagination]}
            direction="vertical"
            nested={true}
            speed={500}
            mousewheel={{ forceToAxis: true }}
            pagination={{
              el: '.inner-pagination-' + section.id,
              clickable: true,
            }}
            onSlideChangeTransitionStart={(sw) =>
              reveal(sw.slides[sw.activeIndex], 0.2)
            }
            className="inner-swiper"
          >
            {section.pages.map((page, i) => (
              <SwiperSlide key={i}>
                <PageContent page={page} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className={
              'swiper-pagination inner-pagination inner-pagination-' +
              section.id
            }
          />
          <div className="more-hint">⌄ more in this section</div>
        </>
      ) : (
        <PageContent page={section.pages[0]} />
      )}
    </div>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const cardRefs = useRef([]);

  const reveal = useCallback((el, delay = 0) => {
    if (!el) return;
    const scope = el.querySelector('.inner-swiper .swiper-slide-active') || el;
    gsap.fromTo(
      scope.querySelectorAll('.card-title, .card-body'),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay,
        stagger: 0.08,
        ease: 'power2.out',
      },
    );
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (el && i !== 0) {
        gsap.set(el.querySelectorAll('.card-title, .card-body'), {
          opacity: 0,
          y: 24,
        });
      }
    });
    reveal(cardRefs.current[0]);
  }, [reveal]);

  return (
    <>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((active + 1) / SECTIONS.length) * 100}%` }}
        />
      </div>

      <div className="brand">DEMO</div>

      <Swiper
        modules={[Mousewheel, Keyboard, Pagination]}
        direction="vertical"
        speed={700}
        mousewheel={{ forceToAxis: true }}
        keyboard={{ enabled: true }}
        pagination={{ el: '.outer-pagination', clickable: true }}
        onSlideChangeTransitionStart={(sw) => {
          setActive(sw.activeIndex);
          reveal(cardRefs.current[sw.activeIndex], 0.3);
        }}
        className="outer-swiper"
      >
        {SECTIONS.map((section, i) => (
          <SwiperSlide key={section.id}>
            <SectionCard
              section={section}
              cardRef={(el) => (cardRefs.current[i] = el)}
              reveal={reveal}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination outer-pagination" />
    </>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error(
      'No element with id="root" found — check src/index.html markup.',
    );
    return;
  }
  createRoot(rootEl).render(<App />);
});

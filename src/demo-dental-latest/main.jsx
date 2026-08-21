import {
  Fragment,
  StrictMode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import './styles.css';

/* ================================================================
   Content
   ================================================================ */

const SLIDES = [
  {
    label: 'Welcome',
    eyebrow: 'Welcome',
    title: ['A Brighter,', 'Healthier Smile'],
    body: [
      'Experience world-class dental care in a modern, comfortable, and stress-free environment. Your perfect smile starts right here.',
    ],
    cta: { label: 'Book Appointment', goTo: 4 },
    image:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Patient smiling in a dental chair',
  },
  {
    label: 'Services',
    eyebrow: 'Services',
    title: ['Comprehensive', 'Dental Care'],
    body: [
      'From routine check-ups and professional whitening to advanced implants and orthodontics, we provide complete solutions for your oral health.',
    ],
    cta: { label: 'Explore Services', goTo: 2 },
    image:
      'https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Dentist reviewing a treatment plan with a patient',
  },
  {
    label: 'Our Clinic',
    eyebrow: 'Our Clinic',
    title: ['State-Of-The-Art', 'Facilities'],
    body: [
      'Our white, pristine office is equipped with the latest dental technology to ensure your treatments are fast, painless, and highly effective.',
    ],
    image:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern dental treatment room',
  },
  {
    label: 'Testimonials',
    eyebrow: 'Happy Patients',
    title: ['Results That', 'Speak Volumes'],
    body: [
      '\u201CThe team at SmileCentar made me feel so comfortable. The whitening procedure was totally painless, and my teeth look amazing!\u201D',
    ],
    attribution: 'Sarah Jenkins',
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Patient reviewing results with a hand mirror',
  },
  {
    label: 'Contact',
    eyebrow: 'Contact Us',
    title: ['Ready For', 'Your Visit?'],
    body: [
      '123 Bright Avenue, Smile City, NY 10001',
      'Call us: (555) 123-4567',
      'Email: hello@smilecentar.com',
    ],
    cta: { label: 'Schedule Now', href: 'mailto:hello@smilecentar.com' },
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Reception desk of the SmileCentar clinic',
  },
];

/* ================================================================
   Shared class strings
   ================================================================ */

const CTA =
  'inline-block bg-brand text-on-brand px-6 py-3 md:px-7 md:py-3.5 rounded-full ' +
  'text-sm md:text-base font-semibold tracking-wide transition-all duration-300 ' +
  'shadow-cta hover:bg-brand-hover hover:-translate-y-0.5 hover:shadow-cta-lg';

const ARROW =
  'w-10 h-10 md:w-11 md:h-11 rounded-full border border-line bg-surface text-ink ' +
  'flex items-center justify-center text-lg transition-all duration-200 shadow-sm ' +
  'hover:bg-brand hover:text-on-brand hover:border-brand hover:shadow-md hover:shadow-brand/20 ' +
  'active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-surface ' +
  'disabled:text-ink disabled:border-line disabled:shadow-none';

const HIDDEN = 'opacity-0 pointer-events-none';

const ordinal = (index) => String(index + 1).padStart(2, '0');

/* ================================================================
   Pieces
   ================================================================ */

function Wordmark() {
  return (
    <div className="font-heading text-xl font-extrabold tracking-tight text-ink flex items-center gap-2 pointer-events-auto">
      <span className="w-2.5 h-2.5 rounded-full bg-brand" />
      SmileCentar
    </div>
  );
}

function Lines({ items }) {
  return (
    <>
      {items.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

function SlideBody({ slide, index, onNavigate }) {
  // The deck alternates layout and background with position, so both
  // are derived rather than repeated on every slide.
  const flipped = index % 2 === 1;
  const Heading = index === 0 ? 'h1' : 'h2';
  const { cta } = slide;

  return (
    <div
      className={`flex flex-col ${flipped ? 'md:flex-row-reverse' : 'md:flex-row'} w-full h-full max-w-7xl mx-auto items-center justify-center md:justify-between px-gutter pt-24 pb-28 md:py-0 gap-6 md:gap-16 lg:gap-20`}
    >
      <div className="flex-1 text-center md:text-left z-10 w-full">
        <span className="block text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-brand mb-3 md:mb-4">
          {ordinal(index)} — {slide.eyebrow}
        </span>

        <Heading className="font-heading text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 font-extrabold tracking-tight leading-tight text-ink">
          <Lines items={slide.title} />
        </Heading>

        <p
          className={`text-sm md:text-lg text-ink-muted leading-relaxed max-w-[46ch] mx-auto md:mx-0 ${
            slide.attribution ? 'mb-3 md:mb-4' : 'mb-6 md:mb-9'
          }`}
        >
          <Lines items={slide.body} />
        </p>

        {slide.attribution && (
          <p className="text-sm md:text-base font-semibold text-ink">
            — {slide.attribution}
          </p>
        )}

        {cta &&
          ('goTo' in cta ? (
            <button
              type="button"
              className={CTA}
              onClick={() => onNavigate(cta.goTo)}
            >
              {cta.label}
            </button>
          ) : (
            <a href={cta.href} className={CTA}>
              {cta.label}
            </a>
          ))}
      </div>

      <div className="flex-1 flex justify-center items-center z-10 w-full">
        <div
          role="img"
          aria-label={slide.imageAlt}
          className="w-full h-[28vh] md:h-[55vh] rounded-card bg-cover bg-center shadow-card"
          style={{ backgroundImage: `url("${slide.image}")` }}
        />
      </div>
    </div>
  );
}

function Navbar({ activeIndex, onSelect, onOpenDrawer, chromeHidden }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-edge py-bar-y bg-linear-to-b from-surface/95 to-transparent pointer-events-none">
      <Wordmark />

      <ul className="hidden md:flex gap-9 list-none pointer-events-auto">
        {SLIDES.map((slide, i) => {
          const active = i === activeIndex;
          return (
            <li key={slide.label}>
              <button
                type="button"
                data-active={active}
                aria-current={active ? 'true' : undefined}
                onClick={() => onSelect(i)}
                className={`nav-link relative bg-transparent border-none font-sans text-sm font-semibold tracking-wide cursor-pointer py-1.5 transition-colors duration-250 hover:text-ink ${
                  active ? 'text-ink' : 'text-ink-muted'
                }`}
              >
                {slide.label}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open menu"
        aria-expanded={false}
        className={`md:hidden flex w-11 h-11 bg-transparent items-center justify-center transition-all duration-300 group pointer-events-auto ${
          chromeHidden ? HIDDEN : ''
        }`}
      >
        <span className="flex flex-col gap-1.5 w-[24px]">
          <span className="block h-[2px] bg-ink transition-all duration-300 rounded group-hover:bg-brand w-full" />
          <span className="block h-[2px] bg-ink transition-all duration-300 rounded group-hover:bg-brand w-[65%] ml-auto group-hover:w-full" />
          <span className="block h-[2px] bg-ink transition-all duration-300 rounded group-hover:bg-brand w-full" />
        </span>
      </button>
    </nav>
  );
}

function NavRail({ activeIndex, onSelect, chromeHidden }) {
  return (
    <nav
      aria-label="Section navigation"
      className={`fixed top-1/2 right-3 md:right-edge -translate-y-1/2 z-40 flex flex-col items-end transition-opacity duration-300 ${
        chromeHidden ? HIDDEN : ''
      }`}
    >
      {SLIDES.map((slide, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={slide.label}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to ${slide.label}`}
            aria-current={active ? 'true' : undefined}
            className="group flex items-center gap-3 cursor-pointer bg-transparent border-none py-3"
          >
            <span
              className={`hidden md:block text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                active
                  ? 'text-brand opacity-100 translate-x-0'
                  : 'text-ink-subtle opacity-0 translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {slide.label}
            </span>
            <span
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border-2 transition-all duration-300 shrink-0 ${
                active
                  ? 'bg-brand border-brand'
                  : 'bg-surface border-line-strong group-hover:border-ink group-hover:scale-125'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

function NavFooter({ activeIndex, onPrev, onNext, chromeHidden }) {
  return (
    <div
      className={`fixed bottom-edge-y left-edge z-40 flex items-center gap-4 md:gap-6 text-ink transition-opacity duration-300 ${
        chromeHidden ? HIDDEN : ''
      }`}
    >
      <div className="flex gap-2 md:gap-3">
        <button
          type="button"
          className={ARROW}
          onClick={onPrev}
          disabled={activeIndex === 0}
          aria-label="Previous section"
        >
          ↑
        </button>
        <button
          type="button"
          className={ARROW}
          onClick={onNext}
          disabled={activeIndex === SLIDES.length - 1}
          aria-label="Next section"
        >
          ↓
        </button>
      </div>

      <div className="font-medium text-sm md:text-base tracking-wide text-ink-muted tabular-nums">
        <span className="text-xl md:text-2xl font-extrabold text-ink">
          {ordinal(activeIndex)}
        </span>{' '}
        / <span>{ordinal(SLIDES.length - 1)}</span>
      </div>
    </div>
  );
}

function Drawer({ open, activeIndex, onSelect, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[250] bg-scrim/40 backdrop-blur-sm transition-opacity duration-400 ${
          open ? 'opacity-100 pointer-events-auto' : HIDDEN
        }`}
      />

      <nav
        aria-label="Menu"
        aria-hidden={!open}
        className={`fixed top-0 right-0 bottom-0 w-[min(400px,85vw)] z-[260] bg-surface border-l border-line transition-transform duration-500 ease-drawer flex flex-col px-6 md:px-10 pt-bar-y pb-edge-y shadow-drawer ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8 md:mb-12 h-11">
          <Wordmark />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex md:hidden w-11 h-11 bg-transparent items-center justify-center transition-all duration-300 group"
          >
            <span className="relative w-[24px] h-[24px] transition-transform duration-300 group-hover:rotate-90">
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-ink transition-colors duration-300 rounded group-hover:bg-brand -translate-y-1/2 rotate-45" />
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-ink transition-colors duration-300 rounded group-hover:bg-brand -translate-y-1/2 -rotate-45" />
            </span>
          </button>
        </div>

        <ul className="list-none flex flex-col">
          {SLIDES.map((slide, i) => {
            const active = i === activeIndex;
            return (
              <li key={slide.label}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={active ? 'true' : undefined}
                  className={`group flex items-baseline gap-4 md:gap-5 w-full bg-transparent border-t border-line py-5 md:py-6 cursor-pointer text-left ${
                    i === SLIDES.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <span
                    className={`text-xs md:text-sm font-semibold tabular-nums shrink-0 ${
                      active ? 'text-brand' : 'text-ink-subtle'
                    }`}
                  >
                    {ordinal(i)}
                  </span>
                  <span
                    className={`font-heading text-xl md:text-3xl font-bold tracking-tight transition-all duration-250 group-hover:translate-x-1.5 ${
                      active
                        ? 'text-brand'
                        : 'text-ink-subtle group-hover:text-ink'
                    }`}
                  >
                    {slide.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-6 text-xs md:text-sm text-ink-subtle font-medium">
          Scroll or use ↑ ↓ to move between sections
        </div>
      </nav>
    </>
  );
}

/* ================================================================
   App
   ================================================================ */

function App() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const goTo = useCallback((index) => {
    swiperRef.current?.slideTo(index);
  }, []);

  const select = useCallback(
    (index) => {
      goTo(index);
      setDrawerOpen(false);
    },
    [goTo],
  );

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      <Swiper
        className="w-full h-screen"
        direction="vertical"
        slidesPerView={1}
        speed={800}
        mousewheel
        keyboard={{ enabled: true, onlyInViewport: true }}
        modules={[Mousewheel, Keyboard]}
        onSwiper={(instance) => {
          swiperRef.current = instance;
        }}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide
            key={slide.label}
            className={`flex items-center justify-center relative overflow-hidden bg-glow ${
              i % 2 === 1 ? 'bg-surface-alt' : 'bg-surface'
            }`}
          >
            <SlideBody slide={slide} index={i} onNavigate={goTo} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Navbar
        activeIndex={activeIndex}
        onSelect={select}
        onOpenDrawer={() => setDrawerOpen(true)}
        chromeHidden={drawerOpen}
      />

      <NavRail
        activeIndex={activeIndex}
        onSelect={select}
        chromeHidden={drawerOpen}
      />

      <NavFooter
        activeIndex={activeIndex}
        onPrev={() => swiperRef.current?.slidePrev()}
        onNext={() => swiperRef.current?.slideNext()}
        chromeHidden={drawerOpen}
      />

      <Drawer
        open={drawerOpen}
        activeIndex={activeIndex}
        onSelect={select}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="hidden md:block fixed bottom-edge-y right-edge text-xs font-semibold text-ink-subtle text-right pointer-events-none opacity-60 z-50">
        Use ↑ ↓ or scroll
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

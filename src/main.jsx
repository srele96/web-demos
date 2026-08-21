import { render } from 'preact';
import './styles.css';

const MOCKUPS = [
  {
    href: './demo-dental-centar/',
    name: 'Snap sections',
    desc: 'Nested Swiper demo - paged sections, GSAP reveals.',
  },
  {
    href: './demo-second-dental/',
    name: 'Una Dental Centar',
    desc: 'Stomatološka ordinacija, Beograd.',
  },
  {
    href: './demo-dental-latest/',
    name: 'Dental Centar Latest',
    desc: 'Swiper sections, latest design',
  },
];

function App() {
  return (
    <main>
      <div className="head">
        <h1>Mockups</h1>
        <p>
          Static builds. Each one is a full-screen vertical deck — swipe,
          scroll, or use arrow keys.
        </p>
      </div>
      <ul>
        {MOCKUPS.map(({ href, name, desc }, i) => (
          <li key={href}>
            <a href={href} className="link-item">
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="meta">
                <span className="name">{name}</span>
                <span className="desc">{desc}</span>
              </span>
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>
      <footer>Not for public indexing.</footer>
    </main>
  );
}

render(<App />, document.getElementById('root'));

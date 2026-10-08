// Spline scene (React). Shows the fallback image until the 3D has loaded.
// Usage in an .astro file:
//   <SplineScene client:visible embed="https://my.spline.design/XXXX/" fallback="/images/keyboard.webp" alt="Mini keyboard" title="Mini keyboard" hint="Click the keys" />
//   <SplineScene client:visible scene="https://prod.spline.design/XXXX/scene.splinecode" ... />
// `embed` is the iframe link from Spline's Share → Public URL. `scene` is the .splinecode link from Export → Code → React.
//
// The scene starts "locked": the page scrolls normally over it and a big button invites the visitor in.
// One click unlocks it and gives it keyboard focus, so hover, click, drag and key presses all reach the 3D scene.
// Clicking anywhere outside the scene locks it again.
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import './SplineScene.css';

const Spline = lazy(() => import('@splinetool/react-spline'));

// If the 3D scene fails to load (slow network, Spline down), show the fallback instead of an empty gap.
class Guard extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail && this.props.onFail(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

// `bare` shows the scene with no frame or click-to-start step: the object sits straight on the page and is live at once.
export default function SplineScene({ scene, embed, fallback, alt = '', title = '3D scene', hint = 'Hover, click and drag to play with it', bare = false }) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const box = useRef(null);

  // Create the 3D scene only in the browser, after React is running, so its load event is never missed.
  // If the scene is slow to report that it has loaded, show it anyway after 12 seconds.
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setReady(true), 12000);
    return () => clearTimeout(t);
  }, []);

  // Lock the scene again when the visitor clicks elsewhere on the page.
  useEffect(() => {
    if (!active) return;
    const out = (e) => { if (box.current && !box.current.contains(e.target)) setActive(false); };
    document.addEventListener('pointerdown', out);
    return () => document.removeEventListener('pointerdown', out);
  }, [active]);

  const start = () => {
    setActive(true);
    // Give the scene keyboard focus so key presses reach it.
    requestAnimationFrame(() => {
      const target = box.current && box.current.querySelector('iframe, canvas');
      if (target) { target.setAttribute('tabindex', '0'); target.focus(); }
    });
  };

  const still = fallback ? <img className="spline-still" src={fallback} alt={alt} loading="lazy" /> : null;
  const live = ready ? 'spline-live on' : 'spline-live';

  if (!embed && !scene) return <div className="spline">{still}</div>;

  if (bare && scene) {
    return (
      <div className="spline bare" data-nocursor role="img" aria-label={alt || title}>
        {!ready && <span className="spline-loading">Loading 3D…</span>}
        {mounted && (
          <Guard fallback={<span className="spline-loading">3D scene couldn't load. Refresh to try again.</span>} onFail={() => setReady(true)}>
            <Suspense fallback={null}>
              <Spline scene={scene} onLoad={() => setReady(true)} className={live} />
            </Suspense>
          </Guard>
        )}
      </div>
    );
  }

  return (
    <div ref={box} className={active ? 'spline is-active' : 'spline'} data-nocursor>
      {!ready && still}
      {!mounted ? null : embed ? (
        <iframe src={embed} title={title} frameBorder="0" allow="fullscreen" onLoad={() => setReady(true)} className={live} />
      ) : (
        <Guard fallback={still}>
          <Suspense fallback={null}>
            <Spline scene={scene} onLoad={() => setReady(true)} className={live} />
          </Suspense>
        </Guard>
      )}

      {!active && (
        <button type="button" className="spline-start" onClick={start} aria-label={`Interact with ${title}`}>
          <span className="spline-cta">{ready ? 'Click to interact' : 'Loading 3D…'}</span>
        </button>
      )}

      {active && (
        <div className="spline-bar">
          <span className="spline-hint">{hint}</span>
          <span className="spline-actions">
            {embed && <a href={embed} target="_blank" rel="noopener noreferrer">Full screen ↗</a>}
            <button type="button" onClick={() => setActive(false)}>Done</button>
          </span>
        </div>
      )}
    </div>
  );
}

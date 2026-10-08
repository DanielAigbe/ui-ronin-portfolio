// Contact form (React). Opens the visitor's email app with the message filled in.
// To receive messages directly, swap the mailto step for a POST to a form service such as Formspree.
import { useState } from 'react';
import './ContactForm.css';

const NEEDS = ['Product design', 'Frontend build', 'Brand identity', 'Not sure yet'];

export default function ContactForm({ email }) {
  const [need, setNeed] = useState(NEEDS[0]);
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Project enquiry (${need}) from ${f.get('name')}`;
    const body = `${f.get('message')}\n\n${f.get('name')}\n${f.get('email')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="cf" onSubmit={onSubmit}>
      <label className="cf-label">
        Name
        <input id="c-name" name="name" type="text" placeholder="Your name" required />
      </label>
      <label className="cf-label">
        Email
        <input id="c-email" name="email" type="email" placeholder="you@company.com" required />
      </label>
      <div>
        <span className="cf-label" id="c-need">What do you need?</span>
        <div className="cf-chips" role="group" aria-labelledby="c-need">
          {NEEDS.map((n) => (
            <button key={n} type="button" className={n === need ? 'cf-chip on' : 'cf-chip'} aria-pressed={n === need} onClick={() => setNeed(n)}>
              {n}
            </button>
          ))}
        </div>
      </div>
      <label className="cf-label">
        Message
        <textarea id="c-msg" name="message" placeholder="A few lines about the project, timeline and budget range" required />
      </label>
      <button className="btn cf-send" type="submit">Send message</button>
      {sent && (
        <p className="cf-note" role="status">
          Your email app should now be open with the message ready to send. If nothing opened, email me at {email}.
        </p>
      )}
    </form>
  );
}

import { useState } from "react";
import "./App.css";

export default function LoginPage({ onViewSubjects, onViewAverage }) {
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("Sign-in is not connected yet. Please try again later.");
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 19.5V5.8c0-.7.6-1.3 1.3-1.3H20v15H5.3c-.7 0-1.3-.6-1.3-1.3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M4 17.5c0-.7.6-1.3 1.3-1.3H20M8 8h8M8 11.5h5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-name">Gradebook</span>
        </header>

        <div className="login-content">
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1 id="login-title">Welcome back</h1>
          <p className="login-description">
            Sign in to view your subjects and grades.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            <button type="submit">Sign in</button>
            <p className="form-notice" role="status" aria-live="polite">
              {notice}
            </p>
          </form>
        </div>

        <footer className="login-footer">
          <span className="footer-dot" aria-hidden="true" />
          Your academic progress, all in one place
        </footer>
      </section>
      <button className="sample-link" type="button" onClick={onViewSubjects}>
        View sample subjects
      </button>
      <button
        className="sample-link average-sample-link"
        type="button"
        onClick={onViewAverage}
      >
        View sample average
      </button>
      <p className="page-caption">Simple Grade Management System</p>
    </main>
  );
}

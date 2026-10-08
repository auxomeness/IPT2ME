import { useState } from "react";
import "./App.css";

const sampleGrades = [
  { code: "CS 101", subject: "Introduction to Computing", grade: "86" },
  { code: "MATH 101", subject: "Mathematics in the Modern World", grade: "92" },
  { code: "ENG 101", subject: "Communication Skills", grade: "89" },
  { code: "IT 102", subject: "Programming Fundamentals", grade: "91" },
];

const sampleSubjects = sampleGrades.map(({ code, subject }) => ({ code, subject }));

export default function App() {
  const [activePreview, setActivePreview] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("Sign-in is not connected yet. Please try again later.");
  }

  if (activePreview === "subjects") {
    return (
      <main className="grades-page">
        <header className="grades-topbar">
          <a className="grades-brand" href="/" aria-label="Gradebook home">
            <span className="grades-brand-icon" aria-hidden="true">
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
            <span>Gradebook</span>
          </a>
          <button
            className="grades-back-button"
            onClick={() => setActivePreview("")}
            type="button"
          >
            Back to sign in
          </button>
        </header>

        <section className="grades-content" aria-labelledby="subjects-title">
          <div className="grades-heading">
            <div>
              <p className="grades-eyebrow">YOUR LEARNING</p>
              <h1 id="subjects-title">My subjects</h1>
              <p className="grades-description">
                View the subjects in your academic program.
              </p>
            </div>
            <div
              className="grades-count"
              aria-label={`${sampleSubjects.length} sample subjects`}
            >
              <span className="grades-count-number">{sampleSubjects.length}</span>
              <span className="grades-count-label">Sample subjects</span>
            </div>
          </div>

          <p className="grades-sample-note">
            Preview only: these sample subjects are not connected to live
            student records.
          </p>

          <ul className="subjects-preview-list" aria-label="Sample subject list">
            {sampleSubjects.map((item, index) => (
              <li className="subjects-preview-card" key={item.code}>
                <span className="subjects-preview-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="subjects-preview-details">
                  <span className="grades-subject-code">{item.code}</span>
                  <span className="subjects-preview-name">{item.subject}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="grades-footer">
          Simple Grade Management System · Preview data
        </footer>
      </main>
    );
  }

  if (activePreview === "grades") {
    return (
      <main className="grades-page">
        <header className="grades-topbar">
          <a className="grades-brand" href="/" aria-label="Gradebook home">
            <span className="grades-brand-icon" aria-hidden="true">
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
            <span>Gradebook</span>
          </a>
          <button
            className="grades-back-button"
            onClick={() => setActivePreview("")}
            type="button"
          >
            Back to sign in
          </button>
        </header>

        <section className="grades-content" aria-labelledby="grades-title">
          <div className="grades-heading">
            <div>
              <p className="grades-eyebrow">ACADEMIC OVERVIEW</p>
              <h1 id="grades-title">My grades</h1>
              <p className="grades-description">
                Review your recorded grades by subject.
              </p>
            </div>
            <div
              className="grades-count"
              aria-label={`${sampleGrades.length} sample grade records`}
            >
              <span className="grades-count-number">{sampleGrades.length}</span>
              <span className="grades-count-label">Sample records</span>
            </div>
          </div>

          <p className="grades-sample-note">
            Preview only: these illustrative values are not live student
            records. Grade data and the grading scale are not connected yet.
          </p>

          <div className="grades-table-wrap">
            <table className="grades-table">
              <caption className="visually-hidden">Sample grades by subject</caption>
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Subject</th>
                  <th scope="col" className="grade-column">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleGrades.map((item) => (
                  <tr key={item.code}>
                    <th scope="row">
                      <span className="grades-subject-code">{item.code}</span>
                    </th>
                    <td>{item.subject}</td>
                    <td className="grade-column">
                      <span className="grade-value">{item.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="grades-footer">
          Simple Grade Management System · Preview data
        </footer>
      </main>
    );
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

          <div className="preview-divider">
            <span>For display preview</span>
          </div>
          <button
            className="preview-button"
            onClick={() => setActivePreview("subjects")}
            type="button"
          >
            View sample subjects
          </button>
          <button
            className="preview-button preview-button-secondary"
            onClick={() => setActivePreview("grades")}
            type="button"
          >
            View sample grades
          </button>
        </div>

        <footer className="login-footer">
          <span className="footer-dot" aria-hidden="true" />
          Your academic progress, all in one place
        </footer>
      </section>
      <p className="page-caption">Simple Grade Management System</p>
    </main>
  );
}

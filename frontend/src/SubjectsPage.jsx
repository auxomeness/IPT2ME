import { useEffect, useState } from "react";
import { getSubjects } from "./services/api.js";
import "./App.css";

export default function SubjectsPage({ token }) {
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");

    getSubjects(token, searchTerm)
      .then((response) => {
        if (active) setSubjects(response.data ?? []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load subjects.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, searchTerm]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchTerm(query.trim());
  }

  return (
    <main className="subjects-page">
      <header className="topbar">
        <span className="subjects-brand">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5V5.8c0-.7.6-1.3 1.3-1.3H20v15H5.3c-.7 0-1.3-.6-1.3-1.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M4 17.5c0-.7.6-1.3 1.3-1.3H20M8 8h8M8 11.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span>Gradebook</span>
        </span>
        <span className="portal-label">STUDENT PORTAL</span>
      </header>

      <section className="subjects-content" aria-labelledby="subjects-title">
        <div className="page-heading">
          <div>
            <p className="subjects-eyebrow">YOUR LEARNING</p>
            <h1 id="subjects-title">My subjects</h1>
            <p className="page-description">View the subjects in your academic program.</p>
          </div>
          <div className="subject-count" aria-label={`${subjects.length} subjects`}>
            <span className="count-number">{subjects.length}</span>
            <span className="count-label">Subjects</span>
          </div>
        </div>

        <form className="subject-search" onSubmit={handleSearch} role="search">
          <label className="visually-hidden" htmlFor="subject-search">Search subjects</label>
          <input
            id="subject-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by subject, instructor, or section"
          />
          <button type="submit">Search</button>
          {searchTerm && (
            <button type="button" onClick={() => { setQuery(""); setSearchTerm(""); }}>
              Clear
            </button>
          )}
        </form>

        {isLoading && <p role="status">Loading subjects…</p>}
        {error && <p className="sample-note" role="alert">{error}</p>}
        {!isLoading && !error && subjects.length === 0 && (
          <p className="sample-note">No subjects found.</p>
        )}
        {!isLoading && !error && subjects.length > 0 && (
          <ul className="subject-list" aria-label="Subject list">
            {subjects.map((subject) => (
              <li className="subject-card" key={subject.id}>
                <span className="subject-index" aria-hidden="true">
                  {String(subject.id).padStart(2, "0")}
                </span>
                <span className="subject-details">
                  <span className="subject-code">{subject.section}</span>
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-instructor">{subject.instructor}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer className="page-footer">Simple Grade Management System</footer>
    </main>
  );
}

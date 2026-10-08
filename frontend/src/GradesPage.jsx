import "./App.css";
import sampleGrades from "./sampleGrades.js";

export default function GradesPage({ onBack }) {
  return (
    <main className="grades-page">
      <header className="topbar">
        <button
          className="subjects-brand"
          type="button"
          onClick={onBack}
          aria-label="Back to sign in"
        >
          <span className="brand-icon" aria-hidden="true">
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
        </button>
        <span className="portal-label">STUDENT PORTAL</span>
      </header>

      <section className="grades-content" aria-labelledby="grades-title">
        <div className="grades-heading">
          <div>
            <p className="subjects-eyebrow">ACADEMIC OVERVIEW</p>
            <h1 id="grades-title">My grades</h1>
            <p className="page-description">Review grades by subject.</p>
          </div>
          <div
            className="subject-count"
            aria-label={`${sampleGrades.length} sample grade records`}
          >
            <span className="count-number">{sampleGrades.length}</span>
            <span className="count-label">Sample grades</span>
          </div>
        </div>

        <p className="sample-note">
          Sample preview only. These are illustrative grades, not live student
          records.
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
                    <span className="subject-code">{item.code}</span>
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
      <footer className="page-footer">Simple Grade Management System</footer>
    </main>
  );
}

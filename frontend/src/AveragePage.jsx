import "./App.css";

const sampleGrades = [
  { code: "CS 101", subject: "Introduction to Computing", grade: 86 },
  { code: "MATH 101", subject: "Mathematics in the Modern World", grade: 92 },
  { code: "ENG 101", subject: "Communication Skills", grade: 89 },
  { code: "IT 102", subject: "Programming Fundamentals", grade: 91 },
];

const sampleAverage =
  sampleGrades.reduce((total, item) => total + item.grade, 0) /
  sampleGrades.length;

export default function AveragePage({ onBack }) {
  return (
    <main className="average-page">
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

      <section className="average-content" aria-labelledby="average-title">
        <div className="average-heading">
          <p className="subjects-eyebrow">ACADEMIC OVERVIEW</p>
          <h1 id="average-title">My average</h1>
          <p className="page-description">
            See an example of how your subject grades can be summarized.
          </p>
        </div>

        <p className="average-sample-note">
          Sample preview only. This is an unweighted arithmetic mean of
          illustrative grades, not your live average. The grading scale,
          weighting, and rounding rules have not been set.
        </p>

        <section className="average-summary" aria-label="Sample average result">
          <span className="average-summary-label">SAMPLE AVERAGE</span>
          <strong className="average-value">{sampleAverage.toFixed(1)}</strong>
          <span className="average-summary-caption">
            Across {sampleGrades.length} sample subjects
          </span>
        </section>

        <section className="average-breakdown" aria-labelledby="breakdown-title">
          <h2 id="breakdown-title">Grades included in this example</h2>
          <ul className="average-grade-list">
            {sampleGrades.map((item) => (
              <li className="average-grade-item" key={item.code}>
                <span className="average-grade-subject">
                  <span className="subject-code">{item.code}</span>
                  <span className="subject-name">{item.subject}</span>
                </span>
                <span className="average-grade-value">{item.grade}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <footer className="page-footer">
        Simple Grade Management System · Sample data
      </footer>
    </main>
  );
}

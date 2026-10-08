import "./App.css";

const sampleSubjects = [
  { code: "CS 101", name: "Introduction to Computing" },
  { code: "MATH 101", name: "Mathematics in the Modern World" },
  { code: "ENG 101", name: "Communication Skills" },
  { code: "IT 102", name: "Programming Fundamentals" },
  { code: "SCI 101", name: "Science, Technology, and Society" },
  { code: "PE 101", name: "Physical Education" },
];

export default function SubjectsPage({ onBack }) {
  return (
    <main className="subjects-page">
      <header className="topbar">
        <button className="subjects-brand" type="button" onClick={onBack} aria-label="Back to sign in">
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

      <section className="subjects-content" aria-labelledby="subjects-title">
        <div className="page-heading">
          <div>
            <p className="subjects-eyebrow">YOUR LEARNING</p>
            <h1 id="subjects-title">My subjects</h1>
            <p className="page-description">
              View the subjects in your academic program.
            </p>
          </div>
          <div className="subject-count" aria-label={`${sampleSubjects.length} subjects`}>
            <span className="count-number">{sampleSubjects.length}</span>
            <span className="count-label">Subjects</span>
          </div>
        </div>

        <p className="sample-note">
          Sample subjects are shown while the subject service is not connected.
        </p>

        <ul className="subject-list" aria-label="Subject list">
          {sampleSubjects.map((subject, index) => (
            <li className="subject-card" key={subject.code}>
              <span className="subject-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="subject-details">
                <span className="subject-code">{subject.code}</span>
                <span className="subject-name">{subject.name}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <footer className="page-footer">Simple Grade Management System</footer>
    </main>
  );
}

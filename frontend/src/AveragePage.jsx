import { useEffect, useState } from "react";
import { getStudentAverage } from "./services/api.js";
import "./App.css";

export default function AveragePage({ token, student }) {
  const [average, setAverage] = useState(null);
  const [gradeCount, setGradeCount] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");

    getStudentAverage(token, student.id)
      .then((response) => {
        if (!active) return;
        setAverage(response.data?.average ?? null);
        setGradeCount(response.data?.grade_count ?? 0);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load your average.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, student.id]);

  return (
    <main className="average-page">
      <header className="topbar">
        <span className="subjects-brand">Gradebook</span>
        <span className="portal-label">STUDENT PORTAL</span>
      </header>
      <section className="average-content" aria-labelledby="average-title">
        <div className="average-heading">
          <p className="subjects-eyebrow">ACADEMIC OVERVIEW</p>
          <h1 id="average-title">My average</h1>
          <p className="page-description">Your average across recorded grades.</p>
        </div>

        {isLoading && <p role="status">Calculating your average…</p>}
        {error && <p className="sample-note" role="alert">{error}</p>}
        {!isLoading && !error && (
          <section className="average-summary" aria-label="Your average result">
            <span className="average-summary-label">CURRENT AVERAGE</span>
            <strong className="average-value">
              {average === null ? "—" : Number(average).toFixed(2)}
            </strong>
            <span className="average-summary-caption">
              {gradeCount === 0 ? "No grades recorded" : `Calculated from ${gradeCount} grades`}
            </span>
          </section>
        )}
      </section>
      <footer className="page-footer">Simple Grade Management System</footer>
    </main>
  );
}

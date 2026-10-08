import { useEffect, useState } from "react";
import { getStudentGrades, getSubjects } from "./services/api.js";
import "./App.css";

export default function GradesPage({ token, student }) {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");

    Promise.all([
      getStudentGrades(token, student.id),
      getSubjects(token),
    ])
      .then(([gradeResponse, subjectResponse]) => {
        if (!active) return;
        setGrades(gradeResponse.data ?? []);
        setSubjects(subjectResponse.data ?? []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load grades.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, student.id]);

  const subjectsById = new Map(subjects.map((subject) => [subject.id, subject]));

  return (
    <main className="grades-page">
      <header className="topbar">
        <span className="subjects-brand">Gradebook</span>
        <span className="portal-label">STUDENT PORTAL</span>
      </header>
      <section className="grades-content" aria-labelledby="grades-title">
        <div className="grades-heading">
          <div>
            <p className="subjects-eyebrow">ACADEMIC OVERVIEW</p>
            <h1 id="grades-title">My grades</h1>
            <p className="page-description">Review your grades by subject.</p>
          </div>
          <div className="subject-count" aria-label={`${grades.length} grade records`}>
            <span className="count-number">{grades.length}</span>
            <span className="count-label">Grades</span>
          </div>
        </div>

        {isLoading && <p role="status">Loading grades…</p>}
        {error && <p className="sample-note" role="alert">{error}</p>}
        {!isLoading && !error && grades.length === 0 && (
          <p className="sample-note">No grades are available yet.</p>
        )}
        {!isLoading && !error && grades.length > 0 && (
          <div className="grades-table-wrap">
            <table className="grades-table">
              <caption className="visually-hidden">Your grades by subject</caption>
              <thead>
                <tr>
                  <th scope="col">Section</th>
                  <th scope="col">Subject</th>
                  <th scope="col" className="grade-column">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((item) => {
                  const subject = subjectsById.get(item.subject_id);
                  return (
                    <tr key={item.id}>
                      <th scope="row"><span className="subject-code">{subject?.section ?? item.subject_id}</span></th>
                      <td>{subject?.name ?? `Subject ${item.subject_id}`}</td>
                      <td className="grade-column"><span className="grade-value">{item.grade}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer className="page-footer">Simple Grade Management System</footer>
    </main>
  );
}

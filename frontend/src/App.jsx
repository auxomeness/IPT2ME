import { createElement, useState } from "react";
import AveragePage from "./AveragePage.jsx";
import GradesPage from "./GradesPage.jsx";
import LoginPage from "./LoginPage.jsx";
import SubjectsPage from "./SubjectsPage.jsx";

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "subjects") {
    return createElement(SubjectsPage, { onBack: () => setPage("login") });
  }

  if (page === "grades") {
    return createElement(GradesPage, { onBack: () => setPage("login") });
  }

  if (page === "average") {
    return createElement(AveragePage, { onBack: () => setPage("login") });
  }

  return createElement(LoginPage, {
    onViewSubjects: () => setPage("subjects"),
    onViewGrades: () => setPage("grades"),
    onViewAverage: () => setPage("average"),
  });
}

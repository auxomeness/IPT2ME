import { createElement, useState } from "react";
import LoginPage from "./LoginPage.jsx";
import SubjectsPage from "./SubjectsPage.jsx";

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "subjects") {
    return createElement(SubjectsPage, { onBack: () => setPage("login") });
  }

  return createElement(LoginPage, { onViewSubjects: () => setPage("subjects") });
}
